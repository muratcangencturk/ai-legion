import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// --- ENV VARS (Cloudflare Secrets) ---
// In a real application, these should be set as environment variables/secrets.
// For this exercise, we define them here.
const JWT_SECRET = 'your-super-secret-and-long-random-string-for-hmac';
const SUPABASE_URL = 'https://cnxeckhygerxdhlahimp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNueGVja2h5Z2VyeGRobGFoaW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1OTQ1MTYsImV4cCI6MjA5MDE3MDUxNn0.fQsNzmKcqNJAdCS9ts226xzWOllK8lnt3tTUyCEAD5Q';

// --- UTILITY FUNCTIONS ---

/**
 * Hashes a password using SHA-256.
 * @param {string} password The password to hash.
 * @returns {Promise<string>} The hex-encoded hash.
 */
async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates a JWT-like token signed with HMAC-SHA256.
 * @param {object} payload The payload to sign.
 * @returns {Promise<string>} The signed token.
 */
async function signToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(JWT_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  return `${data}.${encodedSignature}`;
}

/**
 * Verifies a JWT-like token.
 * @param {string} token The token to verify.
 * @returns {Promise<object|null>} The payload if valid, otherwise null.
 */
async function verifyToken(token) {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    const data = `${encodedHeader}.${encodedPayload}`;
    const signature = new Uint8Array(atob(encodedSignature.replace(/-/g, '+').replace(/_/g, '/')).split('').map(c => c.charCodeAt(0)));

    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(JWT_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const isValid = await crypto.subtle.verify('HMAC', key, signature, new TextEncoder().encode(data));

    if (isValid) {
      return JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')));
    }
    return null;
  } catch (e) {
    return null;
  }
}

// --- MIDDLEWARE ---

/**
 * Middleware to authenticate users from the Authorization header.
 */
async function authMiddleware(c, next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
  }
  const token = authHeader.substring(7);
  const payload = await verifyToken(token);
  if (!payload) {
    return c.json({ error: 'Unauthorized: Invalid token' }, 401);
  }
  c.set('user', payload);
  await next();
}

// --- SUPABASE CLIENT ---

const supabaseHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function supabase(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: { ...supabaseHeaders, ...(options.headers || {}) },
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Supabase error: ${errorText}`);
    throw new Error(`Supabase request failed: ${response.statusText}`);
  }
  return response.json();
}

// --- APP SETUP ---

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

// --- PUBLIC ROUTES ---

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Get all posts (publicly accessible)
app.get('/api/posts', async (c) => {
  try {
    const posts = await supabase('/posts?select=*,user:users(username,avatar_url)&order=created_at.desc&limit=50');
    // Supabase can join data, but for counts let's do it manually for now
    const postsWithCounts = await Promise.all(posts.map(async (post) => {
        const [likes, comments, reposts] = await Promise.all([
            supabase(`/likes?post_id=eq.${post.id}&select=user_id`),
            supabase(`/comments?post_id=eq.${post.id}&select=id`),
            supabase(`/reposts?post_id=eq.${post.id}&select=user_id`)
        ]);
        return { ...post, likes_count: likes.length, comments_count: comments.length, reposts_count: reposts.length };
    }));
    return c.json(postsWithCounts);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (c) => {
  try {
    const { username, password, email } = await c.req.json();
    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400);
    }

    const existing = await supabase(`/users?username=eq.${username}&limit=1`);
    if (existing.length > 0) {
      return c.json({ error: 'Username already taken' }, 409);
    }

    const hashedPassword = await hashPassword(password);
    const [newUser] = await supabase('/users', {
      method: 'POST',
      body: JSON.stringify({ username, password_hash: hashedPassword, email: email || '' }),
    });

    const token = await signToken({ id: newUser.id, username: newUser.username, is_admin: newUser.is_admin });
    delete newUser.password_hash;
    return c.json({ user: newUser, token });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/api/auth/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    const [user] = await supabase(`/users?username=eq.${username}&limit=1`);

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const hashedPassword = await hashPassword(password);
    if (user.password_hash !== hashedPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = await signToken({ id: user.id, username: user.username, is_admin: user.is_admin });
    delete user.password_hash;
    return c.json({ user, token });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// --- PROTECTED ROUTES (require authentication) ---

app.use('/api/posts/*', authMiddleware);
app.use('/api/users/:username/follow', authMiddleware);
app.use('/api/admin/*', authMiddleware);

// Create a new post
app.post('/api/posts', async (c) => {
    try {
        const user = c.get('user');
        const { content, image_url } = await c.req.json();
        if (!content) {
            return c.json({ error: 'Content is required' }, 400);
        }
        const [newPost] = await supabase('/posts', {
            method: 'POST',
            body: JSON.stringify({ user_id: user.id, content, image_url: image_url || null })
        });
        return c.json(newPost, 201);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// Delete a post
app.delete('/api/posts/:id', async (c) => {
  try {
    const user = c.get('user');
    const postId = c.req.param('id');
    const [post] = await supabase(`/posts?id=eq.${postId}&limit=1`);

    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    if (post.user_id !== user.id && !user.is_admin) {
      return c.json({ error: 'Forbidden: You can only delete your own posts' }, 403);
    }

    await supabase(`/posts?id=eq.${postId}`, { method: 'DELETE' });
    return c.json({ success: true }, 200);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// Like/unlike a post
app.post('/api/posts/:id/like', async (c) => {
    try {
        const user = c.get('user');
        const postId = c.req.param('id');
        const existing = await supabase(`/likes?user_id=eq.${user.id}&post_id=eq.${postId}`);

        if (existing.length > 0) {
            await supabase(`/likes?user_id=eq.${user.id}&post_id=eq.${postId}`, { method: 'DELETE' });
            return c.json({ liked: false });
        } else {
            await supabase('/likes', { method: 'POST', body: JSON.stringify({ user_id: user.id, post_id: postId }) });
            return c.json({ liked: true });
        }
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// Repost a post
app.post('/api/posts/:id/repost', async (c) => {
    try {
        const user = c.get('user');
        const postId = c.req.param('id');
        const existing = await supabase(`/reposts?user_id=eq.${user.id}&post_id=eq.${postId}`);

        if (existing.length > 0) {
            await supabase(`/reposts?user_id=eq.${user.id}&post_id=eq.${postId}`, { method: 'DELETE' });
            return c.json({ reposted: false });
        } else {
            await supabase('/reposts', { method: 'POST', body: JSON.stringify({ user_id: user.id, post_id: postId }) });
            return c.json({ reposted: true });
        }
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// Comment on a post
app.post('/api/posts/:id/comment', async (c) => {
    try {
        const user = c.get('user');
        const postId = c.req.param('id');
        const { content } = await c.req.json();
        if (!content) {
            return c.json({ error: 'Comment content is required' }, 400);
        }
        const [newComment] = await supabase('/comments', {
            method: 'POST',
            body: JSON.stringify({ user_id: user.id, post_id: postId, content })
        });
        return c.json(newComment, 201);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// Bookmark a post
app.post('/api/posts/:id/bookmark', async (c) => {
    try {
        const user = c.get('user');
        const postId = c.req.param('id');
        const existing = await supabase(`/bookmarks?user_id=eq.${user.id}&post_id=eq.${postId}`);

        if (existing.length > 0) {
            await supabase(`/bookmarks?user_id=eq.${user.id}&post_id=eq.${postId}`, { method: 'DELETE' });
            return c.json({ bookmarked: false });
        } else {
            await supabase('/bookmarks', { method: 'POST', body: JSON.stringify({ user_id: user.id, post_id: postId }) });
            return c.json({ bookmarked: true });
        }
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// Follow a user
app.post('/api/users/:username/follow', async (c) => {
    try {
        const user = c.get('user');
        const targetUsername = c.req.param('username');
        const [targetUser] = await supabase(`/users?username=eq.${targetUsername}&limit=1`);

        if (!targetUser) {
            return c.json({ error: 'User not found' }, 404);
        }
        if (user.id === targetUser.id) {
            return c.json({ error: 'Cannot follow yourself' }, 400);
        }

        const existing = await supabase(`/follows?follower_id=eq.${user.id}&following_id=eq.${targetUser.id}`);

        if (existing.length > 0) {
            await supabase(`/follows?follower_id=eq.${user.id}&following_id=eq.${targetUser.id}`, { method: 'DELETE' });
            return c.json({ following: false });
        } else {
            await supabase('/follows', { method: 'POST', body: JSON.stringify({ follower_id: user.id, following_id: targetUser.id }) });
            return c.json({ following: true });
        }
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// Get user profile (publicly accessible)
app.get('/api/users/:username', async (c) => {
  try {
    const username = c.req.param('username');
    const [user] = await supabase(`/users?username=eq.${username}&limit=1`);
    if (!user) return c.json({ error: 'User not found' }, 404);

    const [posts, followers, following] = await Promise.all([
      supabase(`/posts?user_id=eq.${user.id}&order=created_at.desc`),
      supabase(`/follows?following_id=eq.${user.id}`),
      supabase(`/follows?follower_id=eq.${user.id}`)
    ]);

    delete user.password_hash; // Never expose password hash
    return c.json({ ...user, posts, followers_count: followers.length, following_count: following.length });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// --- ARTICLES (Admin only for POST, public for GET) ---

app.post('/api/articles', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user.is_admin) {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }
    const body = await c.req.json();
    const [newArticle] = await supabase('/articles', { method: 'POST', body: JSON.stringify(body) });
    return c.json(newArticle, 201);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.get('/api/articles', async (c) => {
  try {
    const articles = await supabase('/articles?order=created_at.desc&limit=20');
    return c.json(articles);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// --- TOOLS (Publicly accessible) ---

app.get('/api/tools', async (c) => {
  const tools = [
    { id: 1, name: 'ChatGPT', category: 'LLM', description: 'OpenAI\'nin güçlü dil modeli', url: 'https://chat.openai.com', free: true, rating: 4.8 },
    { id: 2, name: 'Claude', category: 'LLM', description: 'Anthropic\'in güvenli AI asistanı', url: 'https://claude.ai', free: true, rating: 4.7 },
    { id: 3, name: 'Gemini', category: 'LLM', description: 'Google\'ın multimodal AI modeli', url: 'https://gemini.google.com', free: true, rating: 4.6 },
    { id: 4, name: 'Midjourney', category: 'Görüntü', description: 'En iyi AI görüntü üretici', url: 'https://midjourney.com', free: false, rating: 4.9 },
    { id: 5, name: 'DALL-E 3', category: 'Görüntü', description: 'OpenAI görüntü üretici', url: 'https://openai.com/dall-e-3', free: false, rating: 4.5 },
    { id: 6, name: 'Stable Diffusion', category: 'Görüntü', description: 'Açık kaynak görüntü üretici', url: 'https://stability.ai', free: true, rating: 4.3 },
    { id: 7, name: 'ElevenLabs', category: 'Ses', description: 'Gerçekçi ses klonlama', url: 'https://elevenlabs.io', free: true, rating: 4.8 },
    { id: 8, name: 'Suno', category: 'Müzik', description: 'AI müzik üretici', url: 'https://suno.ai', free: true, rating: 4.6 },
    { id: 9, name: 'Runway', category: 'Video', description: 'AI video üretici ve düzenleyici', url: 'https://runway.com', free: true, rating: 4.5 },
    { id: 10, name: 'Cursor', category: 'Geliştirici', description: 'AI destekli kod editörü', url: 'https://cursor.sh', free: true, rating: 4.7 },
    { id: 11, name: 'Perplexity', category: 'Arama', description: 'AI destekli arama motoru', url: 'https://perplexity.ai', free: true, rating: 4.6 },
    { id: 12, name: 'Kling AI', category: 'Video', description: 'Çin\'in güçlü video AI\'ı', url: 'https://klingai.com', free: true, rating: 4.4 }
  ];
  return c.json(tools);
});

// --- SITE SETTINGS / CONTENT MANAGEMENT (CRUD) ---

// Get all site settings (features, header, footer)
app.get('/api/site-settings', async (c) => {
  try {
    const settings = await supabase('/site_settings?order=key.asc');
    const result = {};
    settings.forEach(setting => {
      result[setting.key] = setting.value;
    });
    return c.json(result);
  } catch (e) {
    // Return default structure if table doesn't exist
    return c.json({
      features: JSON.stringify([]),
      header: JSON.stringify({ title: '', description: '', image_url: '', image_size: 'medium', image_position: 'center' }),
      footer: JSON.stringify({ text: '', image_url: '', image_size: 'medium', image_position: 'center' })
    });
  }
});

// Get specific site setting
app.get('/api/site-settings/:key', async (c) => {
  try {
    const key = c.req.param('key');
    const settings = await supabase(`/site_settings?key=eq.${key}`);
    if (settings.length === 0) {
      return c.json({ error: 'Setting not found' }, 404);
    }
    return c.json({ key: settings[0].key, value: settings[0].value });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// Update/Create site setting (Admin only)
app.put('/api/site-settings/:key', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user.is_admin) {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }
    
    const key = c.req.param('key');
    const { value } = await c.req.json();
    
    if (!value) {
      return c.json({ error: 'Value is required' }, 400);
    }

    // Try to update first
    try {
      const result = await supabase(`/site_settings?key=eq.${key}`, {
        method: 'PATCH',
        body: JSON.stringify({ value })
      });
      return c.json({ key, value, updated: true });
    } catch (e) {
      // If update fails, try insert
      const result = await supabase('/site_settings', {
        method: 'POST',
        body: JSON.stringify({ key, value })
      });
      return c.json({ key, value, created: true }, 201);
    }
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// Delete site setting (Admin only)
app.delete('/api/site-settings/:key', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user.is_admin) {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }
    
    const key = c.req.param('key');
    await supabase(`/site_settings?key=eq.${key}`, { method: 'DELETE' });
    return c.json({ success: true, deleted: key });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// --- ADMIN ROUTES ---

// Admin-only middleware
app.use('/api/admin/*', authMiddleware, async (c, next) => {
    const user = c.get('user');
    if (!user.is_admin) {
        return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }
    await next();
});

app.get('/api/admin/stats', async (c) => {
    try {
        const users = await supabase('/users');
        const posts = await supabase('/posts');
        const articles = await supabase('/articles');
        return c.json({ users_count: users.length, posts_count: posts.length, articles_count: articles.length });
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

app.delete('/api/admin/users/:id', async (c) => {
    try {
        const userId = c.req.param('id');
        await supabase(`/users?id=eq.${userId}`, { method: 'DELETE' });
        return c.json({ success: true }, 200);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

export default app;
