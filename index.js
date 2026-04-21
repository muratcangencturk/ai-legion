import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

const SUPABASE_URL = 'https://cnxeckhygerxdhlahimp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-Q9jXB9o2XHE39H4GL9lqw_eulC8lK5';


const supabaseHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function supabase(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: { ...supabaseHeaders, ...(options.headers || {}) }
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ============ POSTS ============
app.get('/api/posts', async (c) => {
  try {
    const posts = await supabase('/posts?order=created_at.desc&limit=50');
    const postsWithUsers = await Promise.all(posts.map(async (post) => {
      try {
        const users = await supabase(`/users?id=eq.${post.user_id}&limit=1`);
        const user = users[0] ? { id: users[0].id, username: users[0].username, avatar_url: users[0].avatar_url, bio: users[0].bio, is_admin: users[0].is_admin } : { username: 'unknown', avatar_url: '' };
        const likes = await supabase(`/likes?post_id=eq.${post.id}`);
        const comments = await supabase(`/comments?post_id=eq.${post.id}`);
        const reposts = await supabase(`/reposts?post_id=eq.${post.id}`);
        return { ...post, user, likes_count: likes.length, comments_count: comments.length, reposts_count: reposts.length };
      } catch {
        return { ...post, user: { username: 'unknown', avatar_url: '' }, likes_count: 0, comments_count: 0, reposts_count: 0 };
      }
    }));
    return c.json(postsWithUsers);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/api/posts', async (c) => {
  try {
    const body = await c.req.json();
    const result = await supabase('/posts', { method: 'POST', body: JSON.stringify({ user_id: body.user_id, content: body.content, image_url: body.image_url || '' }) });
    return c.json(result[0]);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.delete('/api/posts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await supabase(`/posts?id=eq.${id}`, { method: 'DELETE' });
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// ============ LIKES ============
app.post('/api/posts/:id/like', async (c) => {
  try {
    const post_id = c.req.param('id');
    const body = await c.req.json();
    const existing = await supabase(`/likes?user_id=eq.${body.user_id}&post_id=eq.${post_id}`);
    if (existing.length > 0) {
      await supabase(`/likes?user_id=eq.${body.user_id}&post_id=eq.${post_id}`, { method: 'DELETE' });
      return c.json({ liked: false });
    } else {
      await supabase('/likes', { method: 'POST', body: JSON.stringify({ user_id: body.user_id, post_id }) });
      return c.json({ liked: true });
    }
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// ============ REPOSTS ============
app.post('/api/posts/:id/repost', async (c) => {
  try {
    const post_id = c.req.param('id');
    const body = await c.req.json();
    const existing = await supabase(`/reposts?user_id=eq.${body.user_id}&post_id=eq.${post_id}`);
    if (existing.length > 0) {
      await supabase(`/reposts?user_id=eq.${body.user_id}&post_id=eq.${post_id}`, { method: 'DELETE' });
      return c.json({ reposted: false });
    } else {
      await supabase('/reposts', { method: 'POST', body: JSON.stringify({ user_id: body.user_id, post_id }) });
      return c.json({ reposted: true });
    }
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// ============ COMMENTS ============
app.get('/api/posts/:id/comments', async (c) => {
  try {
    const post_id = c.req.param('id');
    const comments = await supabase(`/comments?post_id=eq.${post_id}&order=created_at.asc`);
    return c.json(comments);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/api/posts/:id/comment', async (c) => {
  try {
    const post_id = c.req.param('id');
    const body = await c.req.json();
    const result = await supabase('/comments', { method: 'POST', body: JSON.stringify({ user_id: body.user_id, post_id, content: body.content }) });
    return c.json(result[0]);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// ============ BOOKMARKS ============
app.post('/api/posts/:id/bookmark', async (c) => {
  try {
    const post_id = c.req.param('id');
    const body = await c.req.json();
    const existing = await supabase(`/bookmarks?user_id=eq.${body.user_id}&post_id=eq.${post_id}`);
    if (existing.length > 0) {
      await supabase(`/bookmarks?user_id=eq.${body.user_id}&post_id=eq.${post_id}`, { method: 'DELETE' });
      return c.json({ bookmarked: false });
    } else {
      await supabase('/bookmarks', { method: 'POST', body: JSON.stringify({ user_id: body.user_id, post_id }) });
      return c.json({ bookmarked: true });
    }
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// ============ USERS ============
app.get('/api/users/:username', async (c) => {
  try {
    const username = c.req.param('username');
    const users = await supabase(`/users?username=eq.${username}&limit=1`);
    if (!users.length) return c.json({ error: 'User not found' }, 404);
    const user = users[0];
    const posts = await supabase(`/posts?user_id=eq.${user.id}&order=created_at.desc`);
    const followers = await supabase(`/follows?following_id=eq.${user.id}`);
    const following = await supabase(`/follows?follower_id=eq.${user.id}`);
    return c.json({ ...user, password_hash: undefined, posts, followers_count: followers.length, following_count: following.length });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/api/users/:username/follow', async (c) => {
  try {
    const username = c.req.param('username');
    const body = await c.req.json();
    const users = await supabase(`/users?username=eq.${username}&limit=1`);
    if (!users.length) return c.json({ error: 'User not found' }, 404);
    const following_id = users[0].id;
    const existing = await supabase(`/follows?follower_id=eq.${body.follower_id}&following_id=eq.${following_id}`);
    if (existing.length > 0) {
      await supabase(`/follows?follower_id=eq.${body.follower_id}&following_id=eq.${following_id}`, { method: 'DELETE' });
      return c.json({ following: false });
    } else {
      await supabase('/follows', { method: 'POST', body: JSON.stringify({ follower_id: body.follower_id, following_id }) });
      return c.json({ following: true });
    }
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// ============ AUTH ============
app.post('/api/auth/register', async (c) => {
  try {
    const body = await c.req.json();
    const existing = await supabase(`/users?username=eq.${body.username}&limit=1`);
    if (existing.length > 0) return c.json({ error: 'Bu kullanıcı adı alınmış' }, 400);
    const result = await supabase('/users', { method: 'POST', body: JSON.stringify({ username: body.username, email: body.email || '', password_hash: body.password, bio: '', avatar_url: '', is_admin: false }) });
    const user = result[0];
    return c.json({ user: { ...user, password_hash: undefined }, token: btoa(JSON.stringify({ id: user.id, username: user.username, is_admin: user.is_admin })) });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/api/auth/login', async (c) => {
  try {
    const body = await c.req.json();
    const users = await supabase(`/users?username=eq.${body.username}&limit=1`);
    if (!users.length) return c.json({ error: 'Kullanıcı bulunamadı' }, 404);
    const user = users[0];
    if (user.password_hash !== body.password) return c.json({ error: 'Şifre hatalı' }, 401);
    return c.json({ user: { ...user, password_hash: undefined }, token: btoa(JSON.stringify({ id: user.id, username: user.username, is_admin: user.is_admin })) });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// ============ ARTICLES ============
app.get('/api/articles', async (c) => {
  try {
    const articles = await supabase('/articles?order=created_at.desc&limit=20');
    return c.json(articles);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/api/articles', async (c) => {
  try {
    const body = await c.req.json();
    const result = await supabase('/articles', { method: 'POST', body: JSON.stringify(body) });
    return c.json(result[0]);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.delete('/api/articles/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await supabase(`/articles?id=eq.${id}`, { method: 'DELETE' });
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// ============ TOOLS ============
app.get('/api/tools', async (c) => {
  const tools = [
    // LLM
    { id: 1, name: 'Claude Opus 4.6', category: 'LLM', description: 'Anthropic\'in en güçlü modeli. LMSYS Arena #1 (1506 Elo). SWE-bench: 74%+, MMLU: 88.7%', url: 'https://claude.ai', free: true, rating: 4.9, benchmark: { lmsys: 1506, swe_bench: '74.2%', mmlu: '88.7%', aime: '85%' }, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/512px-Claude_AI_logo.svg.png' },
    { id: 2, name: 'GPT-5.4', category: 'LLM', description: 'OpenAI\'nin flagship modeli. LMSYS Arena #2 (1498 Elo). SWE-bench: 74.9%, MMLU: 88.2%', url: 'https://chat.openai.com', free: true, rating: 4.9, benchmark: { lmsys: 1498, swe_bench: '74.9%', mmlu: '88.2%', aime: '83%' }, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png' },
    { id: 3, name: 'Gemini 3.1 Pro', category: 'LLM', description: 'Google\'ın multimodal modeli. LMSYS Arena #3 (1489 Elo). SWE-bench: 80.6%, MMLU: 87.9%', url: 'https://gemini.google.com', free: true, rating: 4.8, benchmark: { lmsys: 1489, swe_bench: '80.6%', mmlu: '87.9%', aime: '79%' }, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/512px-Google_Gemini_logo.svg.png' },
    { id: 4, name: 'Grok 4', category: 'LLM', description: 'xAI\'nin hızlı modeli. SWE-bench liderliği: 75%. Gerçek zamanlı X/Twitter erişimi', url: 'https://grok.x.ai', free: true, rating: 4.7, benchmark: { lmsys: 1471, swe_bench: '75%', mmlu: '87.1%', aime: '78%' }, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Grok_logo.svg/512px-Grok_logo.svg.png' },
    { id: 5, name: 'DeepSeek V3', category: 'LLM', description: 'Çin\'in açık kaynak devi. GPT-4 seviyesi performans, tamamen ücretsiz. MMLU: 87.1%', url: 'https://chat.deepseek.com', free: true, rating: 4.7, benchmark: { lmsys: 1452, swe_bench: '49.2%', mmlu: '87.1%', aime: '39.2%' }, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/DeepSeek_logo.svg/512px-DeepSeek_logo.svg.png' },
    { id: 6, name: 'Llama 4 Scout', category: 'LLM', description: 'Meta\'nın açık kaynak modeli. 10M token context window. Ücretsiz deploy edilebilir', url: 'https://llama.meta.com', free: true, rating: 4.5, benchmark: { lmsys: 1421, swe_bench: '32%', mmlu: '79.6%', aime: '50%' }, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/512px-Meta-Logo.png' },
    // Görüntü
    { id: 7, name: 'Midjourney V7', category: 'Görüntü', description: 'Sanatsal görüntü üretiminde altın standart. V7 ile dramatik kalite artışı', url: 'https://midjourney.com', free: false, rating: 4.9, benchmark: null, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Midjourney_Emblem.png/512px-Midjourney_Emblem.png' },
    { id: 8, name: 'Flux 1.1 Pro', category: 'Görüntü', description: 'Gerçekçi fotoğraf kalitesinde görüntüler. DALL-E 3\'ü geride bıraktı', url: 'https://fal.ai/models/fal-ai/flux-pro', free: false, rating: 4.8, benchmark: null, image: 'https://fal.ai/favicon.ico' },
    { id: 9, name: 'GPT Image 1.5', category: 'Görüntü', description: 'OpenAI\'nin görüntü üreticisi. ChatGPT ile entegre, metin+görüntü', url: 'https://chat.openai.com', free: true, rating: 4.6, benchmark: null, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png' },
    { id: 10, name: 'Ideogram 3.0', category: 'Görüntü', description: 'Metin içeren görsellerde en iyi. Logo, poster, tipografi için ideal', url: 'https://ideogram.ai', free: true, rating: 4.6, benchmark: null, image: 'https://ideogram.ai/favicon.ico' },
    { id: 11, name: 'Stable Diffusion 3.5', category: 'Görüntü', description: 'Açık kaynak görüntü üretici. Yerel çalıştırılabilir, sınırsız üretim', url: 'https://stability.ai', free: true, rating: 4.4, benchmark: null, image: 'https://stability.ai/favicon.ico' },
    // Video
    { id: 12, name: 'Google Veo 3.1', category: 'Video', description: 'Sora\'nın yerini alan en iyi video AI. Sinematik kalite, 4K çıktı', url: 'https://deepmind.google/technologies/veo/', free: false, rating: 4.9, benchmark: null, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/512px-Google_Gemini_logo.svg.png' },
    { id: 13, name: 'Runway Gen-4.5', category: 'Video', description: 'Profesyonel video üretici. Karakter tutarlılığı ve sahne kontrolü mükemmel', url: 'https://runwayml.com', free: true, rating: 4.7, benchmark: null, image: 'https://runwayml.com/favicon.ico' },
    { id: 14, name: 'Kling AI 3.0', category: 'Video', description: 'Sinematik gerçekçilik lideri. 2 dakikaya kadar video, 1080p çıktı', url: 'https://klingai.com', free: true, rating: 4.7, benchmark: null, image: 'https://klingai.com/favicon.ico' },
    { id: 15, name: 'Wan 2.2', category: 'Video', description: 'Açık kaynak video üretici. Hızlı ve ücretsiz, yerel çalıştırılabilir', url: 'https://wanvideo.ai', free: true, rating: 4.4, benchmark: null, image: 'https://wanvideo.ai/favicon.ico' },
    // Ses
    { id: 16, name: 'ElevenLabs v3', category: 'Ses', description: 'Ses klonlama ve TTS lideri. 30 saniye sesle mükemmel klonlama', url: 'https://elevenlabs.io', free: true, rating: 4.9, benchmark: null, image: 'https://elevenlabs.io/favicon.ico' },
    { id: 17, name: 'Cartesia', category: 'Ses', description: '90ms gecikme ile en hızlı TTS. Voice agent geliştirme için ideal', url: 'https://cartesia.ai', free: true, rating: 4.7, benchmark: null, image: 'https://cartesia.ai/favicon.ico' },
    { id: 18, name: 'Suno v4', category: 'Müzik', description: 'Sözlü müzik üretiminde lider. Profesyonel kalitede şarkı üretimi', url: 'https://suno.ai', free: true, rating: 4.8, benchmark: null, image: 'https://suno.ai/favicon.ico' },
    { id: 19, name: 'Udio', category: 'Müzik', description: 'Suno\'nun rakibi. Farklı müzik stillerinde yüksek kalite', url: 'https://udio.com', free: true, rating: 4.6, benchmark: null, image: 'https://udio.com/favicon.ico' },
    // Geliştirici
    { id: 20, name: 'Cursor', category: 'Geliştirici', description: 'AI destekli en iyi kod editörü. Claude + GPT entegrasyonu', url: 'https://cursor.sh', free: true, rating: 4.8, benchmark: null, image: 'https://cursor.sh/favicon.ico' },
    { id: 21, name: 'GitHub Copilot', category: 'Geliştirici', description: 'GitHub\'ın AI kod asistanı. Her IDE ile entegre', url: 'https://github.com/features/copilot', free: false, rating: 4.6, benchmark: null, image: 'https://github.com/favicon.ico' },
    { id: 22, name: 'Windsurf', category: 'Geliştirici', description: 'Codeium\'un AI editörü. Cursor\'a güçlü rakip, ücretsiz tier geniş', url: 'https://codeium.com/windsurf', free: true, rating: 4.6, benchmark: null, image: 'https://codeium.com/favicon.ico' },
    // Arama & Ajan
    { id: 23, name: 'Perplexity Pro', category: 'Arama', description: 'AI destekli arama motoru. Gerçek zamanlı web erişimi, kaynak gösterimi', url: 'https://perplexity.ai', free: true, rating: 4.7, benchmark: null, image: 'https://perplexity.ai/favicon.ico' },
    { id: 24, name: 'Manus', category: 'Ajan', description: 'Otonom AI ajan. Web gezme, kod yazma, dosya yönetimi yapabilir', url: 'https://manus.im', free: true, rating: 4.8, benchmark: null, image: 'https://manus.im/favicon.ico' },
    { id: 25, name: 'n8n', category: 'Otomasyon', description: 'Açık kaynak AI otomasyon platformu. 400+ entegrasyon, self-host edilebilir', url: 'https://n8n.io', free: true, rating: 4.7, benchmark: null, image: 'https://n8n.io/favicon.ico' },
  ];
  return c.json(tools);
});

// ============ MODELS (Benchmark) ============
app.get('/api/models', async (c) => {
  const models = [
    { rank: 1, name: 'Claude Opus 4.6', company: 'Anthropic', lmsys_elo: 1506, mmlu: 88.7, swe_bench: 74.2, aime: 85.0, humaneval: 92.1, gpqa: 78.3, release: '2026-01', free: true, url: 'https://claude.ai', description: 'Anthropic\'in en güçlü modeli. Uzun bağlam anlama, kod yazma ve analiz konularında sektör lideri.' },
    { rank: 2, name: 'GPT-5.4', company: 'OpenAI', lmsys_elo: 1498, mmlu: 88.2, swe_bench: 74.9, aime: 83.0, humaneval: 91.8, gpqa: 77.9, release: '2026-01', free: true, url: 'https://chat.openai.com', description: 'OpenAI\'nin flagship modeli. SWE-bench\'te en yüksek skor. Multimodal yetenekleri güçlü.' },
    { rank: 3, name: 'Gemini 3.1 Pro', company: 'Google', lmsys_elo: 1489, mmlu: 87.9, swe_bench: 80.6, aime: 79.0, humaneval: 90.2, gpqa: 75.8, release: '2026-02', free: true, url: 'https://gemini.google.com', description: 'Google\'ın multimodal devi. SWE-bench\'te 80.6% ile kod yazımında öne çıkıyor.' },
    { rank: 4, name: 'Grok 4', company: 'xAI', lmsys_elo: 1471, mmlu: 87.1, swe_bench: 75.0, aime: 78.0, humaneval: 89.4, gpqa: 74.2, release: '2025-12', free: true, url: 'https://grok.x.ai', description: 'Elon Musk\'ın xAI şirketinin modeli. Gerçek zamanlı X/Twitter verisi erişimi ile öne çıkıyor.' },
    { rank: 5, name: 'Claude Sonnet 4.6', company: 'Anthropic', lmsys_elo: 1463, mmlu: 87.5, swe_bench: 82.1, aime: 80.0, humaneval: 91.2, gpqa: 76.1, release: '2026-01', free: true, url: 'https://claude.ai', description: 'SWE-bench\'te 82.1% ile tüm modeller arasında en yüksek kod yazma skoru.' },
    { rank: 6, name: 'DeepSeek V3', company: 'DeepSeek', lmsys_elo: 1452, mmlu: 87.1, swe_bench: 49.2, aime: 39.2, humaneval: 82.6, gpqa: 59.1, release: '2025-12', free: true, url: 'https://chat.deepseek.com', description: 'Çin\'in açık kaynak devi. GPT-4 seviyesi performans tamamen ücretsiz. Maliyet/performans şampiyonu.' },
    { rank: 7, name: 'Llama 4 Scout', company: 'Meta', lmsys_elo: 1421, mmlu: 79.6, swe_bench: 32.0, aime: 50.0, humaneval: 75.2, gpqa: 57.3, release: '2026-02', free: true, url: 'https://llama.meta.com', description: 'Meta\'nın açık kaynak modeli. 10M token context window ile en uzun bağlam kapasitesi.' },
    { rank: 8, name: 'Mistral Large 3', company: 'Mistral', lmsys_elo: 1398, mmlu: 81.2, swe_bench: 45.1, aime: 42.0, humaneval: 78.9, gpqa: 58.7, release: '2025-11', free: true, url: 'https://mistral.ai', description: 'Avrupa\'nın AI şampiyonu. Hızlı, verimli ve Avrupa veri gizliliğine uyumlu.' },
    { rank: 9, name: 'Qwen 3 Max', company: 'Alibaba', lmsys_elo: 1387, mmlu: 85.3, swe_bench: 61.2, aime: 65.0, humaneval: 84.1, gpqa: 63.4, release: '2026-01', free: true, url: 'https://qwen.aliyun.com', description: 'Alibaba\'nın güçlü modeli. Matematik ve kodlamada özellikle başarılı.' },
    { rank: 10, name: 'Command R+', company: 'Cohere', lmsys_elo: 1352, mmlu: 75.7, swe_bench: 28.4, aime: 31.0, humaneval: 71.3, gpqa: 52.1, release: '2025-10', free: false, url: 'https://cohere.com', description: 'Kurumsal kullanım için optimize edilmiş. RAG ve enterprise entegrasyonlarda güçlü.' },
  ];
  return c.json(models);
});

// ============ PROMPTS ============
app.get('/api/prompts', async (c) => {
  const prompts = [
    // Genel
    { id: 1, category: 'Genel', title: 'Uzman Rol Atama', description: 'AI\'ya belirli bir uzmanlık rolü ver', prompt: 'Sen [ALAN] konusunda 20 yıllık deneyime sahip bir uzman danışmansın. Sana soracağım sorulara bu perspektiften, derinlemesine ve pratik örneklerle cevap ver. Gerektiğinde alternatif görüşleri de belirt.', tags: ['rol', 'uzman', 'danışman'] },
    { id: 2, category: 'Genel', title: 'Adım Adım Düşünme (CoT)', description: 'Karmaşık problemleri parçalara böl', prompt: 'Bu problemi çözmeden önce adım adım düşün:\n1. Problemi kendi kelimelerinle tanımla\n2. Hangi bilgilere ihtiyacın var?\n3. Olası yaklaşımları listele\n4. En iyi yaklaşımı seç ve uygula\n5. Sonucu doğrula\n\nProblem: [PROBLEM]', tags: ['düşünme', 'analiz', 'CoT'] },
    { id: 3, category: 'Genel', title: 'Yapılandırılmış Çıktı', description: 'JSON veya tablo formatında çıktı al', prompt: 'Aşağıdaki bilgileri JSON formatında ver. Her alan için açıklama ekle:\n{\n  "başlık": "",\n  "özet": "",\n  "ana_noktalar": [],\n  "eylem_adımları": [],\n  "riskler": [],\n  "kaynaklar": []\n}\n\nKonu: [KONU]', tags: ['JSON', 'yapılandırılmış', 'format'] },
    // Kod
    { id: 4, category: 'Kod', title: 'Kod İnceleme ve İyileştirme', description: 'Kodu analiz et ve optimize et', prompt: 'Aşağıdaki kodu incele ve şunları yap:\n1. Hataları ve güvenlik açıklarını tespit et\n2. Performans iyileştirmeleri öner\n3. Kod okunabilirliğini artır\n4. Best practice\'lere uygunluğu değerlendir\n5. İyileştirilmiş versiyonu yaz ve değişiklikleri açıkla\n\n```\n[KOD]\n```', tags: ['kod', 'review', 'optimizasyon'] },
    { id: 5, category: 'Kod', title: 'API Entegrasyonu', description: 'Herhangi bir API için entegrasyon kodu yaz', prompt: 'Şu API için [DİL] dilinde tam entegrasyon kodu yaz:\n- API: [API ADI]\n- Endpoint: [ENDPOINT]\n- Authentication: [AUTH TİPİ]\n\nKod şunları içermeli:\n1. Hata yönetimi (try/catch)\n2. Rate limiting\n3. Retry mekanizması\n4. Logging\n5. Kullanım örneği\n\nKodu açıklayan yorumlar ekle.', tags: ['API', 'entegrasyon', 'kod'] },
    { id: 6, category: 'Kod', title: 'Test Yazma', description: 'Verilen kod için kapsamlı testler oluştur', prompt: 'Aşağıdaki fonksiyon için kapsamlı unit testler yaz:\n1. Happy path testleri\n2. Edge case testleri\n3. Hata durumu testleri\n4. Mock/stub kullanımı gerekiyorsa ekle\n5. Test coverage %100\'e yakın olsun\n\nFonksiyon:\n```\n[FONKSİYON]\n```', tags: ['test', 'unit test', 'TDD'] },
    // İçerik
    { id: 7, category: 'İçerik', title: 'SEO Blog Yazısı', description: 'Arama motoru optimize edilmiş blog yazısı', prompt: 'Şu konu için SEO optimize edilmiş bir blog yazısı yaz:\nKonu: [KONU]\nHedef anahtar kelime: [ANAHTAR KELİME]\nHedef kitle: [KİTLE]\n\nYazı şunları içermeli:\n- Dikkat çekici H1 başlık\n- 150-160 karakter meta açıklama\n- H2/H3 alt başlıklar\n- 1500-2000 kelime\n- İç ve dış link önerileri\n- Call-to-action\n- FAQ bölümü', tags: ['SEO', 'blog', 'içerik'] },
    { id: 8, category: 'İçerik', title: 'Sosyal Medya Paketi', description: 'Tek konudan 5 platform için içerik üret', prompt: 'Şu konu için 5 farklı platform için içerik üret:\nKonu: [KONU]\nTon: [TON - profesyonel/eğlenceli/eğitici]\n\n1. Twitter/X: 280 karakter, hashtag\'ler ile\n2. LinkedIn: Profesyonel, 1200 karakter\n3. Instagram: Caption + 30 hashtag\n4. TikTok: Video script, 60 saniye\n5. YouTube: Video başlığı + açıklama + tags', tags: ['sosyal medya', 'içerik', 'pazarlama'] },
    { id: 9, category: 'İçerik', title: 'Email Kampanyası', description: 'Yüksek dönüşümlü email dizisi', prompt: 'Şu ürün/hizmet için 5 emaillik bir drip kampanyası yaz:\nÜrün: [ÜRÜN]\nHedef: [HEDEF - satış/kayıt/etkileşim]\n\nHer email için:\n- Konu satırı (A/B test versiyonu ile)\n- Preheader\n- Email gövdesi\n- CTA butonu metni\n- Gönderim zamanlaması\n\nPsikologik tetikleyiciler kullan: aciliyet, sosyal kanıt, kayıp korkusu.', tags: ['email', 'pazarlama', 'dönüşüm'] },
    // İş
    { id: 10, category: 'İş', title: 'İş Planı Taslağı', description: 'Kapsamlı iş planı oluştur', prompt: 'Şu iş fikri için kapsamlı bir iş planı hazırla:\nFikir: [İŞ FİKRİ]\nSektör: [SEKTÖR]\nHedef pazar: [PAZAR]\n\nPlan şunları içermeli:\n1. Yönetici özeti\n2. Pazar analizi ve rekabet\n3. Ürün/hizmet tanımı\n4. Gelir modeli\n5. Pazarlama stratejisi\n6. Finansal projeksiyonlar (3 yıl)\n7. Risk analizi\n8. Büyüme planı', tags: ['iş planı', 'girişim', 'strateji'] },
    { id: 11, category: 'İş', title: 'SWOT Analizi', description: 'Derinlemesine SWOT analizi', prompt: 'Şu şirket/proje için kapsamlı bir SWOT analizi yap:\nŞirket/Proje: [İSİM]\nSektör: [SEKTÖR]\n\nHer bölüm için en az 5 madde listele ve her birini açıkla:\n- Güçlü yönler (internal)\n- Zayıf yönler (internal)\n- Fırsatlar (external)\n- Tehditler (external)\n\nSon olarak: Güçlü yönleri fırsatlarla nasıl eşleştirebiliriz? Zayıf yönleri nasıl güçlendirebiliriz?', tags: ['SWOT', 'analiz', 'strateji'] },
    { id: 12, category: 'İş', title: 'Müzakere Stratejisi', description: 'Müzakere için hazırlık ve taktikler', prompt: 'Şu müzakere için strateji hazırla:\nDurum: [DURUM]\nKarşı taraf: [KİM]\nHedefim: [HEDEF]\nAlt sınırım: [MİNİMUM KABUL]\n\nBana şunları ver:\n1. Açılış pozisyonu ve gerekçesi\n2. Taviz verme stratejisi\n3. Karşı tarafın muhtemel itirazları ve cevaplar\n4. BATNA (en iyi alternatif)\n5. Kapanış teknikleri\n6. Kırmızı çizgiler', tags: ['müzakere', 'iş', 'strateji'] },
    // AI
    { id: 13, category: 'AI', title: 'Sistem Prompt Yazma', description: 'AI için güçlü sistem promptu oluştur', prompt: 'Şu amaç için optimize edilmiş bir sistem promptu yaz:\nAmaç: [AMAÇ]\nKullanıcı kitlesi: [KİTLE]\nTon: [TON]\nKısıtlamalar: [KISITLAMALAR]\n\nSistem promptu şunları içermeli:\n1. Rol tanımı\n2. Davranış kuralları\n3. Çıktı formatı\n4. Yapılacaklar ve yapılmayacaklar\n5. Örnek etkileşimler\n\nPromptun token verimliliğini optimize et.', tags: ['sistem prompt', 'AI', 'optimizasyon'] },
    { id: 14, category: 'AI', title: 'AI Agent Tasarımı', description: 'Otonom AI agent mimarisi tasarla', prompt: 'Şu görev için bir AI agent mimarisi tasarla:\nGörev: [GÖREV]\nKullanılacak araçlar: [ARAÇLAR]\nKısıtlamalar: [KISITLAMALAR]\n\nMimari şunları içermeli:\n1. Agent\'ın hedefleri ve alt hedefleri\n2. Karar verme döngüsü (ReAct/Plan-Execute)\n3. Araç kullanım stratejisi\n4. Hata yönetimi\n5. Hafıza yönetimi (short/long term)\n6. Çıktı formatı\n7. Örnek kod (Python/JS)', tags: ['AI agent', 'otomasyon', 'mimari'] },
    { id: 15, category: 'AI', title: 'RAG Sistemi Kurulumu', description: 'Retrieval Augmented Generation sistemi kur', prompt: 'Şu kullanım senaryosu için RAG sistemi tasarla:\nVeri kaynağı: [KAYNAK]\nSoru türleri: [SORULAR]\nPerformans hedefi: [HEDEF]\n\nTasarım şunları içermeli:\n1. Veri ön işleme stratejisi\n2. Chunking stratejisi (boyut, overlap)\n3. Embedding modeli seçimi\n4. Vector database seçimi\n5. Retrieval stratejisi (semantic/hybrid)\n6. Reranking\n7. Prompt template\n8. Örnek implementasyon kodu', tags: ['RAG', 'vector DB', 'AI'] },
  ];
  return c.json(prompts);
});

// ============ ADMIN ============
app.get('/api/admin/stats', async (c) => {
  try {
    const users = await supabase('/users');
    const posts = await supabase('/posts');
    const articles = await supabase('/articles');
    const likes = await supabase('/likes');
    const comments = await supabase('/comments');
    return c.json({ 
      users_count: users.length, 
      posts_count: posts.length, 
      articles_count: articles.length,
      likes_count: likes.length,
      comments_count: comments.length
    });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.get('/api/admin/users', async (c) => {
  try {
    const users = await supabase('/users?order=created_at.desc');
    return c.json(users.map(u => ({ ...u, password_hash: undefined })));
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.delete('/api/admin/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await supabase(`/users?id=eq.${id}`, { method: 'DELETE' });
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.delete('/api/admin/posts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await supabase(`/posts?id=eq.${id}`, { method: 'DELETE' });
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;
