

// Universal image error handler - catches ALL broken images
function handleImgError(img) {
  if (img.src && !img.src.startsWith('http') && !img.src.startsWith('data:') && !img.src.startsWith('/')) {
    // Emoji or invalid src - just remove the img
    const span = document.createElement('span');
    span.textContent = img.alt || '🔗';
    span.style.cssText = 'font-size:' + (img.width||32) + 'px;display:inline-flex;align-items:center;justify-content:center;width:'+Math.max(img.width||32,32)+'px;height:'+Math.max(img.height||32,32)+'px;';
    img.replaceWith(span);
    return;
  }
  const emojiMap = {
    'chatgpt': '🤖', 'claude': '🤖', 'google': '🔍', 'gemini': '💎',
    'meta': '📘', 'microsoft': '🪟', 'nvidia': '🎮', 'twitterx': '𝕏',
    'cloud': '☁️', 'github': '🐙', 'robot': '🤖', 'brain': '🧠',
    'artificial-intelligence': '🧠', 'chat': '💬', 'bot': '🤖',
    'code': '💻', 'search': '🔍', 'workflow': '🔄', 'speaker': '🔊',
    'microphone': '🎤', 'music': '🎵', 'image': '🖼️', 'video': '▶️',
    'phone': '📱', 'python': '🐍', 'api': '⚡', 'database': '🗄️',
    'server': '🖥️', 'processor': '⚙️', 'llama': '🦙',
    'cyber-security': '🔒', 'freelance': '💼', 'automation': '⚙️',
    'money': '💰', 'rocket': '🚀', 'online-store': '🏪', 'cpu': '🖥️',
    'baby': '👶', 'instagram': '📸', 'youtube': '▶️',
    'combo-chart': '📊', 'elephant': '🐘', 'neural': '🧠'
  };
  const src = img.src.toLowerCase();
  let emoji = '🔗';
  for (const [key, val] of Object.entries(emojiMap)) {
    if (src.includes(key)) { emoji = val; break; }
  }
  const w = img.width || img.offsetWidth || 48;
  const h = img.height || img.offsetHeight || 48;
  const span = document.createElement('span');
  span.textContent = emoji;
  span.style.cssText = 'font-size:' + Math.min(w,h) + 'px;display:inline-flex;align-items:center;justify-content:center;width:'+w+'px;height:'+h+'px;';
  img.replaceWith(span);
}

// Fix broken background images (Unsplash 404 etc.)
function fixBrokenBgImages() {
  document.querySelectorAll('[style*="unsplash"], [style*="background-image"]').forEach(el => {
    const bg = el.style.backgroundImage || el.style.background;
    if (bg && bg.includes('url(')) {
      const urlMatch = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (urlMatch) {
        const img = new Image();
        img.onload = function() {};
        img.onerror = function() {
          const gradients = [
            'linear-gradient(135deg,#7a1515,#1a0a0a)',
            'linear-gradient(135deg,#1a3a6a,#0a0a1a)',
            'linear-gradient(135deg,#2d6a2d,#0a0a0a)',
            'linear-gradient(135deg,#6a4a1a,#0a0a0a)',
            'linear-gradient(135deg,#4a1a6a,#0a0a0a)'
          ];
          el.style.backgroundImage = gradients[Math.floor(Math.random() * gradients.length)];
          el.style.backgroundSize = 'cover';
        };
        img.src = urlMatch[1];
      }
    }
  });
}

// Run after articles load
const origLoadArticles = loadArticles;
loadArticles = async function() {
  await origLoadArticles();
  setTimeout(fixBrokenBgImages, 500);
  setTimeout(fixBrokenBgImages, 2000);
  setTimeout(fixBrokenBgImages, 5000);
};

// Global error delegation - catch ALL img errors on the page
document.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG') {
    handleImgError(e.target);
  }
}, true);

    // THEME SYSTEM
    function getTheme(){return localStorage.getItem('ai_legion_theme')||'dark'}
    function applyTheme(){
      const t=getTheme();
      document.documentElement.setAttribute('data-theme',t);
      const ic=t==='dark'?'☀️':'🌙';
      const b1=document.getElementById('theme-btn-desktop');
      const b2=document.getElementById('theme-btn-mobile');
      if(b1)b1.textContent=ic;
      if(b2)b2.textContent=ic;
      const nav=document.querySelector('nav');
      if(nav)nav.style.background=t==='dark'?'rgba(10,10,10,0.95)':'rgba(245,240,232,0.95)';
      const mn=document.getElementById('mobile-nav');
      if(mn)mn.style.background=t==='dark'?'rgba(10,10,10,0.98)':'rgba(245,240,232,0.98)';
    }
    function toggleTheme(){
      const c=getTheme();
      localStorage.setItem('ai_legion_theme',c==='dark'?'light':'dark');
      applyTheme();
    }
    applyTheme();

    function toggleNav() {
      const mn = document.getElementById('mobile-nav');
      mn.classList.toggle('open');
      const btn = document.getElementById('hamburger-btn');
      btn.textContent = mn.classList.contains('open') ? '✕' : '☰';
    }
    function closeNav() {
      document.getElementById('mobile-nav').classList.remove('open');
      document.getElementById('hamburger-btn').textContent = '☰';
    }
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
      const mn = document.getElementById('mobile-nav');
      const hb = document.getElementById('hamburger-btn');
      if (mn && mn.classList.contains('open') && !mn.contains(e.target) && !hb.contains(e.target)) {
        closeNav();
      }
    });
    document.addEventListener('click', function(e) {
      const mn = document.getElementById('mobile-nav');
      const hb = document.getElementById('hamburger-btn');
      if (mn && mn.classList.contains('open') && !mn.contains(e.target) && e.target !== hb) {
        closeNav();
      }
    });

    function previewImage(event) {
      const reader = new FileReader();
      reader.onload = function() {
        const output = document.getElementById('preview-image');
        output.src = reader.result;
        document.getElementById('image-preview').style.display = 'flex';
      };
      if (event.target.files[0]) {
        if (event.target.files[0].size > 2 * 1024 * 1024) { // Max 2MB
          showToast('Görsel boyutu 2MB\u0027tan büyük olamaz.');
          event.target.value = '';
          removeImage();
          return;
        }
        reader.readAsDataURL(event.target.files[0]);
      }
    }

    function removeImage() {
      document.getElementById('preview-image').src = '';
      document.getElementById('image-preview').style.display = 'none';
      document.getElementById('post-image-upload').value = '';
    }

    function handleDragOver(e) {
      e.preventDefault();
      document.getElementById('drop-zone').style.display = 'block';
      document.getElementById('drop-zone').style.background = 'rgba(201,168,76,0.1)';
    }

    function handleDragLeave(e) {
      document.getElementById('drop-zone').style.display = 'none';
    }

    function handleDrop(e) {
      e.preventDefault();
      document.getElementById('drop-zone').style.display = 'none';
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith('image/')) {
        const input = document.getElementById('post-image-upload');
        const dt = new DataTransfer();
        dt.items.add(files[0]);
        input.files = dt.files;
        previewImage({ target: input });
      }
    }

    function toggleDropZone() {
      const dz = document.getElementById('drop-zone');
      dz.style.display = dz.style.display === 'none' ? 'block' : 'none';
    }


const SUPABASE_URL = 'https://cnxeckhygerxdhlahimp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-Q9jXB9o2XHE39H4GL9lqw_eulC8lK5';
const SB_HEADERS = { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
async function sb(path, opts = {}) {
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1' + path, { ...opts, headers: { ...SB_HEADERS, ...(opts.headers||{}) } });
    if (!res.ok) {
      const text = await res.text();
      console.error('SB Error', res.status, path, text.substring(0, 200));
      return [];
    }
    const text = await res.text();
    try { return JSON.parse(text); }
    catch(e) { console.error('JSON parse error for', path, text.substring(0, 200)); return []; }
  } catch(e) { console.error('SB fetch error', path, e.message); return []; }
}
let currentUser = null;
let allTools = [];
let allPrompts = [];
let allLearn = [];
function hashStr(s){let h=0;for(let i=0;i<String(s).length;i++){h=((h<<5)-h)+String(s).charCodeAt(i);h|=0}return Math.abs(h)}
const gradients = [
  'linear-gradient(135deg,#7a1515,#1a0a0a)',
  'linear-gradient(135deg,#1a3a6a,#0a0a1a)',
  'linear-gradient(135deg,#2d6a2d,#0a0a0a)',
  'linear-gradient(135deg,#6a4a1a,#0a0a0a)',
  'linear-gradient(135deg,#4a1a6a,#0a0a0a)',
];

let currentPromptText = '';

// NAV CONFIG
const defaultNavItems = [
  { id: 'discover', label: '🔍 Keşfet', visible: true },
  { id: 'home', label: '🏠 Haberler', visible: true },
  { id: 'social', label: '💬 Sosyal', visible: true },
  { id: 'models', label: '🏆 Modeller', visible: true },
  { id: 'tools', label: '🛠️ Araçlar', visible: true },
  { id: 'agents', label: '🤖 Agentlar', visible: true },
  { id: 'learn', label: '📚 Öğren', visible: true },
  { id: 'prompts', label: '✨ Promptlar', visible: true },
  { id: 'arena', label: '⚔️ Arena', visible: true },
  { id: 'videos', label: '🎬 Videolar', visible: true },
];
let navConfig = JSON.parse(localStorage.getItem('nav_config') || 'null');
if (navConfig) {
  // Merge: add new items that don't exist in saved config
  const savedIds = navConfig.map(i => i.id);
  defaultNavItems.forEach(item => {
    if (!savedIds.includes(item.id)) { navConfig.push(item); }
  });
  // Ensure all items have the 'visible' property
  navConfig.forEach(item => { if (item.visible === undefined) item.visible = true; });
} else {
  navConfig = [...defaultNavItems];
}

function applyNavConfig() {
  // Only update active states, don't rebuild nav (prevents duplicates)
}

function renderNavManager() {
  const container = document.getElementById('nav-manager');
  container.innerHTML = navConfig.map((item, i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px;background:var(--bg3);border-radius:8px;margin-bottom:8px">
      <input type="checkbox" id="nav-${item.id}" ${item.visible ? 'checked' : ''} style="width:16px;height:16px;accent-color:var(--gold)">
      <label for="nav-${item.id}" style="font-size:14px;color:var(--text);cursor:pointer;flex:1">${item.label}</label>
      <span style="font-size:11px;color:var(--text3)">${item.id}</span>
    </div>
  `).join('');
}

function saveNavConfig() {
  navConfig.forEach(item => {
    const cb = document.getElementById('nav-' + item.id);
    if (cb) item.visible = cb.checked;
  });
  localStorage.setItem('nav_config', JSON.stringify(navConfig));
  applyNavConfig();
  showToast('Navigasyon güncellendi ✓');
}

function resetNavConfig() {
  navConfig = [...defaultNavItems];
  localStorage.removeItem('nav_config');
  applyNavConfig();
  renderNavManager();
  showToast('Navigasyon sıfırlandı');
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('ai_legion_user');if (saved) { currentUser = JSON.parse(saved); updateNavForUser(); }
  applyNavConfig();
  loadArticles();
  loadPosts();
  loadTools();
  loadModels();
  loadPrompts();
  loadLearnContent();
  loadAgents();
  loadVideos();
  setTimeout(loadDiscoverFeed, 800);
});

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function showPage(page) {
  const prevPage = document.querySelector('.page.active');
  document.querySelectorAll('.nav-btn, .sidebar-item').forEach(b => b.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (!pageEl) return;
  // Animate transition
  if (prevPage && prevPage !== pageEl) {
    prevPage.style.opacity = '0';
    prevPage.style.transform = 'translateY(8px)';
    setTimeout(() => {
      document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.opacity=''; p.style.transform=''; });
      pageEl.classList.add('active');
      pageEl.classList.add('fade-in');
      setTimeout(() => pageEl.classList.remove('fade-in'), 300);
    }, 150);
  } else {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    pageEl.classList.add('active');
  }
  document.querySelectorAll(`[onclick*="showPage('${page}')"]`).forEach(b => b.classList.add('active'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'social') {
    document.getElementById('composer-section').style.display = currentUser ? 'block' : 'none';
    document.getElementById('login-prompt-social').style.display = currentUser ? 'none' : 'block';
  }
  if (page === 'agents') loadAgents();
  if (page === 'discover') loadDiscoverFeed();
  if (page === 'learn') loadLearnContent();
  loadVideos();
  if (page === 'profile' && currentUser) loadProfile(currentUser.username);
 if (page === 'admin' && currentUser?.is_admin) { loadAdminStats(); loadAdminPosts(); renderNavManager(); }
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function updateNavForUser() {
  const navRight = document.getElementById('nav-right');
  const initial = currentUser.username[0].toUpperCase();
  // Preserve theme button and replace auth buttons with user info
  const existingProfileBtn = document.getElementById('nav-profile-btn');
  const existingAdminBtn = document.getElementById('nav-admin-btn');
  // Remove auth buttons
  const authBtns = navRight.querySelectorAll('.btn-sm:not(.theme-toggle):not(#nav-profile-btn):not(#nav-admin-btn)');
  authBtns.forEach(b => b.style.display = 'none');
  // Show profile button
  if (existingProfileBtn) existingProfileBtn.style.display = 'inline-flex';
  if (existingAdminBtn) existingAdminBtn.style.display = currentUser.role === 'admin' ? 'inline-flex' : 'none';
  // Update mobile nav auth
  const mobileAuth = document.getElementById('mobile-auth-buttons');
  const mobileUser = document.getElementById('mobile-user-buttons');
  if (mobileAuth) mobileAuth.style.display = 'none';
  if (mobileUser) {
    mobileUser.style.display = 'flex';
    mobileUser.innerHTML = '<button class="btn btn-outline" onclick="showPage(\'profile\');closeNav()">👤 ' + currentUser.username + '</button>' +
      '<button class="btn btn-red" onclick="logout();closeNav()">Çıkış Yap</button>';
  }
}

async function login() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  if (!username || !password) { document.getElementById('login-error').textContent = 'Tüm alanları doldurun'; return; }
  try {
    const users = await sb('/users?username=eq.' + username + '&limit=1');
    if (!users.length) { document.getElementById('login-error').textContent = 'Kullanıcı bulunamadı'; return; }
    const user = users[0];
    if (user.password_hash !== password) { document.getElementById('login-error').textContent = 'Şifre hatalı'; return; }
    currentUser = { ...user, password_hash: undefined };
    localStorage.setItem('ai_legion_user', JSON.stringify(currentUser));
updateNavForUser();

    closeModal('login-modal');
    showToast('Hoş geldin, ' + currentUser.username + '! ⚔️');
  } catch(e) { document.getElementById('login-error').textContent = 'Bağlantı hatası'; }
}

async function register() {
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  if (!username || !password) { document.getElementById('reg-error').textContent = 'Kullanıcı adı ve şifre zorunlu'; return; }
  try {
    const existing = await sb('/users?username=eq.' + username + '&limit=1');
    if (existing.length > 0) { document.getElementById('reg-error').textContent = 'Bu kullanıcı adı alınmış'; return; }
    const result = await sb('/users', { method: 'POST', body: JSON.stringify({ username, email: email || '', password_hash: password, bio: '', avatar_url: '', is_admin: false }) });
    const user = result[0];
    currentUser = { ...user, password_hash: undefined };
    localStorage.setItem('ai_legion_user', JSON.stringify(currentUser));
    updateNavForUser();
    closeModal('register-modal');
    showToast('Legiona katıldın, ' + currentUser.username + '! ⚔️');
  } catch(e) { document.getElementById('reg-error').textContent = 'Bağlantı hatası'; }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('ai_legion_user');
  location.reload();
}

// ARTICLES

// DISCOVER FEED
function loadDiscoverFeed() {
  var feed = document.getElementById('discover-feed');
  if (!feed) return;
  var html = '';
  function renderDiscoverSection(title, emoji, items, pageId) {
    if (!items || !items.length) return '';
    var section = '<div class="discover-section">';
    section += '<div class="discover-section-title">';
    section += '<span class="section-emoji">' + emoji + '</span> ' + title;
    section += '<a class="discover-section-more" onclick="showPage(\'' + pageId + '\');return false;">Tümünü Gör →</a>';
    section += '</div>';
    items.forEach(function(item) {
      section += '<div class="discover-item" onclick="' + (item.onclick || '') + '">';
      section += '<div class="discover-item-icon">' + (item.icon || '🔗') + '</div>';
      section += '<div class="discover-item-body">';
      section += '<div class="discover-item-title">' + item.title + '</div>';
      section += '<div class="discover-item-meta">';
      if (item.meta1) section += '<span>' + item.meta1 + '</span>';
      if (item.meta2) section += '<span>' + item.meta2 + '</span>';
      section += '</div></div></div>';
    });
    section += '</div>';
    return section;
  }

  // MODELS
  if (typeof allModels !== 'undefined' && allModels.length) {
    var items = allModels.slice(0, 3).map(function(m) {
      return { icon: '🏆', title: m.name + (m.benchmark && m.benchmark.lmsys ? ' (Elo: ' + m.benchmark.lmsys + ')' : ''), meta1: '⭐ ' + (m.rating || '-'), meta2: m.free ? '✓ Ücretsiz' : '$ Ücretli', onclick: "showPage('models')" };
    });
    html += renderDiscoverSection('En İyi Modeller', '🏆', items, 'models');
  }
  // TOOLS
  if (typeof allTools !== 'undefined' && allTools.length) {
    var items = allTools.slice(0, 3).map(function(t) {
      return { icon: '🛠️', title: t.name + ' - ' + (t.category || ''), meta1: '⭐ ' + (t.rating || '-'), meta2: t.free ? '✓ Ücretsiz' : '$ Ücretli', onclick: "window.open('" + (t.url || '#') + "','_blank')" };
    });
    html += renderDiscoverSection('Popüler Araçlar', '🛠️', items, 'tools');
  }
  // VIDEOS
  if (typeof allVideos !== 'undefined' && allVideos.length) {
    var items = allVideos.slice(0, 3).map(function(v) {
      return { icon: v.platform === 'youtube' ? '▶️' : v.platform === 'x' ? '𝕏' : '📸', title: v.title || 'Video', meta1: '👁 ' + (v.views || '-'), meta2: '📅 ' + new Date(v.date).toLocaleDateString('tr-TR'), onclick: "showPage('videos')" };
    });
    html += renderDiscoverSection('Son Videolar', '🎬', items, 'videos');
  }
  // AGENTS
  if (typeof allAgents !== 'undefined' && allAgents.length) {
    var items = allAgents.slice(0, 3).map(function(a) {
      return { icon: a.emoji || '🤖', title: a.name + ' - ' + (a.category || ''), meta1: '⭐ ' + (a.rating || '-'), meta2: a.stars ? '⭐ ' + a.stars : (a.free ? '✓ Ücretsiz' : '$ Ücretli'), onclick: "window.open('" + (a.url || '#') + "','_blank')" };
    });
    html += renderDiscoverSection('Öne Çıkan Agentlar', '🤖', items, 'agents');
  }
  // PROMPTS
  if (typeof allPrompts !== 'undefined' && allPrompts.length) {
    var items = allPrompts.slice(0, 3).map(function(p) {
      return { icon: '✨', title: p.title || 'Prompt', meta1: '📂 ' + (p.category || ''), meta2: '#️⃣ ' + (p.tags || []).slice(0, 2).join(', '), onclick: "showPage('prompts')" };
    });
    html += renderDiscoverSection('Popüler Promptlar', '✨', items, 'prompts');
  }
  // LEARN
  if (typeof learnArticles !== 'undefined' && learnArticles.length) {
    var items = learnArticles.slice(0, 3).map(function(a) {
      return { icon: a.emoji || '📚', title: a.title || 'Makale', meta1: '📂 ' + (a.category || ''), meta2: '⏱ ' + (a.readTime || '-'), onclick: "showPage('learn')" };
    });
    html += renderDiscoverSection('Öğren - Son Yazılar', '📚', items, 'learn');
  }

  feed.innerHTML = html || '<div class="discover-empty"><div style="font-size:48px;margin-bottom:12px">🔍</div><p>Keşfet içeriği yükleniyor...</p></div>';

  // Async: load articles and posts after sync data
  sb('/articles?order=created_at.desc&limit=3').then(function(articles) {
    if (Array.isArray(articles) && articles.length) {
      var items = articles.slice(0, 3).map(function(a) {
        return { icon: '📰', title: a.title || 'Başlıksız', meta1: '✍️ ' + (a.author || 'AI Legion'), meta2: '📅 ' + new Date(a.created_at).toLocaleDateString('tr-TR'), onclick: "showPage('home')" };
      });
      var sec = renderDiscoverSection('Son Haberler', '📰', items, 'home');
      feed.innerHTML = sec + feed.innerHTML;
    }
  }).catch(function(){});

  sb('/posts?order=created_at.desc&limit=3').then(function(posts) {
    if (Array.isArray(posts) && posts.length) {
      var items = posts.slice(0, 3).map(function(p) {
        var username = (p.user && p.user.username) || p.username || 'unknown';
        return { icon: '💬', title: (p.content || '').substring(0, 100) + ((p.content || '').length > 100 ? '...' : ''), meta1: '👤 @' + username, meta2: '❤️ ' + (p.likes_count || 0), onclick: "showPage('social')" };
      });
      var sec = renderDiscoverSection('Son Paylaşımlar', '💬', items, 'social');
      feed.innerHTML = sec + feed.innerHTML;
    }
  }).catch(function(){});
}

async function loadArticles() {
  try {
    const articles = await sb('/articles?order=created_at.desc&limit=20');
    console.log('[AI Legion] loadArticles:', articles);
    const container = document.getElementById('articles-list');
    if (!Array.isArray(articles) || !articles.length) {
      container.innerHTML = '<div class="empty-state"><div class="icon">📰</div><p>Henüz haber yok</p></div>';
      return;
    }
let html = '';
    // Featured: first 3 articles
    if (articles.length >= 1) {
      const a = articles[0];
      const bg = a.image_url ? `url(${a.image_url}) center/cover` : gradients[0];
      html += `<div class="featured-news">`;
      html += `<div class="featured-main" onclick="showArticle(${JSON.stringify(a).replace(/"/g,'&quot;')})" style="background:${bg}">
        <div class="featured-overlay">
          <div class="article-title">${a.title}</div>
          <div class="article-meta"><span>✍️ ${a.author || 'AI Legion'}</span><span>${new Date(a.created_at).toLocaleDateString('tr-TR')}</span></div>
        </div>
      </div>`;
      // Side articles (next 2)
      for (let i = 1; i < Math.min(3, articles.length); i++) {
        const s = articles[i];
        const sbg = s.image_url ? `url(${s.image_url}) center/cover` : gradients[i % gradients.length];
        html += `<div class="featured-side" onclick="showArticle(${JSON.stringify(s).replace(/"/g,'&quot;')})" style="background:${sbg}">
          <div class="featured-overlay">
            <div class="article-title">${s.title}</div>
            <div class="article-meta"><span>${new Date(s.created_at).toLocaleDateString('tr-TR')}</span></div>
          </div>
        </div>`;
      }
      html += `</div>`;
    }
    // Remaining articles as grid
    const rest = articles.slice(3);
    if (rest.length) {
      html += '<div class="news-grid">';
      rest.forEach((a, idx) => {
        html += `<div class="article-card" onclick="showArticle(${JSON.stringify(a).replace(/"/g,'&quot;')})">
          <div class="article-img-placeholder" style="background:${gradients[idx % gradients.length]}">${a.image_url ? `<img src="${a.image_url}" class="article-img" onerror="this.style.display='none';this.nextElementSibling?.style?.removeProperty&&this.nextElementSibling||(this.parentElement.innerHTML='<div style=\'display:flex;align-items:center;justify-content:center;font-size:32px;height:100%\'>📰</div>')" loading="lazy">` : '<div style=\'display:flex;align-items:center;justify-content:center;font-size:32px;height:100%\'>📰</div>'}</div>
          <div class="article-body">
            <div class="article-title">${a.title}</div>
            <div class="article-summary">${a.summary || (a.content || '').substring(0, 120) + '...'}</div>
            <div class="article-meta">
              <span>✍️ ${a.author || 'AI Legion'}</span>
              <span>${new Date(a.created_at).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        </div>`;
      });
      html += '</div>';
    }
    container.innerHTML = html;
  } catch(e) { document.getElementById('articles-list').innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><p>Haberler yüklenemedi</p></div>'; }
}

function showArticle(article) {
  document.getElementById('articles-list-view').style.display = 'none';
  const detail = document.getElementById('article-detail-view');
  detail.style.display = 'block';
  const imgSrc = article.image_url || article.image || '';
  let imgHtml = '';
  if (imgSrc) {
    imgHtml = '<div style="margin-bottom:20px;position:relative"><img src="' + imgSrc + '" class="article-detail-img" onerror="this.parentElement.innerHTML=\'<div style=\'height:200px;background:' + gradients[0] + ';display:flex;align-items:center;justify-content:center;font-size:48px;border-radius:12px\'>📰</div>\'" style="width:100%;max-height:400px;object-fit:cover;border-radius:12px" loading="lazy"></div>';
  } else {
    imgHtml = '<div style="height:200px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:48px;' + gradients[0] + '">📰</div>';
  }
  detail.innerHTML = '<button class="back-btn" onclick="hideArticle()">\u2190 Haberlere Dön</button>' +
    '<div class="article-detail">' + imgHtml +
    '<h1>' + article.title + '</h1>' +
    '<div style="color:var(--text3);font-size:13px;margin-bottom:20px">\u270D\uFE0F ' + (article.author || 'AI Legion') + ' \u00B7 ' + new Date(article.created_at).toLocaleDateString('tr-TR') + '</div>' +
    '<div class="content">' + (article.content || '').split('\n').map(p => p ? '<p>' + p + '</p>' : '').join('') + '</div></div>';
  window.scrollTo({top:0,behavior:'smooth'});
}

function hideArticle() {
  document.getElementById('article-detail-view').style.display = 'none';
  document.getElementById('articles-list-view').style.display = 'block';
}

async function addArticle() {
  const title = document.getElementById('art-title').value.trim();
  const category = document.getElementById('art-category').value;
  const summary = document.getElementById('art-summary').value.trim();
  const content = document.getElementById('art-content').value.trim();
  const image_url = document.getElementById('art-image').value.trim();
  if (!title || !content) { showToast('Başlık ve içerik zorunlu'); return; }
  try {
    const result = await sb('/articles', { method: 'POST', body: JSON.stringify({ title, category, summary, content, image_url, author: currentUser?.username || 'Admin', user_id: currentUser?.id }) });
    if (result) {
      closeModal('add-article-modal');
      showToast('Haber yayınlandı! 📰');
      loadArticles();
      ['art-title','art-summary','art-content','art-image'].forEach(id => document.getElementById(id).value = '');
      removeArticleImage();
    }
  } catch(e) { showToast('Hata oluştu'); }
}

function previewArticleImage(event) {
  const reader = new FileReader();
  reader.onload = function() {
    document.getElementById('article-preview-img').src = reader.result;
    document.getElementById('article-image-preview').style.display = 'flex';
  };
  if (event.target.files[0]) {
    if (event.target.files[0].size > 2 * 1024 * 1024) {
      showToast('Görsel boyutu 2MB dan büyük olamaz.');
      event.target.value = '';
      return;
    }
    reader.readAsDataURL(event.target.files[0]);
  }
}

function removeArticleImage() {
  document.getElementById('article-preview-img').src = '';
  document.getElementById('article-image-preview').style.display = 'none';
  document.getElementById('art-image-file').value = '';
}

function handleArticleDragOver(e) {
  e.preventDefault();
  document.getElementById('article-drop-zone').style.background = 'rgba(201,168,76,0.1)';
}

function handleArticleDragLeave(e) {
  document.getElementById('article-drop-zone').style.background = 'transparent';
}

function handleArticleDrop(e) {
  e.preventDefault();
  document.getElementById('article-drop-zone').style.background = 'transparent';
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith('image/')) {
    const input = document.getElementById('art-image-file');
    const dt = new DataTransfer();
    dt.items.add(files[0]);
    input.files = dt.files;
    previewArticleImage({ target: input });
  }
}

// POSTS
async function loadPosts() {
  try {
    const posts = await sb('/posts?order=created_at.desc&limit=50');
    const container = document.getElementById('posts-list');
    if (!Array.isArray(posts) || !posts.length) {
      container.innerHTML = '<div class="empty-state"><div class="icon">💬</div><p>Henüz post yok. İlk postu sen at! 🚀</p></div>';
      return;
    }
    const enriched = await Promise.all(posts.map(async p => {
      try {
        const users = await sb('/users?id=eq.' + p.user_id + '&limit=1');
        const user = users[0] || { username: 'unknown', avatar_url: '' };
        const likes = await sb('/likes?post_id=eq.' + p.id);
        const comments = await sb('/comments?post_id=eq.' + p.id);
        const reposts = await sb('/reposts?post_id=eq.' + p.id);
        return { ...p, user, likes_count: likes.length, comments_count: comments.length, reposts_count: reposts.length };
      } catch { return { ...p, user: { username: 'unknown' }, likes_count: 0, comments_count: 0, reposts_count: 0 }; }
    }));
    container.innerHTML = enriched.map(p => renderPost(p)).join('');
  } catch(e) { document.getElementById('posts-list').innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><p>Postlar yüklenemedi</p></div>'; }
}


// SOCIAL MEDIA EMBED PREVIEW
function detectSocialEmbed(text) {
  if (!text) return null;
  var patterns = [
    { regex: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|reels)\/([\w-]+)/i, platform: 'instagram', emoji: '📸', name: 'Instagram' },
    { regex: /(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/([\w]+)\/status\/(\d+)/i, platform: 'x', emoji: '𝕏', name: 'X (Twitter)' },
    { regex: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/posts\/([\w-]+)/i, platform: 'linkedin', emoji: '💼', name: 'LinkedIn' }
  ];
  for (var i = 0; i < patterns.length; i++) {
    var p = patterns[i];
    var match = text.match(p.regex);
    if (match) {
      var url = match[0];
      if (url.indexOf('http') !== 0) url = 'https://' + url;
      var username = '', postId = '';
      if (p.platform === 'instagram') {
        postId = match[1];
        username = '@user';
      } else if (p.platform === 'x') {
        username = '@' + match[1];
        postId = match[2];
      } else if (p.platform === 'linkedin') {
        username = '@user';
        postId = match[1];
      }
      return { platform: p.platform, emoji: p.emoji, name: p.name, url: url, username: username, postId: postId };
    }
  }
  return null;
}

function renderSocialEmbedCard(embed) {
  var iconClass = embed.platform === 'instagram' ? 'ig' : embed.platform === 'x' ? 'tw' : 'li';
  var descMap = {
    'instagram': 'Instagram gönderisi. Fotoğraf/video içeriği için tıklayın.',
    'x': 'X/Twitter gönderisi. Tam gönderiyi görüntülemek için tıklayın.',
    'linkedin': 'LinkedIn paylaşımı. Profesyonel içerik için tıklayın.'
  };
  var actions = {
    'instagram': { like: '♥️ Beğen', comment: '💬 Yorum', share: '📤 Paylaş' },
    'x': { like: '♥️ Beğeni', comment: '💬 Yanıtla', share: '🔁 Retweet' },
    'linkedin': { like: '👍 Beğen', comment: '💬 Yorum', share: '📤 Paylaş' }
  };
  var act = actions[embed.platform] || actions['x'];
  return '<div class="social-embed-card" onclick="window.open(\'' + embed.url + '\',\'_blank\')">' +
    '<div class="social-embed-header">' +
      '<div class="social-embed-platform-icon ' + iconClass + '">' + embed.emoji + '</div>' +
      '<div class="social-embed-info">' +
        '<div class="social-embed-platform-name">' + embed.name + '</div>' +
        '<div class="social-embed-url">' + embed.url.substring(0, 55) + (embed.url.length > 55 ? '...' : '') + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="social-embed-body">' +
      '<div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px">' + embed.username + (embed.postId ? '  &bull;  #' + embed.postId.substring(0, 15) : '') + '</div>' +
      '<div class="social-embed-preview-desc">' + (descMap[embed.platform] || 'Sosyal medya içeriği') + '</div>' +
    '</div>' +
    '<div class="social-embed-footer">' +
      '<div style="display:flex;gap:8px">' +
        '<span class="social-embed-action">' + act.like + '</span>' +
        '<span class="social-embed-action">' + act.comment + '</span>' +
        '<span class="social-embed-action">' + act.share + '</span>' +
      '</div>' +
      '<a class="social-embed-link" href="' + embed.url + '" target="_blank" onclick="event.stopPropagation()">↗ Orijinali Gör</a>' +
    '</div>' +
  '</div>';
}

function renderPost(p) {
  const username = p.user?.username || 'unknown';
  const initial = (username[0] || '?').toUpperCase();
  const time = new Date(p.created_at).toLocaleDateString('tr-TR');
  return `
    <div class="post" id="post-${p.id}">
      <div class="post-header">
        <div class="avatar" onclick="viewProfile('${username}')">${initial}</div>
        <div class="post-user-info">
          <div class="post-username" onclick="viewProfile('${username}')">@${username}</div>
          <div class="post-time">${time}</div>
        </div>
      </div>
      <div class="post-content">${p.content}</div>
      ${detectSocialEmbed(p.content) ? renderSocialEmbedCard(detectSocialEmbed(p.content)) : ''}
      ${p.image_url ? `<img src="${p.image_url}" class="post-image" alt="Post Image" onerror="handleImgError(this)">` : ''}
      <div class="post-actions">
        <button class="action-btn" onclick="likePost('${p.id}',this)">❤️ ${p.likes_count||0}</button>
        <button class="action-btn" onclick="repostPost('${p.id}',this)">🔁 ${p.reposts_count||0}</button>
        <button class="action-btn">💬 ${p.comments_count||0}</button>
        <button class="action-btn" onclick="bookmarkPost('${p.id}',this)">🔖</button>
        ${(currentUser?.id === p.user_id || currentUser?.is_admin) ? `<button class="action-btn" onclick="deletePost('${p.id}')">🗑️</button>` : ''}</div>
    </div>
  `;
}

function updateCharCount() {
  const val = document.getElementById('post-input').value.length;
  document.getElementById('char-count').textContent = val + '/500';
}

async function createPost() {
  if (!currentUser) { openModal('login-modal'); return; }
  const content = document.getElementById('post-input').value.trim();
  const image_data = document.getElementById('preview-image').src;
  const image_url = image_data.startsWith('data:image') ? image_data : null;
  if (!content && !image_url) { showToast('Post içeriği veya görseli boş olamaz'); return; }
  try {
    const result = await sb('/posts', { method: 'POST', body: JSON.stringify({ user_id: currentUser.id, content, image_url }) });
    if (result) {
      document.getElementById('post-input').value = '';
      removeImage();
      document.getElementById('char-count').textContent = '0/500';
      showToast('Paylaşıldı! ⚔️');
      loadPosts();
    }
  } catch(e) { showToast('Hata oluştu'); }
}

async function deletePost(id) {
  if (!confirm("Bu postu silmek istediğinize emin misiniz?")) return;
  try {
    await sb(`/posts?id=eq.${id}`, { method: 'DELETE' });
    showToast("Post silindi!");
    loadPosts();
  } catch(e) { showToast("Hata oluştu"); }
}

async function likePost(id, btn) {
  if (!currentUser) { openModal('login-modal'); return; }
  try {
    const existing = await sb('/likes?user_id=eq.' + currentUser.id + '&post_id=eq.' + id);
    if (existing.length > 0) {
      await sb('/likes?user_id=eq.' + currentUser.id + '&post_id=eq.' + id, { method: 'DELETE' });
      btn.classList.remove('liked');
      const count = parseInt(btn.textContent.replace(/\D/g,'')) - 1;
      btn.textContent = '❤️ ' + Math.max(0, count);
    } else {
      await sb('/likes', { method: 'POST', body: JSON.stringify({ user_id: currentUser.id, post_id: id }) });
      btn.classList.add('liked');
      const count = parseInt(btn.textContent.replace(/\D/g,'')) + 1;
      btn.textContent = '❤️ ' + count;
    }
  } catch(e) {}
}

async function repostPost(id, btn) {
  if (!currentUser) { openModal('login-modal'); return; }
  try {
    const existing = await sb('/reposts?user_id=eq.' + currentUser.id + '&post_id=eq.' + id);
    if (existing.length > 0) {
      await sb('/reposts?user_id=eq.' + currentUser.id + '&post_id=eq.' + id, { method: 'DELETE' });
      btn.classList.remove('reposted');
      showToast('Repost kaldırıldı');
    } else {
      await sb('/reposts', { method: 'POST', body: JSON.stringify({ user_id: currentUser.id, post_id: id }) });
      btn.classList.add('reposted');
      showToast('Repost yapıldı 🔁');
    }
  } catch(e) {}
}

async function bookmarkPost(id, btn) {
  if (!currentUser) { openModal('login-modal'); return; }
  try {
    const existing = await sb('/bookmarks?user_id=eq.' + currentUser.id + '&post_id=eq.' + id);
    if (existing.length > 0) {
      await sb('/bookmarks?user_id=eq.' + currentUser.id + '&post_id=eq.' + id, { method: 'DELETE' });
      btn.classList.remove('bookmarked');
      showToast('Kaydedilenlerden kaldırıldı');
    } else {
      await sb('/bookmarks', { method: 'POST', body: JSON.stringify({ user_id: currentUser.id, post_id: id }) });
      btn.classList.add('bookmarked');
      showToast('Kaydedildi 🔖');
    }
  } catch(e) {}
}

function switchFeedTab(el, type) {
  document.querySelectorAll('#page-social .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  loadPosts();
}

// MODELS
async function loadModels() {
  try {
    const models = [
      { rank: 1, name: 'Claude Opus 4.7', icon: 'https://img.icons8.com/fluency/48/anthropic.png', company: 'Anthropic', lmsys_elo: 1506, mmlu: 88.7, swe_bench: 74.2, aime: 85.0, humaneval: 92.1, free: true, url: 'https://claude.ai', description: 'Anthropic en güçlü model. İnsanlığı geride bırakan yapay zeka.', vram: 'API' },
      { rank: 2, name: 'GPT-5.5', icon: 'https://img.icons8.com/fluency/48/chatgpt.png', company: 'OpenAI', lmsys_elo: 1498, mmlu: 88.2, swe_bench: 74.9, aime: 83.0, humaneval: 91.8, free: false, url: 'https://chat.openai.com', description: 'OpenAI devrim niteliğinde güncelleme. 1M token context.', vram: 'API' },
      { rank: 3, name: 'Gemini 3.1 Pro', icon: 'https://img.icons8.com/fluency/48/google-logo.png', company: 'Google', lmsys_elo: 1489, mmlu: 87.9, swe_bench: 80.6, aime: 79.0, humaneval: 90.2, free: true, url: 'https://gemini.google.com', description: 'Google en güçlü modeli. Artık herkes için ücretsiz.', vram: 'API' },
      { rank: 4, name: 'Grok 4', icon: 'https://img.icons8.com/fluency/48/x.png', company: 'xAI', lmsys_elo: 1471, mmlu: 87.1, swe_bench: 75.0, aime: 78.0, humaneval: 89.4, free: true, url: 'https://grok.x.ai', description: 'xAI modeli. Gerçek zamanlı X erişimi.', vram: 'API' },
      { rank: 5, name: 'Claude Sonnet 4.7', icon: 'https://img.icons8.com/fluency/48/anthropic.png', company: 'Anthropic', lmsys_elo: 1463, mmlu: 87.5, swe_bench: 82.1, aime: 80.0, humaneval: 91.2, free: true, url: 'https://claude.ai', description: 'Anthropic flagship. Kod yazma ve analiz lideri.', vram: 'API' },
      { rank: 6, name: 'DeepSeek V4', icon: 'https://img.icons8.com/fluency/48/deepseek.png', company: 'DeepSeek', lmsys_elo: 1452, mmlu: 87.1, swe_bench: 49.2, aime: 39.2, humaneval: 82.6, free: true, url: 'https://chat.deepseek.com', description: 'Çin den gelen açık kaynak devrimi.', vram: 'API' },
      { rank: 7, name: 'Llama 4 Scout', icon: 'https://img.icons8.com/fluency/48/meta.png', company: 'Meta', lmsys_elo: 1421, mmlu: 79.6, swe_bench: 32.0, aime: 50.0, humaneval: 75.2, free: true, url: 'https://llama.meta.com', description: 'Meta açık kaynak MoE model. 128 uzman.', vram: '24GB' },
      { rank: 8, name: 'Mistral Large 3', icon: 'https://img.icons8.com/fluency/48/wind.png', company: 'Mistral', lmsys_elo: 1398, mmlu: 81.2, swe_bench: 45.1, aime: 42.0, humaneval: 78.9, free: true, url: 'https://mistral.ai', description: 'Avrupa nın ilk trilyon parametreli modeli.', vram: 'API' },
      { rank: 9, name: 'Qwen 3.5 Max', icon: 'https://img.icons8.com/fluency/48/alibaba.png', company: 'Alibaba', lmsys_elo: 1387, mmlu: 85.3, swe_bench: 61.2, aime: 65.0, humaneval: 84.1, free: true, url: 'https://qwen.aliyun.com', description: 'Alibaba güçlü model. Matematik ve kodlamada başarılı.', vram: 'API' },
      { rank: 10, name: 'Command R+', icon: 'https://img.icons8.com/fluency/48/cohere.png', company: 'Cohere', lmsys_elo: 1352, mmlu: 75.7, swe_bench: 28.4, aime: 31.0, humaneval: 71.3, free: true, url: 'https://cohere.com', description: 'Cohere enterprise model. Çok dilli.', vram: 'API' },
      { rank: 11, name: 'GPT-4.1', icon: 'https://img.icons8.com/fluency/48/chatgpt.png', company: 'OpenAI', lmsys_elo: 1345, mmlu: 85.2, swe_bench: 54.9, aime: 52.0, humaneval: 87.3, free: false, url: 'https://chat.openai.com', description: 'OpenAI orta seviye model. Hızlı ve verimli.', vram: 'API' },
      { rank: 12, name: 'Claude Haiku 4.7', icon: 'https://img.icons8.com/fluency/48/anthropic.png', company: 'Anthropic', lmsys_elo: 1338, mmlu: 82.1, swe_bench: 42.3, aime: 45.0, humaneval: 85.6, free: true, url: 'https://claude.ai', description: 'Anthropic hızlı model. Ucuz ve hızlı.', vram: 'API' },
      { rank: 13, name: 'Gemini 3.1 Flash', icon: 'https://img.icons8.com/fluency/48/google-logo.png', company: 'Google', lmsys_elo: 1325, mmlu: 80.5, swe_bench: 48.7, aime: 55.0, humaneval: 83.9, free: true, url: 'https://gemini.google.com', description: 'Google hızlı model. Uygulama geliştiriciler için ideal.', vram: 'API' },
      { rank: 14, name: 'GLM-5', icon: 'https://img.icons8.com/fluency/48/chat.png', company: 'Zhipu AI', lmsys_elo: 1312, mmlu: 79.8, swe_bench: 38.1, aime: 42.0, humaneval: 79.4, free: true, url: 'https://chatglm.cn', description: 'Çin en güçlü modeli. Türkçe desteği güçlü.', vram: 'API' },
      { rank: 15, name: 'Yi Lightning', icon: 'https://img.icons8.com/fluency/48/lightning-bolt.png', company: '01.AI', lmsys_elo: 1298, mmlu: 77.2, swe_bench: 35.6, aime: 38.0, humaneval: 76.8, free: true, url: 'https://www.01.ai', description: '01.AI hızlı ve ekonomik model.', vram: 'API' },
      { rank: 16, name: 'Phi-4', icon: 'https://img.icons8.com/fluency/48/microsoft.png', company: 'Microsoft', lmsys_elo: 1285, mmlu: 76.9, swe_bench: 32.1, aime: 35.0, humaneval: 74.2, free: true, url: 'https://azure.microsoft.com', description: 'Microsoft küçük ama etkili model.', vram: '12GB' },
      { rank: 17, name: 'Gemma 4 27B', icon: 'https://img.icons8.com/fluency/48/google-logo.png', company: 'Google', lmsys_elo: 1272, mmlu: 75.1, swe_bench: 29.8, aime: 33.0, humaneval: 72.1, free: true, url: 'https://ai.google.dev', description: 'Google açık kaynak model. Küçük ama güçlü.', vram: '24GB' },
      { rank: 18, name: 'Jamba 2', icon: 'https://img.icons8.com/fluency/48/neural-network.png', company: 'AI21 Labs', lmsys_elo: 1261, mmlu: 74.3, swe_bench: 28.5, aime: 30.0, humaneval: 70.8, free: true, url: 'https://ai21.com', description: 'AI21 SSM-Transformer hibrit model.', vram: 'API' },
      { rank: 19, name: 'Mistral Small 3', icon: 'https://img.icons8.com/fluency/48/wind.png', company: 'Mistral', lmsys_elo: 1248, mmlu: 73.5, swe_bench: 26.2, aime: 28.0, humaneval: 69.1, free: true, url: 'https://mistral.ai', description: 'Mistral hafif model. API ile erişim.', vram: '24GB' },
      { rank: 20, name: 'DeepSeek V3', icon: 'https://img.icons8.com/fluency/48/deepseek.png', company: 'DeepSeek', lmsys_elo: 1235, mmlu: 72.8, swe_bench: 24.1, aime: 26.0, humaneval: 67.5, free: true, url: 'https://chat.deepseek.com', description: 'DeepSeek önceki nesil. Hâlâ güçlü.', vram: 'API' },
      { rank: 21, name: 'Grok-2', icon: 'https://img.icons8.com/fluency/48/x.png', company: 'xAI', lmsys_elo: 1220, mmlu: 71.5, swe_bench: 22.0, aime: 30.0, humaneval: 66.8, free: true, url: 'https://grok.x.ai', description: 'xAI ikinci nesil model. Hızlı çıkarım.', vram: 'API' },
      { rank: 22, name: 'Llama 3.1 405B', icon: 'https://img.icons8.com/fluency/48/meta.png', company: 'Meta', lmsys_elo: 1208, mmlu: 70.2, swe_bench: 20.5, aime: 28.0, humaneval: 65.2, free: true, url: 'https://llama.meta.com', description: 'Meta en büyük açık kaynak modeli. 405B parametre.', vram: '8x80GB' },
      { rank: 23, name: 'Mixtral 8x22B', icon: 'https://img.icons8.com/fluency/48/wind.png', company: 'Mistral', lmsys_elo: 1195, mmlu: 69.8, swe_bench: 18.2, aime: 25.0, humaneval: 63.5, free: true, url: 'https://mistral.ai', description: 'Mistral MoE model. 22Bx8 uzman karışımı.', vram: '80GB+' },
      { rank: 24, name: 'Qwen2-Max', icon: 'https://img.icons8.com/fluency/48/alibaba.png', company: 'Alibaba', lmsys_elo: 1182, mmlu: 68.5, swe_bench: 19.8, aime: 32.0, humaneval: 64.1, free: true, url: 'https://qwen.aliyun.com', description: 'Alibaba Qwen2 serisi en büyük model.', vram: 'API' },
      { rank: 25, name: 'Falcon 180B', icon: 'https://img.icons8.com/fluency/48/falcon.png', company: 'TII', lmsys_elo: 1168, mmlu: 67.2, swe_bench: 15.1, aime: 22.0, humaneval: 61.8, free: true, url: 'https://falconllm.tii.ae', description: 'BAJI açık kaynak model. 180B parametre.', vram: '8x80GB' },
      { rank: 26, name: 'InternLM2', icon: 'https://img.icons8.com/fluency/48/chat.png', company: 'Shanghai AI Lab', lmsys_elo: 1155, mmlu: 66.8, swe_bench: 16.5, aime: 24.0, humaneval: 62.4, free: true, url: 'https://internlm.intern-ai.org.cn', description: 'Shanghai AI Lab açık kaynak modeli. Güçlü Çince.', vram: 'API' },
      { rank: 27, name: 'DBRX', icon: 'https://img.icons8.com/fluency/48/database.png', company: 'Databricks', lmsys_elo: 1142, mmlu: 65.5, swe_bench: 14.8, aime: 20.0, humaneval: 60.2, free: true, url: 'https://www.databricks.com', description: 'Databricks açık kaynak MoE modeli.', vram: '80GB+' },
      { rank: 28, name: 'Granite 34B', icon: '🪨', company: 'IBM', lmsys_elo: 1130, mmlu: 64.2, swe_bench: 13.5, aime: 18.0, humaneval: 58.9, free: true, url: 'https://www.ibm.com/granite', description: 'IBM enterprise AI modeli. İş odaklı.', vram: '48GB' },
      { rank: 29, name: 'StarCoder2 15B', icon: '⭐', company: 'BigCode', lmsys_elo: 1118, mmlu: 62.0, swe_bench: 25.2, aime: 15.0, humaneval: 72.5, free: true, url: 'https://huggingface.co/bigcode', description: 'BigCode açık kaynak kod modeli. Kod üretiminde güçlü.', vram: '16GB' },
      { rank: 30, name: 'Phi-3.5 MoE', icon: '🪟', company: 'Microsoft', lmsys_elo: 1105, mmlu: 61.8, swe_bench: 12.1, aime: 16.0, humaneval: 57.2, free: true, url: 'https://azure.microsoft.com', description: 'Microsoft MoE küçük model. Verimli ve hızlı.', vram: '8GB' },
      { rank: 31, name: 'Yi-1.5 34B', icon: '⚡', company: '01.AI', lmsys_elo: 1092, mmlu: 60.5, swe_bench: 11.5, aime: 19.0, humaneval: 56.8, free: true, url: 'https://www.01.ai', description: '01.AI önceki nesil model. Güçlü çok dilli.', vram: '48GB' },
      { rank: 32, name: 'Cohere Command R+', icon: '🔴', company: 'Cohere', lmsys_elo: 1080, mmlu: 59.2, swe_bench: 10.8, aime: 17.0, humaneval: 55.5, free: true, url: 'https://cohere.com', description: 'Cohere RAG odaklı enterprise model.', vram: 'API' },
      { rank: 33, name: 'Perplexity', icon: '🔮', company: 'Perplexity AI', lmsys_elo: 1068, mmlu: 58.5, swe_bench: 8.2, aime: 14.0, humaneval: 52.1, free: true, url: 'https://www.perplexity.ai', description: 'Perplexity AI arama odaklı asistan. Gerçek zamanlı.', vram: 'API' },
      { rank: 34, name: 'Gemma 3 27B', icon: '💎', company: 'Google', lmsys_elo: 1055, mmlu: 57.8, swe_bench: 9.5, aime: 16.0, humaneval: 54.2, free: true, url: 'https://ai.google.dev', description: 'Google önceki nesil açık kaynak model.', vram: '16GB' },
      { rank: 35, name: 'Midjourney v6', icon: 'https://img.icons8.com/fluency/48/palette.png', company: 'Midjourney', lmsys_elo: 0, mmlu: 0, swe_bench: 0, aime: 0, humaneval: 0, free: false, url: 'https://www.midjourney.com', description: 'Sanat düzeyinde görsel üretim AI. Yaratıcılık sınırsız.', vram: 'API' },
      { rank: 36, name: 'DALL-E 3', icon: 'https://img.icons8.com/fluency/48/chatgpt.png', company: 'OpenAI', lmsys_elo: 0, mmlu: 0, swe_bench: 0, aime: 0, humaneval: 0, free: false, url: 'https://openai.com/dall-e-3', description: 'OpenAI görsel üretim modeli. Metinden görsel.', vram: 'API' },
      { rank: 37, name: 'Stable Diffusion 3', icon: 'https://img.icons8.com/fluency/48/picture.png', company: 'Stability AI', lmsys_elo: 0, mmlu: 0, swe_bench: 0, aime: 0, humaneval: 0, free: true, url: 'https://stability.ai', description: 'Açık kaynak görsel üretim. SD3 ile kalite arttı.', vram: '8GB' },
      { rank: 38, name: 'Suno v3', icon: 'https://img.icons8.com/fluency/48/music.png', company: 'Suno AI', lmsys_elo: 0, mmlu: 0, swe_bench: 0, aime: 0, humaneval: 0, free: true, url: 'https://suno.com', description: 'AI müzik üretim. Şarkı sözlerinden tam şarkı.', vram: 'API' },
      { rank: 39, name: 'ElevenLabs', icon: 'https://img.icons8.com/fluency/48/microphone.png', company: 'ElevenLabs', lmsys_elo: 0, mmlu: 0, swe_bench: 0, aime: 0, humaneval: 0, free: true, url: 'https://elevenlabs.io', description: 'AI ses klonlama ve sentez. Doğal sesler.', vram: 'API' },,
      { rank: 40, name: 'Kimi K2.6', icon: 'https://img.icons8.com/fluency/48/moon.png', company: 'Moonshot AI', lmsys_elo: 1400, mmlu: 85.8, swe_bench: 62.1, aime: 72.0, humaneval: 88.5, free: true, url: 'https://kimi.moonshot.cn', description: 'Moonshot AI en gelişmiş modeli. Uzun context, kod yazma ve akıl yürütmede güçlü.', vram: 'API' },
      { rank: 41, name: 'GLM 5.1', icon: 'https://img.icons8.com/fluency/48/chat.png', company: 'Zhipu AI', lmsys_elo: 1380, mmlu: 84.5, swe_bench: 55.3, aime: 65.0, humaneval: 85.2, free: true, url: 'https://chatglm.cn', description: 'Zhipu AI Çin multi-modal lideri. Agent araçları ve uzun context.', vram: 'API' },
      { rank: 42, name: 'MiniMax 2.7', icon: 'https://img.icons8.com/fluency/48/artificial-intelligence.png', company: 'MiniMax', lmsys_elo: 1372, mmlu: 83.9, swe_bench: 52.8, aime: 63.0, humaneval: 83.7, free: true, url: 'https://hailuoai.video', description: 'MiniMax video ve metin lideri. Çok modal yetenekler.', vram: 'API' },
      { rank: 43, name: 'Qwen 3.6 Max', icon: 'https://img.icons8.com/fluency/48/alibaba.png', company: 'Alibaba', lmsys_elo: 1445, mmlu: 87.6, swe_bench: 65.2, aime: 74.0, humaneval: 89.1, free: true, url: 'https://qwen.aliyun.com', description: 'Alibaba en güçlü Qwen modeli. Matematik ve kodlamada üstün.', vram: 'API' },
      { rank: 44, name: 'Qwen 3.6 120B', icon: 'https://img.icons8.com/fluency/48/alibaba.png', company: 'Alibaba', lmsys_elo: 1328, mmlu: 80.2, swe_bench: 43.5, aime: 46.0, humaneval: 77.3, free: true, url: 'https://huggingface.co/Qwen', description: 'Açık kaynak 120B parametreli Qwen. Kendi sunucunda çalıştır.', vram: '80GB+' },
      { rank: 45, name: 'Qwen 3.6 35B', icon: 'https://img.icons8.com/fluency/48/alibaba.png', company: 'Alibaba', lmsys_elo: 1250, mmlu: 75.5, swe_bench: 32.0, aime: 35.0, humaneval: 70.2, free: true, url: 'https://huggingface.co/Qwen', description: 'Açık kaynak 35B Qwen. Verimli ve hızlı, RTX 4090 ile çalışır.', vram: '48GB' },
      { rank: 46, name: 'Qwen 3.6 7B', icon: 'https://img.icons8.com/fluency/48/alibaba.png', company: 'Alibaba', lmsys_elo: 1145, mmlu: 68.2, swe_bench: 18.5, aime: 22.0, humaneval: 62.4, free: true, url: 'https://huggingface.co/Qwen', description: 'Açık kaynak 7B Qwen. Edge cihazlarda çalışır, çok hızlı.', vram: '8GB' },
      { rank: 47, name: 'Llama 4 Scout 17Bx16', icon: 'https://img.icons8.com/fluency/48/meta.png', company: 'Meta', lmsys_elo: 1421, mmlu: 79.6, swe_bench: 32.0, aime: 50.0, humaneval: 75.2, free: true, url: 'https://llama.meta.com', description: 'Açık kaynak MoE 109B. 128 uzman, 17B aktif. Çok verimli.', vram: '24GB' },
      { rank: 48, name: 'Llama 4 Maverick 17Bx128', icon: 'https://img.icons8.com/fluency/48/meta.png', company: 'Meta', lmsys_elo: 1450, mmlu: 85.9, swe_bench: 58.7, aime: 72.0, humaneval: 87.4, free: true, url: 'https://llama.meta.com', description: 'Açık kaynak MoE 400B. Lider benchmarklar, özgürce kullan.', vram: '160GB+' },
      { rank: 49, name: 'DeepSeek R1 671B', icon: 'https://img.icons8.com/fluency/48/deepseek.png', company: 'DeepSeek', lmsys_elo: 1408, mmlu: 84.0, swe_bench: 57.5, aime: 79.2, humaneval: 86.1, free: true, url: 'https://chat.deepseek.com', description: 'Açık kaynak reasoning lideri. AIME problemi çözen en iyi açık model.', vram: '8x80GB' },
      { rank: 50, name: 'Mistral Small 3.1 24B', icon: 'https://img.icons8.com/fluency/48/wind.png', company: 'Mistral', lmsys_elo: 1248, mmlu: 73.5, swe_bench: 26.2, aime: 28.0, humaneval: 68.9, free: true, url: 'https://mistral.ai', description: 'Açık kaynak 24B. Tek GPU ile çalışır, hızlı çıkarım.', vram: '24GB' },
      { rank: 51, name: 'Phi-4 14B', icon: 'https://img.icons8.com/fluency/48/microsoft.png', company: 'Microsoft', lmsys_elo: 1285, mmlu: 76.9, swe_bench: 32.1, aime: 35.0, humaneval: 72.1, free: true, url: 'https://azure.microsoft.com', description: 'Açık kaynak 14B. Küçük ama etkili, SLM kategorisinin en iyisi.', vram: '12GB' },
      { rank: 52, name: 'Gemma 4 27B', icon: 'https://img.icons8.com/fluency/48/google-logo.png', company: 'Google', lmsys_elo: 1272, mmlu: 75.1, swe_bench: 29.8, aime: 30.0, humaneval: 70.5, free: true, url: 'https://ai.google.dev', description: 'Açık kaynak 27B. Dengeli performans, araştırma dostu lisans.', vram: '24GB' },
      { rank: 53, name: 'Yi Lightning 3B', icon: 'https://img.icons8.com/fluency/48/lightning-bolt.png', company: '01.AI', lmsys_elo: 1120, mmlu: 62.5, swe_bench: 15.0, aime: 16.0, humaneval: 58.3, free: true, url: 'https://www.01.ai', description: 'Açık kaynak 3B. Ultra hızlı, edge cihazlar için ideal.', vram: '4GB' }
    ];
    const container = document.getElementById('models-table');
    const maxElo = Math.max(...models.map(m => m.lmsys_elo));
    container.innerHTML = `
      <table class="models-table">
        <thead>
          <tr>
            <th>#</th>
            <th style="min-width:200px">Model</th>
            <th>Şirket</th>
            <th>LMSYS Elo</th>
            <th>MMLU</th>
            <th>SWE-bench</th>
            <th>AIME</th>
            <th>HumanEval</th>
            <th>VRAM</th>
            <th>Ücretsiz</th>
          </tr>
        </thead>
        <tbody>
          ${models.map(m => {
            const rankClass = m.rank <= 3 ? `rank-${m.rank}` : 'rank-other';
            const eloWidth = Math.round((m.lmsys_elo / maxElo) * 100);
            const scoreClass = (v) => v === 0 ? 'score-na' : v >= 80 ? 'score-good' : v >= 60 ? 'score-mid' : 'score-low';
            return `
              <tr>
                <td><div class="rank-badge ${rankClass}">${m.rank}</div></td>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    ${m.icon ? (m.icon.startsWith('http') ? `<img src="${m.icon}" style="width:28px;height:28px;object-fit:contain;border-radius:6px" onerror="this.outerHTML='<span style=\'font-size:24px\'>🤖</span>'" loading="lazy">` : `<span style="font-size:24px;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px">${m.icon}</span>`) : ''}
                    <div>
                      <a href="${m.url}" target="_blank" style="color:var(--gold);text-decoration:none;font-weight:600">${m.name}</a>
                      <div style="font-size:11px;color:var(--text3);margin-top:2px">${m.description.substring(0,60)}...</div>
                    </div>
                  </div>
                </td>
                <td style="color:var(--text2)">${m.company}</td>
                <td>
                  <div style="font-weight:700;color:var(--text)">${m.lmsys_elo}</div>
                  <div class="elo-bar"><div class="elo-fill" style="width:${eloWidth}%"></div></div>
                </td>
                <td class="${scoreClass(m.mmlu)}">${m.mmlu === 0 ? '<span style="color:var(--text3)">—</span>' : m.mmlu+'%'}</td>
                <td class="${scoreClass(m.swe_bench)}">${m.swe_bench === 0 ? '<span style="color:var(--text3)">—</span>' : m.swe_bench+'%'}</td>
                <td class="${scoreClass(m.aime)}">${m.aime === 0 ? '<span style="color:var(--text3)">—</span>' : m.aime+'%'}</td>
                <td class="${scoreClass(m.humaneval)}">${m.humaneval === 0 ? '<span style="color:var(--text3)">—</span>' : m.humaneval+'%'}</td>
                <td style="color:var(--gold);font-weight:600;font-size:12px">${m.vram || 'API'}</td>
                <td>${m.free ? '<span class="free-badge">✓ Ücretsiz</span>' : '<span class="paid-badge">$ Ücretli</span>'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  } catch(e) { document.getElementById('models-table').innerHTML = '<div class="loading">Veriler yüklenemedi</div>'; }
}

// ARENA
const arenaModels = {
  'claude-opus-47': { name: 'Claude Opus 4.7', lmsys: 1506, mmlu: 88.7, swe_bench: 74.2, aime: 85.0, humaneval: 92.1, color: '#e0245e' },
  'gpt-55': { name: 'GPT-5.5', lmsys: 1498, mmlu: 88.2, swe_bench: 74.9, aime: 83.0, humaneval: 91.8, color: '#1da1f2' },
  'gemini-31-pro': { name: 'Gemini 3.1 Pro', lmsys: 1489, mmlu: 87.9, swe_bench: 80.6, aime: 79.0, humaneval: 90.2, color: '#1da1f2' },
  'grok-4': { name: 'Grok 4', lmsys: 1471, mmlu: 87.1, swe_bench: 75.0, aime: 78.0, humaneval: 89.4, color: '#1da1f2' },
  'claude-sonnet-47': { name: 'Claude Sonnet 4.7', lmsys: 1463, mmlu: 87.5, swe_bench: 82.1, aime: 80.0, humaneval: 91.2, color: '#e0245e' },
  'deepseek-v4': { name: 'DeepSeek V4', lmsys: 1452, mmlu: 87.1, swe_bench: 49.2, aime: 39.2, humaneval: 82.6, color: '#1da1f2' },
  'llama-4-scout': { name: 'Llama 4 Scout', lmsys: 1421, mmlu: 79.6, swe_bench: 32.0, aime: 50.0, humaneval: 75.2, color: '#1da1f2' },
  'mistral-large-3': { name: 'Mistral Large 3', lmsys: 1398, mmlu: 81.2, swe_bench: 45.1, aime: 42.0, humaneval: 78.9, color: '#1da1f2' },
  'qwen-35-max': { name: 'Qwen 3.5 Max', lmsys: 1387, mmlu: 85.3, swe_bench: 61.2, aime: 65.0, humaneval: 84.1, color: '#1da1f2' },
  'command-rplus': { name: 'Command R+', lmsys: 1352, mmlu: 75.7, swe_bench: 28.4, aime: 31.0, humaneval: 71.3, color: '#1da1f2' },
  'gpt-41': { name: 'GPT-4.1', lmsys: 1345, mmlu: 85.2, swe_bench: 54.9, aime: 52.0, humaneval: 87.3, color: '#1da1f2' },
  'claude-haiku-47': { name: 'Claude Haiku 4.7', lmsys: 1338, mmlu: 82.1, swe_bench: 42.3, aime: 45.0, humaneval: 85.6, color: '#e0245e' },
  'gemini-31-flash': { name: 'Gemini 3.1 Flash', lmsys: 1325, mmlu: 80.5, swe_bench: 48.7, aime: 55.0, humaneval: 83.9, color: '#1da1f2' },
  'glm-5': { name: 'GLM-5', lmsys: 1312, mmlu: 79.8, swe_bench: 38.1, aime: 42.0, humaneval: 79.4, color: '#8b5cf6' },
  'phi-4': { name: 'Phi-4', lmsys: 1285, mmlu: 76.9, swe_bench: 32.1, aime: 35.0, humaneval: 74.2, color: '#00a4ef' },
  'gemma-3-27b': { name: 'Gemma 4 27B', lmsys: 1272, mmlu: 75.1, swe_bench: 29.8, aime: 33.0, humaneval: 72.1, color: '#1da1f2' },
  'grok-2': { name: 'Grok-2', lmsys: 1220, mmlu: 71.5, swe_bench: 22.0, aime: 30.0, humaneval: 66.8, color: '#1da1f2' },
  'llama-31-405b': { name: 'Llama 3.1 405B', lmsys: 1208, mmlu: 70.2, swe_bench: 20.5, aime: 28.0, humaneval: 65.2, color: '#1da1f2' },
  'mixtral-8x22b': { name: 'Mixtral 8x22B', lmsys: 1195, mmlu: 69.8, swe_bench: 18.2, aime: 25.0, humaneval: 63.5, color: '#1da1f2' },
  'qwen2-max': { name: 'Qwen2-Max', lmsys: 1182, mmlu: 68.5, swe_bench: 19.8, aime: 32.0, humaneval: 64.1, color: '#1da1f2' },
  'falcon-180b': { name: 'Falcon 180B', lmsys: 1168, mmlu: 67.2, swe_bench: 15.1, aime: 22.0, humaneval: 61.8, color: '#1da1f2' },
  'internlm2': { name: 'InternLM2', lmsys: 1155, mmlu: 66.8, swe_bench: 16.5, aime: 24.0, humaneval: 62.4, color: '#8b5cf6' },
  'dbrx': { name: 'DBRX', lmsys: 1142, mmlu: 65.5, swe_bench: 14.8, aime: 20.0, humaneval: 60.2, color: '#ff6900' },
  'granite-34b': { name: 'Granite 34B', lmsys: 1130, mmlu: 64.2, swe_bench: 13.5, aime: 18.0, humaneval: 58.9, color: '#054ada' },
  'starcoder2-15b': { name: 'StarCoder2 15B', lmsys: 1118, mmlu: 62.0, swe_bench: 25.2, aime: 15.0, humaneval: 72.5, color: '#1da1f2' },
  'phi-35-moe': { name: 'Phi-3.5 MoE', lmsys: 1105, mmlu: 61.8, swe_bench: 12.1, aime: 16.0, humaneval: 57.2, color: '#00a4ef' },
  'yi-15-34b': { name: 'Yi-1.5 34B', lmsys: 1092, mmlu: 60.5, swe_bench: 11.5, aime: 19.0, humaneval: 56.8, color: '#1da1f2' },
  'cohere-command-rplus': { name: 'Cohere Command R+', lmsys: 1080, mmlu: 59.2, swe_bench: 10.8, aime: 17.0, humaneval: 55.5, color: '#1da1f2' },
  'perplexity': { name: 'Perplexity', lmsys: 1068, mmlu: 58.5, swe_bench: 8.2, aime: 14.0, humaneval: 52.1, color: '#20b8cd' },
  'gemma-2-27b': { name: 'Gemma 3 27B', lmsys: 1055, mmlu: 57.8, swe_bench: 9.5, aime: 16.0, humaneval: 54.2, color: '#1da1f2' },
};


function runArenaComparison() {
  const leftId = document.getElementById('arena-left-model').value;
  const rightId = document.getElementById('arena-right-model').value;
  const left = arenaModels[leftId];
  const right = arenaModels[rightId];
  const metrics = [
    { key: 'lmsys', label: 'LMSYS Elo', high: true },
    { key: 'mmlu', label: 'MMLU %', high: true },
    { key: 'swe_bench', label: 'SWE-bench %', high: true },
    { key: 'aime', label: 'AIME %', high: true },
    { key: 'humaneval', label: 'HumanEval %', high: true },
  ];
  const maxVal = { lmsys: 1600, mmlu: 100, swe_bench: 100, aime: 100, humaneval: 100 };
  let html = '<div class="card"><div style="display:grid;grid-template-columns:1fr auto 1fr;gap:20px;margin-bottom:16px" class="arena-header-grid">';
  html += '<div style="text-align:center"><div class="arena-left" style="font-size:16px;font-weight:700;margin-bottom:4px">SOL</div><div style="font-size:20px;font-weight:800;color:var(--arena-left,#e0245e)">' + left.name + '</div></div>';
  html += '<div style="font-size:28px;align-self:center">⚔️</div>';
  html += '<div style="text-align:center"><div class="arena-right" style="font-size:16px;font-weight:700;margin-bottom:4px">SAĞ</div><div style="font-size:20px;font-weight:800;color:var(--arena-right,#1da1f2)">' + right.name + '</div></div></div>';
  html += '<div style="display:flex;flex-direction:column;gap:12px">';
  metrics.forEach(m => {
    const lVal = left[m.key], rVal = right[m.key];
    const lPct = Math.max(5, Math.round((lVal / maxVal[m.key]) * 100));
    const rPct = Math.max(5, Math.round((rVal / maxVal[m.key]) * 100));
    const winner = m.high ? (lVal > rVal ? 'left' : lVal < rVal ? 'right' : 'tie') : (lVal < rVal ? 'left' : lVal > rVal ? 'right' : 'tie');
    const lGlow = winner === 'left' ? '0 0 12px rgba(224,36,94,0.6)' : 'none';
    const rGlow = winner === 'right' ? '0 0 12px rgba(29,161,242,0.6)' : 'none';
    html += '<div style="margin-bottom:8px">';
    html += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span style="color:#e0245e;font-weight:' + (winner==='left'?'800':'500') + ';font-size:13px">' + lVal + '</span><span style="color:var(--text2);font-size:11px">' + m.label + '</span><span style="color:#1da1f2;font-weight:' + (winner==='right'?'800':'500') + ';font-size:13px">' + rVal + '</span></div>';
    html += '<div style="display:flex;gap:4px;height:20px">';
    html += '<div style="flex:' + lPct + ';background:linear-gradient(90deg,#e0245e,#ff4466);border-radius:10px 4px 4px 10px;box-shadow:' + lGlow + ';min-width:8px;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;font-size:9px;font-weight:700;color:#fff">' + (winner==='left'?'👑':'') + '</div>';
    html += '<div style="flex:' + rPct + ';background:linear-gradient(90deg,#3399ff,#1da1f2);border-radius:4px 10px 10px 4px;box-shadow:' + rGlow + ';min-width:8px;display:flex;align-items:center;justify-content:flex-start;padding-left:6px;font-size:9px;font-weight:700;color:#fff">' + (winner==='right'?'👑':'') + '</div>';
    html += '</div></div>';
  });
  html += '</div></div>';
  document.getElementById('arena-results').innerHTML = html;
}


// VIDEOS
let allVideos = [];
const videoCategories = { 'Başlangıç': '🌱', 'Model İnceleme': '🏆', 'Eğitim': '📚', 'Haber': '📰', 'Para Kazanma': '💰' };

function loadVideos() {
  allVideos = [
    // ===== YOUTUBE - TURKCE =====
    { id:1, platform:'youtube', category:'Başlangıç', url:'https://www.youtube.com/watch?v=0Wpna736wwE', title:'Yapay Zeka Caginda Hayatta Kalma Rehberi!', channel:'Baris Ozkurdum', duration:'18:42', views:'2.1M', date:'2025-06-15', description:'Yapay zeka devrinde islerinizi nasil koruyacaksiniz? Bu rehberde tum detaylar.', thumb:'https://img.youtube.com/vi/0Wpna736wwE/mqdefault.jpg' },
    { id:2, platform:'youtube', category:'Haber', url:'https://www.youtube.com/watch?v=8tx2viHpgA8', title:'GPT-5 is here... Can it win back programmers?', channel:'Fireship', duration:'12:34', views:'3.4M', date:'2026-03-20', description:'GPT-5 programci dostu mu? Detayli inceleme.', thumb:'https://img.youtube.com/vi/8tx2viHpgA8/mqdefault.jpg' },
    { id:3, platform:'youtube', category:'Model İnceleme', url:'https://www.youtube.com/watch?v=7TR-FLWNVHY', title:'The ONLY Way to Run DeepSeek R1 Locally', channel:'AI Search', duration:'22:30', views:'1.8M', date:'2026-01-10', description:'DeepSeek R1 nasil lokalde calistirilir? Adim adim rehber.', thumb:'https://img.youtube.com/vi/7TR-FLWNVHY/mqdefault.jpg' },
    { id:4, platform:'youtube', category:'Eğitim', url:'https://www.youtube.com/watch?v=UxHpVBvSiZs', title:'Googlein Prompt Muhendisliigi Kursunu 10 dkda Oren', channel:'Sahin Deniz', duration:'10:15', views:'890K', date:'2025-09-05', description:'Googlein resmi prompt muhendisliigi kursunun ozeti.', thumb:'https://img.youtube.com/vi/UxHpVBvSiZs/mqdefault.jpg' },
    { id:5, platform:'youtube', category:'Para Kazanma', url:'https://www.youtube.com/watch?v=5TxSqvPbnWw', title:'How to Build and Sell AI Automations: Ultimate Guide', channel:'Liam Ottley', duration:'45:20', views:'2.7M', date:'2026-02-28', description:'AI otomasyonlari insa edip satarak para kazanma rehberi.', thumb:'https://img.youtube.com/vi/5TxSqvPbnWw/mqdefault.jpg' },
    { id:6, platform:'youtube', category:'Haber', url:'https://www.youtube.com/watch?v=ly6YKz9UfQ4', title:'New MIT Study Says Most AI Projects Are Doomed', channel:'AI Explained', duration:'15:48', views:'4.2M', date:'2026-04-01', description:'MIT arastirmasina gore AI projelerinin cogu basarisiz oluyor. Neden?', thumb:'https://img.youtube.com/vi/ly6YKz9UfQ4/mqdefault.jpg' },
    { id:7, platform:'youtube', category:'Başlangıç', url:'https://www.youtube.com/watch?v=7foCbOktTZM', title:'ChatGPT Her Seyi Nasil Bilebiliyor?', channel:'Evrim Cagatay', duration:'14:22', views:'5.6M', date:'2025-04-10', description:'ChatGPTnin calisma prensibi ve nasil bu kadar bilgili oldugu.', thumb:'https://img.youtube.com/vi/7foCbOktTZM/mqdefault.jpg' },
    { id:8, platform:'youtube', category:'Eğitim', url:'https://www.youtube.com/watch?v=ocMOZpuAMw4', title:'Cursor Tutorial for Beginners (AI Code Editor)', channel:'Coder Foundry', duration:'32:10', views:'1.3M', date:'2026-01-18', description:'Cursor AI kod editoru ile gelistirme rehberi.', thumb:'https://img.youtube.com/vi/ocMOZpuAMw4/mqdefault.jpg' },
    { id:9, platform:'youtube', category:'Model İnceleme', url:'https://www.youtube.com/watch?v=LYoJnCpRswo', title:'Yapay Zeka Balonu Patlamak Uzerinde mi?', channel:'Merve Noyan', duration:'28:45', views:'1.9M', date:'2026-03-15', description:'AI balonu tartismasi ve gercekte neler oluyor.', thumb:'https://img.youtube.com/vi/LYoJnCpRswo/mqdefault.jpg' },
    { id:10, platform:'youtube', category:'Para Kazanma', url:'https://www.youtube.com/watch?v=Ao4cCA5QxEo', title:'Yapay Zeka ile Sifirdan Nasil Para Kazanilir?', channel:'Emre Yolcu', duration:'20:33', views:'3.1M', date:'2026-02-14', description:'AI ile para kazanmanin 10 farkli yolu.', thumb:'https://img.youtube.com/vi/Ao4cCA5QxEo/mqdefault.jpg' },
    // ===== YOUTUBE - ENGLISH =====
    { id:11, platform:'youtube', category:'Başlangıç', url:'https://www.youtube.com/watch?v=aircAruvnKk', title:'But What Is a Neural Network? | Deep Learning', channel:'3Blue1Brown', duration:'21:07', views:'18M', date:'2024-10-05', description:'Neural networklerin calisma prensibi, gorsel anlatim.', thumb:'https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg' },
    { id:12, platform:'youtube', category:'Model İnceleme', url:'https://www.youtube.com/watch?v=Nl7aCUsWykg', title:'Big Tech in Panic Mode... Did DeepSeek Just Crush OpenAI?', channel:'AI Explained', duration:'18:55', views:'6.3M', date:'2026-01-28', description:'DeepSeek R1 piyasayi nasil salladi?', thumb:'https://img.youtube.com/vi/Nl7aCUsWykg/mqdefault.jpg' },
    { id:13, platform:'youtube', category:'Eğitim', url:'https://www.youtube.com/watch?v=LPZh9BOjkQs', title:'Large Language Models Explained Briefly', channel:'ByteByteGo', duration:'11:42', views:'4.5M', date:'2025-07-22', description:'LLM nedir, nasil calisir? Kisa ve oz anlatim.', thumb:'https://img.youtube.com/vi/LPZh9BOjkQs/mqdefault.jpg' },
    { id:14, platform:'youtube', category:'Model İnceleme', url:'https://www.youtube.com/watch?v=ZQAz_HrUq68', title:'NVIDIA New AI Just Changed Everything', channel:'Matt Wolfe', duration:'25:10', views:'2.8M', date:'2026-03-08', description:'NVIDIAin yeni AI modeli ve etkileri.', thumb:'https://img.youtube.com/vi/ZQAz_HrUq68/mqdefault.jpg' },
    { id:15, platform:'youtube', category:'Haber', url:'https://www.youtube.com/watch?v=Xn-gtHDsaPY', title:'7 New Open Source AI Tools You Need Right Now', channel:'Fireship', duration:'8:45', views:'5.1M', date:'2026-04-10', description:'En yeni 7 acik kaynak AI araci.', thumb:'https://img.youtube.com/vi/Xn-gtHDsaPY/mqdefault.jpg' },
    { id:16, platform:'youtube', category:'Eğitim', url:'https://www.youtube.com/watch?v=VMj-3S7sEn0', title:'The Spelled-Out Intro to Neural Networks and Backpropagation', channel:'3Blue1Brown', duration:'41:33', views:'12M', date:'2024-11-15', description:'Backpropagation algoritmasinin detayli anlatimi.', thumb:'https://img.youtube.com/vi/VMj-3S7sEn0/mqdefault.jpg' },
    { id:17, platform:'youtube', category:'Başlangıç', url:'https://www.youtube.com/watch?v=FwOTs4UxQS4', title:'AI Agents, Clearly Explained', channel:'IBM Technology', duration:'14:30', views:'3.2M', date:'2025-12-01', description:'AI ajanlari nedir, nasil calisir?', thumb:'https://img.youtube.com/vi/FwOTs4UxQS4/mqdefault.jpg' },
    { id:18, platform:'youtube', category:'Model İnceleme', url:'https://www.youtube.com/watch?v=RudrWy9uPZE', title:'I Switched 50% of My AI Work to Claude', channel:'AI Foundations', duration:'16:20', views:'1.7M', date:'2026-02-05', description:'Claude vs ChatGPT karsilastirmasi ve gecis deneyimi.', thumb:'https://img.youtube.com/vi/RudrWy9uPZE/mqdefault.jpg' },
    { id:19, platform:'youtube', category:'Eğitim', url:'https://www.youtube.com/watch?v=sVcwVQRHIc8', title:'Learn RAG From Scratch - Python AI Tutorial', channel:'Tech With Tim', duration:'35:40', views:'2.4M', date:'2026-01-22', description:'RAG (Retrieval Augmented Generation) egitimi.', thumb:'https://img.youtube.com/vi/sVcwVQRHIc8/mqdefault.jpg' },
    { id:20, platform:'youtube', category:'Haber', url:'https://www.youtube.com/watch?v=Sk9tvyRSCgY', title:'DeepMinds New AI: A Gift To Humanity', channel:'AI Revolution', duration:'12:05', views:'7.8M', date:'2026-03-30', description:'DeepMindin son derecesi ve insanliga etkisi.', thumb:'https://img.youtube.com/vi/Sk9tvyRSCgY/mqdefault.jpg' },
    { id:21, platform:'youtube', category:'Para Kazanma', url:'https://www.youtube.com/watch?v=w0H1-b044KY', title:'How to Build and Sell AI Agents: Ultimate Guide 2026', channel:'Liam Ottley', duration:'52:15', views:'3.9M', date:'2026-04-05', description:'AI ajanlari gelistirip satarak gelir elde etme.', thumb:'https://img.youtube.com/vi/w0H1-b044KY/mqdefault.jpg' },
    { id:22, platform:'youtube', category:'Haber', url:'https://www.youtube.com/watch?v=hWMRd2mslCo', title:'Yapay Zeka Balonu Ne Zaman Patlayacak?', channel:'Barkin Uran', duration:'24:18', views:'1.4M', date:'2026-04-12', description:'AI balonu tartismasi: bilimsel perspektif.', thumb:'https://img.youtube.com/vi/hWMRd2mslCo/mqdefault.jpg' },
    { id:23, platform:'youtube', category:'Eğitim', url:'https://www.youtube.com/watch?v=EH5jx5qPabU', title:'From Zero to Your First AI Agent in 25 Minutes', channel:'Dave Ebbelaar', duration:'25:00', views:'2.1M', date:'2026-02-20', description:'25 dakikada ilk AI ajaninizi olusturun.', thumb:'https://img.youtube.com/vi/EH5jx5qPabU/mqdefault.jpg' },
    { id:24, platform:'youtube', category:'Model İnceleme', url:'https://www.youtube.com/watch?v=jeA-KBv0b68', title:'Claude Just Got Another Superpower...', channel:'AI Search', duration:'14:55', views:'1.5M', date:'2026-04-18', description:'Claudeun yeni ozellikleri detayli inceleme.', thumb:'https://img.youtube.com/vi/jeA-KBv0b68/mqdefault.jpg' },
    // ===== X/TWITTER VIDEOS =====
    { id:25, platform:'x', category:'Haber', url:'https://x.com/OpenAI/status/191234567890', title:'OpenAI: GPT-5.5 Can Now Reason Like a PhD', channel:'@OpenAI', duration:'1:30', views:'12M', date:'2026-04-15', description:'OpenAInin duyurusu ile GPT-5.5 artik PhD seviyesinde akil yurutuyor.' },
    { id:26, platform:'x', category:'Haber', url:'https://x.com/AnthropicAI/status/191345678901', title:'Anthropic: Claude Opus 4.7 Sets New SWE-bench Record', channel:'@AnthropicAI', duration:'2:15', views:'8M', date:'2026-04-10', description:'Claude Opus 4.7 ile yeni SWE-bench rekoru.' },
    { id:27, platform:'x', category:'Model İnceleme', url:'https://x.com/GoogleDeepMind/status/191456789012', title:'DeepMind: Gemini 3.1 Pro Free for Everyone', channel:'@GoogleDeepMind', duration:'1:45', views:'15M', date:'2026-04-08', description:'Gemini 3.1 Pro artik ucretsiz!' },
    // ===== INSTAGRAM REELS =====
    { id:28, platform:'instagram', category:'Başlangıç', url:'https://www.instagram.com/reel/C8abcdef/', title:'5 AI Araci Olmadan Ise Baslama!', channel:'@teknolojirehber', duration:'0:45', views:'2.3M', date:'2026-03-25', description:'Herkesin bilmesi gereken 5 temel AI araci.' },
    { id:29, platform:'instagram', category:'Para Kazanma', url:'https://www.instagram.com/reel/C8bcdefgh/', title:'Gunde 100$ AI ile Kazanmak - 3 Basit Yol', channel:'@paraakademi', duration:'1:00', views:'4.1M', date:'2026-04-02', description:'AI ile gunde 100 dolar kazanmanin 3 kolay yolu.' },
    { id:30, platform:'instagram', category:'Eğitim', url:'https://www.instagram.com/reel/C8cdefghij/', title:'ChatGPT Prompt Hileleri Bilen Az Kisi Kullaniyor', channel:'@ailobi', duration:'0:55', views:'6.7M', date:'2026-03-30', description:'ChatGPT prompt hileleri ve ipuclari.' },
    // ===== NEW APRIL 2026 =====
    { id:31, platform:'youtube', category:'Haber', url:'https://www.youtube.com/watch?v=jvLB8pHVjC8', title:'Kimi K2.6 Tanitildi: 2M Token ile Uzun Context', channel:'AI Haber', duration:'11:20', views:'890K', date:'2026-04-20', description:'Kimi K2.6 ile 2M token context destegi.', thumb:'https://img.youtube.com/vi/jvLB8pHVjC8/mqdefault.jpg' },
    { id:32, platform:'youtube', category:'Model İnceleme', url:'https://www.youtube.com/watch?v=2rK0OS7p2Tg', title:'Qwen 3.6 Max vs GPT-5.5 vs Claude Opus Karsilastirma', channel:'AI Arena', duration:'28:30', views:'1.2M', date:'2026-04-18', description:'Uc buyuk modelin detayli karsilastirmasi.', thumb:'https://img.youtube.com/vi/2rK0OS7p2Tg/mqdefault.jpg' },
    { id:33, platform:'youtube', category:'Haber', url:'https://www.youtube.com/watch?v=r1ScKF7ghRM', title:'MiniMax 2.7: Video Uretiminde Yeni Cag', channel:'Tech Review', duration:'15:45', views:'780K', date:'2026-04-15', description:'MiniMax 2.7 video uretiminde devrim yaratiyor.', thumb:'https://img.youtube.com/vi/r1ScKF7ghRM/mqdefault.jpg' },
    { id:34, platform:'youtube', category:'Eğitim', url:'https://www.youtube.com/watch?v=pGXM0F4e4JE', title:'Phi-4 14B ile Mobilde AI: Telefonunuzda Calisan Model', channel:'OpenAI Guide', duration:'19:10', views:'650K', date:'2026-04-12', description:'Phi-4 14B telefonunuzda nasil calisir?', thumb:'https://img.youtube.com/vi/pGXM0F4e4JE/mqdefault.jpg' },
    { id:35, platform:'youtube', category:'Model İnceleme', url:'https://www.youtube.com/watch?v=kW8nOViFnwI', title:'DeepSeek R1 671B: Acik Kaynak Reasoning Devi', channel:'AI Benchmark', duration:'22:50', views:'1.8M', date:'2026-01-28', description:'DeepSeek R1 671B detayli inceleme ve benchmarklar.', thumb:'https://img.youtube.com/vi/kW8nOViFnwI/mqdefault.jpg' },
    { id:36, platform:'youtube', category:'Haber', url:'https://www.youtube.com/watch?v=JjPBuCW9pEk', title:'GLM 5.1 Multi-Agent Demo: Otonom AI ile Otomasyon', channel:'AI Demo', duration:'16:33', views:'550K', date:'2026-04-19', description:'GLM 5.1 ile otonom coklu ajen otomasyonu.', thumb:'https://img.youtube.com/vi/JjPBuCW9pEk/mqdefault.jpg' },
    { id:37, platform:'youtube', category:'Eğitim', url:'https://www.youtube.com/watch?v=aircAruvnKk', title:'Acik Kaynak Modeller Kiyaslamasi: Llama 4 vs Qwen 3.6 vs Mistral', channel:'AI Comparison', duration:'34:15', views:'2.3M', date:'2026-04-10', description:'En iyi acik kaynak modeller detayli kiyaslama.', thumb:'https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg' },
  ];
  renderVideos(allVideos);
}

function filterVideos(cat, el) {
  if (el) { document.querySelectorAll('#videos-tabs .tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); }
  const filtered = cat === 'all' ? allVideos : allVideos.filter(v => v.category === cat);
  renderVideos(filtered);
}

function renderVideos(items) {
  const container = document.getElementById('videos-list');
  if (!items.length) { container.innerHTML = '<div class="empty-state"><div class="icon">🎬</div><p>Video bulunamadı</p></div>'; return; }
  container.innerHTML = items.map((v, idx) => {
    const platformClass = v.platform === 'youtube' ? 'video-source-yt' : v.platform === 'x' ? 'video-source-x' : 'video-source-ig';
    const platformLabel = v.platform === 'youtube' ? '▶️ YouTube' : v.platform === 'x' ? '𝕏 X/Twitter' : '📸 Instagram';
    const playIcon = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    const safeTitle = v.title.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    return '<div class="video-card" data-vidx="' + idx + '">' +
      '<div class="video-thumb">' +
        (v.thumb || v.thumbnail || '') ? '<img src="' + (v.thumb || v.thumbnail) + '" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;background:var(--bg3);font-size:48px">🎬</div>' : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg3);font-size:48px">🎬</div>'
        '<div class="video-play-btn">' + playIcon + '</div>' +
        '<div class="video-duration">' + v.duration + '</div>' +
      '</div>' +
      '<div class="video-body">' +
        '<span class="video-source-badge ' + platformClass + '">' + platformLabel + '</span>' +
        '<div class="video-title">' + safeTitle + '</div>' +
        '<div class="video-channel">' + v.channel + '</div>' +
        '<div class="video-meta"><span>👁 ' + v.views + '</span><span>' + new Date(v.date).toLocaleDateString('tr-TR') + '</span></div>' +
      '</div>' +
    '</div>';
  }).join('');
  // Add event delegation
  container.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', function() {
      const idx = parseInt(this.dataset.vidx);
      const v = allVideos[idx];
      if (v) playVideo(v.url, v.platform, v.title);
    });
  });
}

function playVideo(url, platform, title) {
  const modal = document.getElementById('video-embed-modal');
  const container = document.getElementById('video-embed-container');
  const info = document.getElementById('video-embed-info');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  let embedUrl = '';
  if (platform === 'youtube') {
    const vid = extractYTId(url);
    embedUrl = 'https://www.youtube.com/embed/' + vid + '?autoplay=1&rel=0';
    container.innerHTML = '<iframe src="' + embedUrl + '" style="width:100%;height:100%;border:none" allow="autoplay;encrypted-media" allowfullscreen></iframe>';
  } else if (platform === 'x') {
    // X/Twitter videos - open in new tab (no embed API)
    window.open(url, '_blank');
    closeVideoEmbed();
    return;
  } else if (platform === 'instagram') {
    // Instagram embed
    const reelMatch = url.match(/reel\/([^/]+)/);
    if (reelMatch) {
      embedUrl = 'https://www.instagram.com/reel/' + reelMatch[1] + '/embed/';
      container.innerHTML = '<iframe src="' + embedUrl + '" style="width:100%;height:100%;border:none" allowfullscreen></iframe>';
    } else {
      window.open(url, '_blank');
      closeVideoEmbed();
      return;
    }
  }
  info.innerHTML = '<h3 style="font-size:16px;font-weight:700;color:var(--gold);margin-bottom:4px">' + title + '</h3>';
}

function extractYTId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
}

function closeVideoEmbed(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('video-embed-modal');
  modal.style.display = 'none';
  document.getElementById('video-embed-container').innerHTML = '';
  document.body.style.overflow = '';
}

// ESC to close video
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeVideoEmbed();
});

// AGENTS
let allAgents = [];
const agentCategories = { 'Framework': '🔧', 'Asistan': '💬', 'Otomasyon': '⚡', 'Kod': '💻', 'Araştırma': '🔍' };

function loadAgents() {
  allAgents = [
    { id: 1, name: 'OpenClaw', category: 'Framework', emoji: '🕵️', description: 'Açık kaynak AI agent framework. Context pruning ile %65 token tasarrufu. Multi-agent orchestration, caveman mode, Claude/GPT/Gemini desteği.', url: 'https://github.com/openclaw/openclaw', repo: 'openclaw/openclaw', stars: '12.4k', free: true, rating: 4.8, tags: ['Açık Kaynak', 'Multi-LLM', 'Token Optimizasyonu'], features: ['Multi-agent orchestration', 'Context pruning (%65 tasarruf)', 'Caveman mode', 'Claude/GPT/Gemini desteği', 'Telegram & Discord entegrasyonu'] },
    { id: 2, name: 'Hermes Agent', category: 'Asistan', emoji: '🤖', description: 'Çoklu model destekli AI asistan platformu. Telegram, Discord, CLI, browser araçları, kalıcı hafıza, cron job ve otomasyon.', url: 'https://github.com/imacverse/hermes', repo: 'imacverse/hermes', stars: '8.2k', free: true, rating: 4.7, tags: ['Açık Kaynak', 'Multi-Platform', 'Otomasyon'], features: ['Telegram, Discord, CLI entegrasyonu', 'Kalıcı hafıza (session-based)', 'Cron job zamanlayıcı', 'Browser araçları', 'Çoklu model desteği'] },
    { id: 3, name: 'AutoGPT', category: 'Framework', emoji: '🔧', description: 'Otonom AI agent framework. Kendi kendine hedef belirleme, planlama ve görev tamamlama. GPT-4/5 tabanlı.', url: 'https://github.com/Significant-Gravitas/AutoGPT', repo: 'Significant-Gravitas/AutoGPT', stars: '172k', free: true, rating: 4.5, tags: ['Açık Kaynak', 'Otonom', 'GPT'], features: ['Otonom hedef belirleme', 'Uzun vadeli hafıza', 'Internet erişimi', 'Dosya okuma/yazma', 'Kod çalıştırma'] },
    { id: 4, name: 'CrewAI', category: 'Framework', emoji: '👥', description: 'Multi-agent orchestration framework. AI agentları rol, hedef ve araçlarla tanımla, ekip olarak çalıştır.', url: 'https://github.com/crewAIInc/crewAI', repo: 'crewAIInc/crewAI', stars: '28k', free: true, rating: 4.6, tags: ['Açık Kaynak', 'Multi-Agent', 'Orchestration'], features: ['Rol tabanlı agent tanımlama', 'Sequential & parallel görevler', 'Araç entegrasyonu', 'Human input', 'Hafıza yönetimi'] },
    { id: 5, name: 'LangChain', category: 'Framework', emoji: '🔗', description: 'LLM uygulama geliştirme framework. Zincirleme işlemler, RAG, agentlar ve araç entegrasyonu.', url: 'https://github.com/langchain-ai/langchain', repo: 'langchain-ai/langchain', stars: '98k', free: true, rating: 4.5, tags: ['Açık Kaynak', 'LLM', 'RAG'], features: ['Zincirleme işlemler (Chains)', 'RAG pipeline', 'Agent framework', '600+ entegrasyon', 'Hafıza yönetimi'] },
    { id: 6, name: 'Manus', category: 'Asistan', emoji: '✋', description: 'Otonom AI ajan. Web gezme, kod yazma, dosya yönetimi ve çok adımlı görevleri bağımsız tamamlama.', url: 'https://manus.im', stars: '', free: false, rating: 4.8, tags: ['Otonom', 'Web', 'Kod'], features: ['Tam otonom görev tamamlama', 'Web gezme ve analiz', 'Kod yazma ve çalıştırma', 'Dosya yönetimi', 'Çok adımlı planlama'] },
    { id: 7, name: 'Devin', category: 'Kod', emoji: '💻', description: 'Cognition AI tarafından geliştirilen otonom yazılım mühendisi. Tam geliştirme döngüsünü bağımsız yönetiyor.', url: 'https://devin.ai', stars: '', free: false, rating: 4.4, tags: ['SaaS', 'Otonom', 'Yazılım'], features: ['Bağımsız kod yazma', 'Bug tespit ve düzeltme', 'Deployment otomasyonu', 'Dokümantasyon', 'PR oluşturma'] },
    { id: 8, name: 'Cursor Agent', category: 'Kod', emoji: '⚡', description: 'AI kod editörünün agent modu. Tüm kod tabanını analiz eder, çok dosyalı değişiklikler yapar.', url: 'https://cursor.sh', stars: '', free: true, rating: 4.8, tags: ['IDE', 'Kod', 'Multi-File'], features: ['Tüm kod tabanını analiz', 'Çok dosyalı düzenleme', 'Terminal komutu çalıştırma', 'Bağlam farkındalığı', 'Claude/GPT desteği'] },
    { id: 9, name: 'n8n', category: 'Otomasyon', emoji: '🔄', description: 'Açık kaynak iş otomasyonu. 400+ entegrasyon, AI agent düğümleri, görsel workflow editörü.', url: 'https://n8n.io', repo: 'n8n-io/n8n', stars: '62k', free: true, rating: 4.7, tags: ['Açık Kaynak', 'Otomasyon', 'Workflow'], features: ['400+ entegrasyon', 'Görsel workflow editörü', 'AI agent düğümleri', 'Webhook desteği', 'Self-host seçeneği'] },
    { id: 10, name: 'Perplexity Deep Research', category: 'Araştırma', emoji: '🔍', description: 'AI destekli derin araştırma asistanı. Birden fazla kaynak tarar, raporlar oluşturur.', url: 'https://perplexity.ai', stars: '', free: true, rating: 4.7, tags: ['Araştırma', 'Rapor', 'Web'], features: ['Derin araştırma modu', 'Kaynak doğrulama', 'Akademik arama', 'Rapor oluşturma', 'Güncel veri erişimi'] },
    { id: 11, name: 'Replit Agent', category: 'Kod', emoji: '🌀', description: 'Tarayıcı içinde tam栈lı uygulama geliştirme. AI agent olarak projeleri sıfırdan oluşturur.', url: 'https://replit.com', stars: '', free: true, rating: 4.3, tags: ['IDE', 'Full-Stack', 'Deploy'], features: ['Sıfırdan proje oluşturma', 'Full-stack geliştirme', 'Otomatik deploy', 'İşbirliği', 'Çoklu dil desteği'] },
    { id: 12, name: 'Make (Integromat)', category: 'Otomasyon', emoji: '⚙️', description: 'Görsel otomasyon platformu. AI entegrasyonları ile karmaşık workflowlar oluştur.', url: 'https://make.com', stars: '', free: false, rating: 4.5, tags: ['Otomasyon', 'No-Code', 'AI'], features: ['Görsel scenario editörü', '1800+ entegrasyon', 'AI modülleri', 'Zamanlanmış çalışma', 'Error handling'] },
  ];
  document.getElementById('agents-count').textContent = allAgents.length + ' agent';
  renderAgents(allAgents);
}

function filterAgents(cat, el) {
  if (el) { document.querySelectorAll('#agents-tabs .tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); }
  const filtered = cat === 'all' ? allAgents : allAgents.filter(a => a.category === cat);
  document.getElementById('agents-count').textContent = filtered.length + ' agent';
  renderAgents(filtered);
}

function renderAgents(agents) {
  const container = document.getElementById('agents-list');
  if (!agents.length) { container.innerHTML = '<div class="empty-state"><div class="icon">🤖</div><p>Bu kategoride agent yok</p></div>'; return; }
  container.innerHTML = agents.map(a => `
    <div class="tool-card" onclick="window.open('${a.url}','_blank')" style="display:flex;flex-direction:column">
      <div class="tool-header">
        <div class="tool-icon"><span style="font-size:24px">${a.emoji || agentCategories[a.category] || '🤖'}</span></div>
        <div>
          <div class="tool-name">${a.name}</div>
          <span class="tool-category-badge">${a.category}</span>
        </div>
      </div>
      <div class="tool-desc">${a.description}</div>
      ${a.features ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">${a.features.slice(0, 4).map(f => `<span style="background:var(--bg3);color:var(--text2);font-size:10px;padding:2px 6px;border-radius:4px">${f}</span>`).join('')}</div>` : ''}
      ${a.tags ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">${a.tags.map(t => `<span style="background:rgba(201,168,76,0.1);color:var(--gold);font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid rgba(201,168,76,0.2)">${t}</span>`).join('')}</div>` : ''}
      <div class="tool-footer" style="margin-top:auto">
        <span class="${a.free ? 'free-badge' : 'paid-badge'}">${a.free ? '✓ Ücretsiz' : '$ Ücretli'}</span>
        <span class="rating">★ ${a.rating}</span>
        ${a.stars ? `<span style="color:var(--text3);font-size:11px;margin-left:4px">⭐ ${a.stars}</span>` : ''}
      </div>
    </div>
  `).join('');
}

// TOOLS
async function loadTools() {
  try {
    allTools = [
      { id: 1, name: 'Claude Opus 4.7', image: 'https://img.icons8.com/fluency/48/anthropic.png', category: 'LLM', description: 'Anthropic en güçlü model. Kod yazma ve analiz lideri.', url: 'https://claude.ai', free: true, rating: 4.9, benchmark: { lmsys: 1506, mmlu: '88.7%', swe_bench: '74.2%', aime: '85%' } },
      { id: 2, name: 'GPT-5.5', image: 'https://img.icons8.com/fluency/48/chatgpt.png', category: 'LLM', description: 'OpenAI devrim niteliğinde güncelleme. Multimodal.', url: 'https://chat.openai.com', free: false, rating: 4.9, benchmark: { lmsys: 1498, mmlu: '88.2%', swe_bench: '74.9%', aime: '83%' } },
      { id: 3, name: 'Gemini 3.1 Pro', image: 'https://img.icons8.com/fluency/48/google.png', category: 'LLM', description: 'Google en güçlü modeli. Artık herkes için ücretsiz.', url: 'https://gemini.google.com', free: true, rating: 4.8, benchmark: { lmsys: 1489, mmlu: '87.9%', swe_bench: '80.6%', aime: '79%' } },
      { id: 4, name: 'DeepSeek V4', image: 'https://img.icons8.com/fluency/48/artificial-intelligence.png', category: 'LLM', description: 'Çin den gelen açık kaynak devrimi. GPT-4 seviyesi.', url: 'https://chat.deepseek.com', free: true, rating: 4.7, benchmark: { lmsys: 1452, mmlu: '87.1%', swe_bench: '49.2%', aime: '39.2%' } },
      { id: 5, name: 'Grok 4', image: 'https://img.icons8.com/fluency/48/twitterx.png', category: 'LLM', description: 'xAI modeli. Gerçek zamanlı X/Twitter erişimi.', url: 'https://grok.x.ai', free: true, rating: 4.7 },
      { id: 6, name: 'Midjourney V7', image: 'https://img.icons8.com/fluency/48/image.png', category: 'Görüntü', description: 'Sanatsal görüntü üretiminde altın standart.', url: 'https://midjourney.com', free: false, rating: 4.9 },
      { id: 7, name: 'DALL-E 3', image: 'https://img.icons8.com/fluency/48/openai.png', category: 'Görüntü', description: 'OpenAI görüntü üretici. ChatGPT ile entegre.', url: 'https://chat.openai.com', free: true, rating: 4.7 },
      { id: 8, name: 'Flux 1.1 Pro', image: 'https://img.icons8.com/fluency/48/image.png', category: 'Görüntü', description: 'Gerçekçi fotoğraf kalitesinde görüntüler.', url: 'https://fal.ai', free: false, rating: 4.8 },
      { id: 9, name: 'Stable Diffusion 3.5', image: 'https://img.icons8.com/fluency/48/image.png', category: 'Görüntü', description: 'Açık kaynak görüntü üretici. Yerel çalıştırılabilir.', url: 'https://stability.ai', free: true, rating: 4.4 },
      { id: 10, name: 'Ideogram 3.0', image: 'https://img.icons8.com/fluency/48/image.png', category: 'Görüntü', description: 'Metin içeren görsellerde en iyi. Logo ve poster için ideal.', url: 'https://ideogram.ai', free: true, rating: 4.6 },
      { id: 11, name: 'Sora 1.5', image: 'https://img.icons8.com/fluency/48/video.png', category: 'Video', description: 'OpenAI video üretici. Sinematik kalite.', url: 'https://sora.com', free: false, rating: 4.8 },
      { id: 12, name: 'Runway Gen-4.5', image: 'https://img.icons8.com/fluency/48/video.png', category: 'Video', description: 'Profesyonel video üretici. Karakter tutarlılığı mükemmel.', url: 'https://runwayml.com', free: true, rating: 4.7 },
      { id: 13, name: 'Kling AI 3.0', image: 'https://img.icons8.com/fluency/48/video.png', category: 'Video', description: 'Sinematik gerçekçilik. 2 dakikaya kadar video.', url: 'https://klingai.com', free: true, rating: 4.7 },
      { id: 14, name: 'Google Veo 3.1', image: 'https://img.icons8.com/fluency/48/video.png', category: 'Video', description: 'Google video AI. 4K çıktı, sinematik kalite.', url: 'https://deepmind.google', free: false, rating: 4.8 },
      { id: 15, name: 'ElevenLabs', image: 'https://img.icons8.com/fluency/48/microphone.png', category: 'Ses', description: 'Ses klonlama ve TTS lideri. 30 saniye sesle mükemmel klonlama.', url: 'https://elevenlabs.io', free: true, rating: 4.9 },
      { id: 16, name: 'Suno v4', image: 'https://img.icons8.com/fluency/48/music.png', category: 'Müzik', description: 'Sözlü müzik üretiminde lider. Profesyonel kalite.', url: 'https://suno.ai', free: true, rating: 4.8 },
      { id: 17, name: 'Udio', image: 'https://img.icons8.com/fluency/48/music.png', category: 'Müzik', description: 'Farklı müzik stillerinde yüksek kalite.', url: 'https://udio.com', free: true, rating: 4.6 },
      { id: 18, name: 'Cursor', image: 'https://img.icons8.com/fluency/48/code.png', category: 'Geliştirici', description: 'AI destekli en iyi kod editörü. Claude + GPT entegrasyonu.', url: 'https://cursor.sh', free: true, rating: 4.8 },
      { id: 19, name: 'GitHub Copilot', image: 'https://img.icons8.com/fluency/48/github.png', category: 'Geliştirici', description: 'GitHub AI kod asistanı. Her IDE ile entegre.', url: 'https://github.com/features/copilot', free: false, rating: 4.6 },
      { id: 20, name: 'Perplexity', image: 'https://img.icons8.com/fluency/48/search.png', category: 'Arama', description: 'AI destekli arama motoru. Gerçek zamanlı web erişimi.', url: 'https://perplexity.ai', free: true, rating: 4.7 },
      { id: 21, name: 'Manus', image: 'https://img.icons8.com/fluency/48/robot.png', category: 'Ajan', description: 'Otonom AI ajan. Web gezme, kod yazma, dosya yönetimi.', url: 'https://manus.im', free: true, rating: 4.8 },
      { id: 22, name: 'n8n', image: 'https://img.icons8.com/fluency/48/workflow.png', category: 'Otomasyon', description: 'Açık kaynak AI otomasyon platformu. 400+ entegrasyon.', url: 'https://n8n.io', free: true, rating: 4.7 },
      { id: 23, name: 'Windsurf', image: 'https://img.icons8.com/fluency/48/code.png', category: 'Geliştirici', description: 'Codeium AI editörü. Cursor rakibi, geniş ücretsiz tier.', url: 'https://codeium.com/windsurf', free: true, rating: 4.6 },
      { id: 24, name: 'Cartesia', image: 'https://img.icons8.com/fluency/48/speaker.png', category: 'Ses', description: '90ms gecikme ile en hızlı TTS. Voice agent için ideal.', url: 'https://cartesia.ai', free: true, rating: 4.7 },
      { id: 25, name: 'Nano Banana', image: 'https://img.icons8.com/fluency/48/image.png', category: 'Görüntü', description: 'Hızlı AI görüntü üretici. Referans görüntü desteği.', url: 'https://nanobanana.ai', free: true, rating: 4.5 },
      { id: 26, name: 'GPT Image 1.5', image: 'https://img.icons8.com/fluency/48/openai.png', category: 'Görüntü', description: 'OpenAI görüntü üretim modeli. Foto-gerçekçi görseller.', url: 'https://chat.openai.com', free: true, rating: 4.8 },
      { id: 27, name: 'OpenClaw', image: 'https://img.icons8.com/fluency/48/robot.png', category: 'Ajan', description: 'Açık kaynak AI agent framework. Claude, GPT, Gemini desteği ile token optimizasyonu (%65 tasarruf), multi-agent orchestration ve caveman mode.', url: 'https://openclaw.ai', free: true, rating: 4.8 },
      { id: 28, name: 'Hermes', image: 'https://img.icons8.com/fluency/48/robot.png', category: 'Ajan', description: 'Çoklu model destekli AI asistan platformu. Telegram, Discord ve CLI entegrasyonu. Kalıcı hafıza, cron job, browser araçları ve otomasyon.', url: 'https://github.com/imacverse/hermes', free: true, rating: 4.7 },
    ];
    document.getElementById('tools-count').textContent = allTools.length + ' araç';
    renderTools(allTools);
  } catch(e) { document.getElementById('tools-list').innerHTML = '<div class="loading">Araçlar yüklenemedi</div>'; }
}

function filterTools(cat, el) {
  if (el) { document.querySelectorAll('#tools-tabs .tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); }
  const filtered = cat === 'all' ? allTools : allTools.filter(t => t.category === cat);
  document.getElementById('tools-count').textContent = filtered.length + ' araç';
  renderTools(filtered);
}

const catEmojis = { 'LLM': '🤖', 'Görüntü': '🎨', 'Video': '🎬', 'Ses': '🎵', 'Müzik': '🎼', 'Geliştirici': '💻', 'Arama': '🔍', 'Ajan': '🕵️', 'Agent': '🕵️', 'Otomasyon': '⚡' };

function renderTools(tools) {
  const container = document.getElementById('tools-list');
  if (!tools.length) { container.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><p>Bu kategoride araç yok</p></div>'; return; }
  container.innerHTML = tools.map(t => {
    const emoji = catEmojis[t.category] || '🛠️';
    const isRealImage = t.image && (t.image.startsWith('http') || t.image.startsWith('/'));
    const iconHtml = isRealImage
      ? `<div class="tool-icon"><img src="${t.image}" style="width:32px;height:32px;object-fit:contain;border-radius:6px;background:var(--bg3)" onerror="this.parentNode.innerHTML='<span style=&quot;font-size:22px&quot;>${emoji}</span>'" loading="lazy"></div>`
      : `<div class="tool-icon"><span style="font-size:24px">${t.image || emoji}</span></div>`;
    return `
    <div class="tool-card" onclick="window.open('${t.url}','_blank')">
      <div class="tool-header">
        ${iconHtml}
        <div>
          <div class="tool-name">${t.name}</div>
          <span class="tool-category-badge">${t.category}</span>
        </div>
      </div>
      <div class="tool-desc">${t.description}</div>
      ${t.benchmark ? `
        <div style="background:var(--bg3);border-radius:6px;padding:8px;margin-bottom:8px;font-size:11px">
          <div style="color:var(--text3);margin-bottom:4px">Benchmark Skorları</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
            <span style="color:var(--text2)">LMSYS: <strong style="color:var(--gold)">${t.benchmark.lmsys}</strong></span>
            <span style="color:var(--text2)">MMLU: <strong style="color:var(--gold)">${t.benchmark.mmlu}</strong></span>
            <span style="color:var(--text2)">SWE: <strong style="color:var(--gold)">${t.benchmark.swe_bench}</strong></span>
            <span style="color:var(--text2)">AIME: <strong style="color:var(--gold)">${t.benchmark.aime}</strong></span>
          </div>
        </div>
      ` : ''}
      <div class="tool-footer">
        <span class="${t.free ? 'free-badge' : 'paid-badge'}">${t.free ? '✓ Ücretsiz' : '$ Ücretli'}</span>
        <span class="rating">★ ${t.rating}</span>
      </div>
    </div>`;
  }).join('');
}

// LEARN
function loadLearnContent() {
  allLearn = [
    { category: 'Haberler', emoji: '📰', image: '🤖', title: 'Claude Opus 4.7 Çıktı: İnsanlığı Geride Bırakan Yapay Zeka', summary: 'Anthropic in yeni amiral gemisi modeli tüm benchmarklarda zirveyi aldı. Kod yazma, matematik ve multimodal yeteneklerde devrim.', readTime: '5 dk', content: 'Claude Opus 4.7, Anthropic in en güçlü yapay zeka modeli olarak piyasaya çıktı...' , image_url: 'https://picsum.photos/seed/smart-tech-18/600/300'},
    { category: 'Haberler', emoji: '📰', image: '🔍', title: 'Gemini 3.1 Pro: Google ın En Güçlü Modeli Artık Herkes İçin Ücretsiz', summary: 'Google, Gemini 3.1 Pro yu tamamen ücretsiz hale getirdi. 1M token context ve gelişmiş multimodal yetenekler.', readTime: '4 dk', content: 'Google, Gemini 3.1 Pro yu tüm kullanıcılar için ücretsiz olarak sunmaya başladı...' , image_url: 'https://picsum.photos/seed/machine-learning-7/600/300'},
    { category: 'Haberler', emoji: '📰', image: '🤖', title: 'GPT-5.5 Tanıtıldı: OpenAI den Devrim Niteliğinde Güncelleme', summary: 'OpenAI, GPT-5.5 ile yapay zeka dünyasında çıtayı yükseltiyor. 1M token context ve agent yetenekleri.', readTime: '6 dk', content: 'OpenAI, GPT-5.5 i duyurdu. Yeni model, 1 milyon token context window ile geliyor...' , image_url: 'https://picsum.photos/seed/cybersecurity-11/600/300'},
    { category: 'Haberler', emoji: '📰', image: '🧠', title: 'DeepSeek V4: Çin den Gelen Açık Kaynak Devrimi', summary: 'DeepSeek V4, açık kaynak dünyasında devrim yarattı. GPT-4.5 seviyesinde performans, tamamen ücretsiz.', readTime: '5 dk', content: 'DeepSeek, V4 modeliyle yapay zeka arena sında büyük bir sürpriz yaptı...' , image_url: 'https://picsum.photos/seed/quantum-computing-14/600/300'},
    { category: 'Araştırma', emoji: '🔬', image: '🧠', title: 'AI Agent lar 2026 da İş Gücünü Nasıl Değiştirecek?', summary: 'Otonom AI agentların iş dünyasına etkileri, hangi mesleklerin dönüşeceği ve yeni fırsatlar.', readTime: '12 dk', content: 'AI agentlar, 2026 da iş gücünü temelden dönüştürmeye başlıyor...' , image_url: 'https://picsum.photos/seed/ai-chip-19/600/300'},
    { category: 'Haberler', emoji: '📰', image: '🧠', title: 'Mistral Large 3: Avrupa nın İlk Trilyon Parametreli Modeli', summary: 'Fransız AI şirketi Mistral, trilyon parametreli yeni modeli Large 3 ü duyurdu.', readTime: '4 dk', content: 'Mistral, Avrupa nın en güçlü yapay zeka modeli olarak Mistral Large 3 ü tanıttı...' , image_url: 'https://picsum.photos/seed/tech-startup-5/600/300'},
    { category: 'Agent', emoji: '🕹️', image: '🔒', title: 'OpenClaw: Açık Kaynak AI Agent Framework ü Token Gider %65 Azaltıyor', summary: 'OpenClaw, context pruning ve caveman mode ile GPT-4 maliyetini %65 düşürüyor. Claude, GPT, Gemini desteği ile Türkiye de yaygın kullanım.', readTime: '5 dk', content: 'OpenClaw, açık kaynak AI agent framework olarak dikkat çekiyor...' , image_url: 'https://picsum.photos/seed/brain-ai-13/600/300'},
    { category: 'Agent', emoji: '🤖', image: '🧠', title: 'Hermes Agent: Türkiye den Çoklu Model Destekli AI Asistan', summary: 'Hermes, Telegram, Discord, browser araçları ile entegre çalışıyor. Cron job, session yönetimi ve uzun hafıza özellikleriyle öne çıkıyor.', readTime: '4 dk', content: 'Hermes, çoklu model desteği ve güçlü araç entegrasyonlarıyla AI asistan deneyimini üst seviyeye taşıyor...' , image_url: 'https://picsum.photos/seed/automation-12/600/300'},
    { category: 'Başlangıç', emoji: '🌱', image: '👶', title: 'AI e Yeni Başlayanlar İçin Tam Rehber 2026', summary: 'Yapay zekaya sıfırdan başlamak isteyenler için adım adım rehber. Temel kavramlar, araçlar ve ilk projeler.', readTime: '15 dk', content: 'Yapay zeka dünyasına adım atmak hiç bu kadar kolay olmamıştı...' , image_url: 'https://picsum.photos/seed/gpu-render-22/600/300'},
    { category: 'Para Kazanma', emoji: '💰', image: '💰', title: 'Yapay Zeka ile Para Kazanma: 15 Kanıtlanmış Yol', summary: 'Freelance yazılım, içerik üretimi, AI ajan kiralama ve daha fazlası. Her seviyeye uygun stratejiler.', readTime: '20 dk', content: 'AI ile para kazanmak artık sadece büyük şirketlerin tekelinde değil...' , image_url: 'https://picsum.photos/seed/code-8/600/300'},
    { category: 'İleri Seviye', emoji: '🚀', image: '🚀', title: 'RAG (Retrieval Augmented Generation) Neden Önemli?', summary: 'Kurumsal verilerle AI kullanmanın en etkili yolu. RAG mimarisi, vektör veritabanları ve best practice ler.', readTime: '10 dk', content: 'RAG, kurumsal AI uygulamalarının temel taşı haline geldi...' , image_url: 'https://picsum.photos/seed/data-science-6/600/300'},
    { category: 'Kıyaslama', emoji: '📊', image: '📊', title: 'LLM Benchmark Rehberi: MMLU, SWE-bench ve Ötesi', summary: 'Model karşılaştırma metrikleri ne anlama geliyor? Hangi benchmark hangi yeteneği ölçüyor?', readTime: '8 dk', content: 'LLM benchmarkları, modellerin gerçek dünyadaki performansını anlamak için kritik...' , image_url: 'https://picsum.photos/seed/neural-network-0/600/300'},
    { category: 'Otomasyon', emoji: '⚡', image: '⚙️', title: 'AI Otomasyon ile İş Akışlarını Hızlandırma', summary: 'n8n, Make ve özel AI agentları ile tekrarlayan işleri otomatikleştirme. Gerçek dünya örnekleri.', readTime: '12 dk', content: 'AI otomasyon, iş dünyasında devrim yaratıyor...' , image_url: 'https://picsum.photos/seed/chatbot-4/600/300'},
    { category: 'Başlangıç', emoji: '🌱', image: '💬', title: 'Prompt Mühendisliği 101: Etkili Prompt Yazma Sanatı', summary: 'AI dan en iyi sonucu almak için prompt yazma teknikleri. CoT, few-shot, role-playing ve daha fazlası.', readTime: '10 dk', content: 'Prompt mühendisliği, AI ile çalışmanın en temel becerisi...' , image_url: 'https://picsum.photos/seed/llm-ai-21/600/300'},
    { category: 'Para Kazanma', emoji: '💰', image: '🏪', title: 'AI ile SaaS Ürünü Oluşturma: Sıfırdan Lansmana', summary: 'AI tabanlı bir SaaS ürünü nasıl oluşturulur? Fikir, MVP, pazar doğrulama ve büyüme stratejileri.', readTime: '18 dk', content: 'AI tabanlı SaaS ürünleri, 2026 nın en kârlı girişim alanlarından...' , image_url: 'https://picsum.photos/seed/gpt-model-20/600/300'},
    { category: 'İleri Seviye', emoji: '🚀', image: '🧠', title: 'Fine-Tuning vs RAG: Hangi Yöntemi Ne Zaman Kullanmalı?', summary: 'Model ince ayarı mı, RAG mı? Her yaklaşımın avantajları, maliyetleri ve kullanım senaryoları.', readTime: '12 dk', content: 'Kurumsal AI projelerinde en sık sorulan sorulardan biri...' , image_url: 'https://picsum.photos/seed/innovation-9/600/300'},
    { category: 'Kıyaslama', emoji: '📊', image: '🖥️', title: 'Açık Kaynak vs Kapalı Kaynak AI Modelleri: 2026 Karşılaştırması', summary: 'Open source ve proprietary modellerin maliyet, performans ve güvenlik karşılaştırması.', readTime: '10 dk', content: 'Açık kaynak AI modelleri, kapalı kaynak rakiplerine karşı giderek daha rekabetçi hale geliyor...' , image_url: 'https://picsum.photos/seed/cloud-server-16/600/300'},
    { category: 'Otomasyon', emoji: '⚡', image: '🔄', title: 'Multi-Agent Sistemleri: AI Agentları Birlikte Çalıştırma', summary: 'CrewAI, AutoGen ve AutoGPT ile birden fazla AI agentı koordine etme. Gerçek dünya mimarileri.', readTime: '14 dk', content: 'Multi-agent sistemler, karmaşık görevleri paralel ve koordineli şekilde çözmek için...' , image_url: 'https://picsum.photos/seed/robotics-24/600/300'},
    { category: 'Para Kazanma', emoji: '💰', image: '💼', title: 'Freelance AI Geliştirici Olmak: Başlangıç Rehberi', summary: 'Upwork ve Fiverr da AI projeleri almak, fiyatlandırma stratejileri ve portföy oluşturma.', readTime: '15 dk', content: 'Freelance AI geliştiriciler, 2026 da en çok aranan profesyoneller arasında...' , image_url: 'https://picsum.photos/seed/deep-learning-3/600/300'},
    { category: 'Haberler', emoji: '📰', image: '🌙', title: 'Kimi K2.6 Tanıtıldı: Moonshot AI Uzun Context Lideri', summary: 'Moonshot AI Kimi K2.6 ile 2M token context sunuyor. Çin AI ekosisteminin en güçlü modeli benchmarkları alt üst etti.', readTime: '5 dk', content: 'Moonshot AI, Kimi K2.6 modelini duyurdu. 2 milyon token context window ile gelen model, uzun belge analizi ve çok adımlı akıl yürütmede rakiplerini geride bırakıyor. Nisan 2026 itibarıyla LMSYS arena sıralamasında ilk 10 da.', image_url: 'https://picsum.photos/seed/robot-ai-2/600/300' },
    { category: 'Haberler', emoji: '📰', image: '🧠', title: 'GLM 5.1: Zhipu AI Multi-Model Devrimi', summary: 'Zhipu AI GLM 5.1 ile görsel, ses ve metin birleştiren tam multimodal deneyim sunuyor. Agent araçları ile otonom görev yapabiliyor.', readTime: '6 dk', content: 'Zhipu AI, GLM 5.1 modeli ile multimodal AI konusunda Çin in en iddialı hamlesini yaptı. Model, görsel anlama, ses işleme ve araç kullanımı konusunda eşsiz yetenekler sunuyor. Nisan 2026 da piyasaya sürüldü.', image_url: 'https://picsum.photos/seed/digital-transform-15/600/300' },
    { category: 'Haberler', emoji: '📰', image: '🎬', title: 'MiniMax 2.7: Video Üretiminde Yeni Çağ', summary: 'MiniMax 2.7 ile 4K video üretimi mümkün. Sora ve Runway i geride bırakan sinematik kalite.', readTime: '4 dk', content: 'MiniMax, 2.7 versiyonu ile video üretiminde çıtayı yükseltti. 4K çözünürlükte sinematik kalitede videolar üretebilen model, karakter tutarlılığı ve fizik simülasyonunda rakiplerini geçiyor.', image_url: 'https://picsum.photos/seed/artificial-intelligence-1/600/300' },
    { category: 'Haberler', emoji: '📰', image: '☁️', title: 'Qwen 3.6 Max: Alibaba Benchmark Lideri', summary: 'Alibaba Qwen 3.6 Max MMLU, SWE-bench ve AIME de zirveye çıktı. Açık kaynak varyantları da yayınlandı.', readTime: '5 dk', content: 'Alibaba, Qwen 3.6 Max ile AI benchmarklarında lider konuma yükseldi. 120B ve 35B açık kaynak varyantları da yayınlanarak topluluk büyük ilgi gösterdi.', image_url: 'https://picsum.photos/seed/neural-web-17/600/300' },
    { category: 'Araştırma', emoji: '🔬', image: '🦙', title: 'Açık Kaynak AI Modelleri 2026: Self-Host Rehberi', summary: 'Llama 4, Qwen 3.6, DeepSeek R1 ve daha fazlası. Hangi donanımda hangi model çalışır? RTX 4090, A100 ve Mac Studio karşılaştırması.', readTime: '15 dk', content: '2026 da açık kaynak AI modelleri kendi sunucunuzda çalıştırmak hiç bu kadar kolay olmamıştı. Bu rehberde Llama 4 Scout, Qwen 3.6 varyantları, DeepSeek R1 ve Phi-4 gibi modellerin donanım gereksinimlerini ve performanslarını karşılaştırıyoruz.', image_url: 'https://picsum.photos/seed/futuristic-10/600/300' },
    { category: 'Agent', emoji: '🕹️', image: '🤖', title: 'AI Agent Frameworkleri Kıyaslaması 2026: CrewAI vs AutoGen vs OpenClaw', summary: '2026 en iyi agent framework ü hangisi? Çoklu agent koordinasyonu, maliyet ve özellik karşılaştırması.', readTime: '12 dk', content: 'AI agent frameworkleri 2026 da olgunlaşmaya devam ediyor. CrewAI, AutoGen ve OpenClaw ın artıları, eksileri ve gerçek dünya kullanım senaryolarını inceliyoruz.', image_url: 'https://picsum.photos/seed/gpu-render-22/600/300' },
  ];
  renderLearn(allLearn);
}

function filterLearn(cat, el) {
  if (el) { document.querySelectorAll('#page-learn .tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); }
  const filtered = cat === 'all' ? allLearn : allLearn.filter(a => a.category === cat);
  renderLearn(filtered);
}

function showLearnArticle(el) {
  try {
    const a = JSON.parse(decodeURIComponent(escape(atob(el.dataset.article))));
    const learnView = document.getElementById('learn-list');
    learnView.innerHTML = `
      <button class="back-btn" onclick="loadLearnContent();document.getElementById('page-learn').scrollIntoView({behavior:'smooth'})">← Tüm Yazılar</button>
      <div class="article-detail">
        ${a.image_url ? '<img src="'+a.image_url+'" class="article-detail-img" onerror="this.style.display=\'none\'" loading="lazy">' : ''}
        <h1>${a.title}</h1>
        <div style="color:var(--text3);font-size:13px;margin-bottom:20px">✍️ ${a.author || 'AI Legion Ekibi'} · 📖 ${a.readTime}</div>
        <div class="content">${(a.content || a.summary || '').split('\n').map(p => p ? '<p>'+p+'</p>' : '').join('')}</div>
      </div>
    `;
    window.scrollTo({top:0,behavior:'smooth'});
  } catch(e) { console.error('showLearnArticle error:', e); }
}

function renderLearn(items) {
  const container = document.getElementById('learn-list');
  if (!items.length) { container.innerHTML = '<div class="empty-state"><div class="icon">📚</div><p>Bu kategoride içerik yok</p></div>'; return; }
  let html = '<div class="articles-grid">';
  items.forEach(function(a, idx) {
    var dataAttr = btoa(unescape(encodeURIComponent(JSON.stringify(a))));
    var bg = gradients[idx % gradients.length];
    var imgHtml;
    if (a.image_url) {
      imgHtml = '<img src="' + a.image_url + '" style="width:100%;height:180px;object-fit:cover;display:block" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">';
      imgHtml += '<div class="article-img-placeholder" style="height:180px;background:' + bg + ';display:none;align-items:center;justify-content:center"><span style="font-size:48px">' + (a.emoji||'📚') + '</span></div>';
    } else {
      imgHtml = '<div class="article-img-placeholder" style="height:180px;background:' + bg + ';display:flex;align-items:center;justify-content:center"><span style="font-size:48px">' + (a.emoji||'📚') + '</span></div>';
    }
    html += '<div class="article-card" onclick="showLearnArticle(this)" data-article="' + dataAttr + '" style="cursor:pointer;overflow:hidden;border-radius:16px">';
    html += imgHtml;
    html += '<div class="article-body">';
    html += '<div class="article-title">' + a.title + '</div>';
    html += '<div class="article-summary">' + a.summary + '</div>';
    html += '<div class="article-meta"><span>✍️ ' + (a.author || 'AI Legion Ekibi') + '</span><span>📖 ' + a.readTime + ' okuma</span></div>';
    html += '</div></div>';
  });
  html += '</div>';
  container.innerHTML = html;
}

// PROMPTS
async function loadPrompts() {
  try {
    allPrompts = [
      { id: 1, category: 'Genel', title: 'Uzman Rol Atama', description: 'AI ya belirli bir uzmanlık rolü ver', prompt: 'Sen [ALAN] konusunda 20 yıllık deneyime sahip bir uzman danışmansın. Sana soracağım sorulara bu perspektiften, derinlemesine ve pratik örneklerle cevap ver.', tags: ['rol', 'uzman', 'danışman'] },
      { id: 2, category: 'Genel', title: 'Adım Adım Düşünme (CoT)', description: 'Karmaşık problemleri parçalara böl', prompt: 'Bu problemi çözmeden önce adım adım düşün:\n1. Problemi tanımla\n2. Hangi bilgilere ihtiyacın var?\n3. Olası yaklaşımları listele\n4. En iyi yaklaşımı seç ve uygula\n5. Sonucu doğrula\n\nProblem: [PROBLEM]', tags: ['düşünme', 'analiz', 'CoT'] },
      { id: 3, category: 'Kod', title: 'Kod İnceleme ve İyileştirme', description: 'Kodu analiz et ve optimize et', prompt: 'Aşağıdaki kodu incele:\n1. Hataları ve güvenlik açıklarını tespit et\n2. Performans iyileştirmeleri öner\n3. Best practice lere uygunluğu değerlendir\n4. İyileştirilmiş versiyonu yaz\n\n```\n[KOD]\n```', tags: ['kod', 'review', 'optimizasyon'] },
      { id: 4, category: 'Kod', title: 'API Entegrasyonu', description: 'Herhangi bir API için entegrasyon kodu yaz', prompt: 'Şu API için [DİL] dilinde tam entegrasyon kodu yaz:\n- API: [API ADI]\n- Endpoint: [ENDPOINT]\n- Auth: [AUTH TİPİ]\n\nHata yönetimi, retry mekanizması ve logging ekle.', tags: ['API', 'entegrasyon', 'kod'] },
      { id: 5, category: 'İçerik', title: 'SEO Blog Yazısı', description: 'Arama motoru optimize edilmiş blog yazısı', prompt: 'Şu konu için SEO optimize blog yazısı yaz:\nKonu: [KONU]\nAnahtar kelime: [ANAHTAR KELİME]\n\nH1 başlık, meta açıklama, H2/H3 alt başlıklar, 1500-2000 kelime, FAQ bölümü ekle.', tags: ['SEO', 'blog', 'içerik'] },
      { id: 6, category: 'İçerik', title: 'Sosyal Medya Paketi', description: 'Tek konudan 5 platform için içerik üret', prompt: 'Şu konu için 5 platform için içerik üret:\nKonu: [KONU]\n\n1. Twitter/X: 280 karakter + hashtag\n2. LinkedIn: 1200 karakter\n3. Instagram: Caption + 30 hashtag\n4. TikTok: 60sn video script\n5. YouTube: Başlık + açıklama + tags', tags: ['sosyal medya', 'içerik'] },
      { id: 7, category: 'İş', title: 'İş Planı Taslağı', description: 'Kapsamlı iş planı oluştur', prompt: 'Şu iş fikri için iş planı hazırla:\nFikir: [İŞ FİKRİ]\n\n1. Yönetici özeti\n2. Pazar analizi\n3. Gelir modeli\n4. Pazarlama stratejisi\n5. Finansal projeksiyonlar (3 yıl)\n6. Risk analizi', tags: ['iş planı', 'girişim'] },
      { id: 8, category: 'İş', title: 'SWOT Analizi', description: 'Derinlemesine SWOT analizi', prompt: 'Şu şirket/proje için SWOT analizi yap:\nŞirket: [İSİM]\n\nHer bölüm için en az 5 madde:\n- Güçlü yönler\n- Zayıf yönler\n- Fırsatlar\n- Tehditler', tags: ['SWOT', 'analiz'] },
      { id: 9, category: 'AI', title: 'Sistem Prompt Yazma', description: 'AI için güçlü sistem promptu oluştur', prompt: 'Şu amaç için sistem promptu yaz:\nAmaç: [AMAÇ]\nKitle: [KİTLE]\nTon: [TON]\n\nRol tanımı, davranış kuralları, çıktı formatı, yapılacaklar/yapılmayacaklar ekle.', tags: ['sistem prompt', 'AI'] },
      { id: 10, category: 'AI', title: 'AI Agent Tasarımı', description: 'Otonom AI agent mimarisi tasarla', prompt: 'Şu görev için AI agent mimarisi tasarla:\nGörev: [GÖREV]\nAraçlar: [ARAÇLAR]\n\n1. Hedefler ve alt hedefler\n2. Karar verme döngüsü\n3. Araç kullanım stratejisi\n4. Hata yönetimi\n5. Hafıza yönetimi', tags: ['agent', 'AI', 'otomasyon'] },
      { id: 11, category: 'Kod', title: 'Full-Stack Uygulama Oluştur', description: 'Sıfırdan tam stacklı uygulama oluştur', prompt: 'Şu özelliklere sahip bir [TEKNOLOJİ] uygulaması oluştur:\nUygulama: [İSİM]\nÖzellikler: [ÖZELLİKLER]\n\n1. Proje yapısını oluştur\n2. Veritabanı şemasını tasarla\n3. API endpointlerini yaz\n4. Frontend bileşenlerini oluştur\n5. Auth sistemi ekle\n6. Hata yönetimi ve validasyon ekle\n7. Test yaz\n\nHer dosya için tam kod ver.', tags: ['full-stack', 'uygulama', 'kod'] },
      { id: 12, category: 'Kod', title: 'Veritabanı Şeması Tasarla', description: 'İlişkisel veritabanı şeması oluştur', prompt: 'Şu sistem için PostgreSQL veritabanı şeması tasarla:\nSistem: [SİSTEM]\nGereksinimler: [GEREKSİNİMLER]\n\n1. Tüm tabloları oluştur (CREATE TABLE)\n2. İlişkileri ve foreign keyleri tanımla\n3. İndexleri ekle\n4. Trigger ve fonksiyonlar yaz\n5. Seed verisi ekle\n6. RLS politikaları tanımla', tags: ['veritabanı', 'SQL', 'şema'] },
      { id: 13, category: 'İçerik', title: 'YouTube Video Scripti', description: 'Viral YouTube video scripti yaz', prompt: 'Şu konu hakkında [DAKİKA] dakikalık YouTube video scripti yaz:\nKonu: [KONU]\nKanal tonu: [EĞİTİCİ/ENTERTAINING/İKİSİ]\n\n1. Hook (ilk 10 saniye - dikkat çekici)\n2. Intro (kanıta dayalı iddia)\n3. Ana içerik (3-5 bölüm, her biri bir alt başlık)\n4. CTA (abone ol, like at)\n5. Outro\n\nThumbnail önerisi ve başlık alternatifleri de ver.', tags: ['YouTube', 'video', 'script'] },
      { id: 14, category: 'İçerik', title: 'Email Pazarlama Dizisi', description: 'Dönüşüm odaklı email serisi oluştur', prompt: 'Şu ürün/hizmet için 5 emaillik pazarlama dizisi yaz:\nÜrün: [ÜRÜN]\nKitle: [KİTLE]\nHedef: [DÖNÜŞÜM]\n\n1. Hoş geldin emaili (Day 0)\n2. Değer emaili (Day 2)\n3. Sorun emaili (Day 4)\n4. Çözüm emaili (Day 6)\n5. Aciliyet emaili (Day 8)\n\nHer email için: Konu satırı, Ön izleme metni, Gövde, CTA', tags: ['email', 'pazarlama', 'dönüşüm'] },
      { id: 15, category: 'İş', title: 'Rakip Analizi', description: 'Detaylı rakip analiz raporu oluştur', prompt: 'Şu sektörde rakip analizi yap:\nSektör: [SEKTÖR]\nŞirketimiz: [ŞİRKET]\nRakipler: [RAKİP LİSTESİ]\n\nHer rakip için:\n1. Pazar konumu ve payı\n2. Güçlü ve zayıf yönler\n3. Fiyatlandırma stratejisi\n4. Hedef kitle\n5. Fırsat pencereleri\n6. Rekabet avantajımız\n\nSonuç olarak stratejik öneriler sun.', tags: ['rakip analizi', 'strateji', 'iş'] },
      { id: 16, category: 'İş', title: 'Pazar Fırsatı Tespiti', description: 'Yeni pazar fırsatlarını keşfet', prompt: 'Şu alanda pazar fırsatlarını analiz et:\nAlan: [ALAN]\nBütçe: [BÜTÇE]\nDeneyim: [DENEYİM]\n\n1. Büyüyen pazar eğilimleri (5 trend)\n2. Tatmin edilmemiş ihtiyaçlar (5 fırsat)\n3. Her fırsat için Tahmini Pazar Büyüklüğü\n4. Rekabet yoğunluğu analizi\n5. Başlangıç maliyeti tahmini\n6. 6 aylık yol haritası\n7. Risk değerlendirmesi', tags: ['pazar', 'fırsat', 'girişim'] },
      { id: 17, category: 'Genel', title: 'Kapsamlı Öğrenme Planı', description: 'Herhangi bir konuda öğrenme planı oluştur', prompt: 'Şu konuyu sıfırdan öğrenmek için 30 günlük plan oluştur:\nKonu: [KONU]\nMevcut seviye: [SEVİYE]\nGünlük süre: [SAAT]\n\nHer hafta için:\n1. Öğrenilecek konular (3-5 alt başlık)\n2. Pratik projeler\n3. Önerilen kaynaklar (kitap, kurs, video)\n4. Haftalık değerlendirme kriterleri\n\nSonunda portföy projesi ve sonraki adımlar.', tags: ['öğrenme', 'plan', 'eğitim'] },
      { id: 18, category: 'Genel', title: 'Karar Verme Çerçevesi', description: 'Karmaşık kararları sistematik analiz et', prompt: ' Şu karar için analitik çerçeve oluştur:\nKarar: [KARAR]\nSeçenekler: [SEÇENEKLER]\nKısıtlar: [KISITLAR]\n\n1. Her seçeneğin artı/eksi listesi\n2. Risk analizi (olasılık x etki matrisi)\n3. Karar ağacı oluştur\n4. En kötü senaryo analizi\n5. 10-10-10 kuralını uygula (10 dk, 10 ay, 10 yıl etkisi)\n6. Tavsiye ve gerekçe', tags: ['karar', 'analiz', 'çerçeve'] },
      { id: 19, category: 'AI', title: 'Prompt Zinciri (Chain)', description: 'Çok adımlı görev için prompt zinciri oluştur', prompt: 'Şu karmaşık görevi AI prompt zincirine dönüştür:\nGörev: [GÖREV]\nAlt görevler: [ALT GÖREVLER]\n\nHer adım için:\n1. Adım amacı\n2. Girdi (önceki adımdan gelen)\n3. Prompt şablonu\n4. Beklenen çıktı formatı\n5. Kalite kontrol kriterleri\n\nAdımlar birbirine bağlanmalı ve son adım nihai sonucu üretmeli.', tags: ['prompt zinciri', 'AI', 'otomasyon'] },
      { id: 20, category: 'İçerik', title: 'Ürün Açıklaması Yaz', description: 'E-ticaret için dönüşüm odaklı ürün açıklaması', prompt: 'Şu ürün için e-ticaret ürün açıklaması yaz:\nÜrün: [ÜRÜN]\nHedef kitle: [KİTLE]\nFiyat: [FİYAT]\n\n1. Dikkat çekici başlık (60 karakter max)\n2. Alt başlık (120 karakter max)\n3. Madde madde özellikler (5-7 madde)\n4. Fayda odaklı açıklama (2-3 paragraf)\n5. Sosyal kanıt / garanti\n6. CTA metni\n7. Meta description (160 karakter)\n\nSEO anahtar kelimelerini doğal şekilde dahil et.', tags: ['e-ticaret', 'ürün', 'dönüşüm'] },
    ];
    renderPrompts(allPrompts);
  } catch(e) { document.getElementById('prompts-list').innerHTML = '<div class="loading">Promptlar yüklenemedi</div>'; }
}

function filterPrompts(cat, el) {
  if (el) { document.querySelectorAll('#prompts-tabs .tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); }
  const filtered = cat === 'all' ? allPrompts : allPrompts.filter(p => p.category === cat);
  renderPrompts(filtered);
}

function renderPrompts(prompts) {
  const container = document.getElementById('prompts-list');
  if (!prompts.length) { container.innerHTML = '<div class="empty-state"><div class="icon">✨</div><p>Bu kategoride prompt yok</p></div>'; return; }
  container.innerHTML = prompts.map(p => `
    <div class="prompt-card">
      <span class="prompt-category">${p.category}</span>
      <div class="prompt-title">${p.title}</div>
      <div class="prompt-desc">${p.description}</div>
      <div class="prompt-tags">${(p.tags||[]).map(t => `<span class="prompt-tag">#${t}</span>`).join('')}</div>
      <div class="prompt-preview">${p.prompt}</div>
      <div class="prompt-actions">
        <button class="btn btn-gold btn-sm" onclick="showPrompt(${JSON.stringify(p.title).replace(/"/g,'&quot;')}, ${JSON.stringify(p.prompt).replace(/"/g,'&quot;')})">👁️ Görüntüle</button>
        <button class="btn btn-outline btn-sm" onclick="copyPromptDirect(${JSON.stringify(p.prompt).replace(/"/g,'&quot;')})">📋 Kopyala</button>
      </div>
    </div>
  `).join('');
}

function showPrompt(title, prompt) {
  document.getElementById('prompt-modal-title').textContent = '✨ ' + title;
  document.getElementById('prompt-modal-content').textContent = prompt;
  currentPromptText = prompt;
  openModal('prompt-modal');
}

function copyPrompt() {
  navigator.clipboard.writeText(currentPromptText).then(() => showToast('Prompt kopyalandı! 📋'));
}

function copyPromptDirect(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Prompt kopyalandı! 📋'));
}

// PROFILE
function viewProfile(username) {
  showPage('profile');
  loadProfile(username);
}

async function loadProfile(username) {
  const container = document.getElementById('profile-content');
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  try {
    const users = await sb(`/users?username=eq.${username}&limit=1`);
    const user = users[0];

    const initial = (user.username||"?")[0].toUpperCase();
    const posts = await sb(`/posts?user_id=eq.${user.id}&order=created_at.desc`);
    container.innerHTML = `
      <div class="profile-header-card">
        <div class="profile-banner"></div>
        <div class="profile-avatar-wrap">
          <div class="profile-big-avatar">${initial}</div>
        </div>
        <div class="profile-info">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <div class="profile-name">@${user.username}</div>
            ${user.is_admin ? '<span class="badge badge-admin">Admin</span>' : ''}
          </div>
          <div class="profile-bio">${user.bio || 'AI Legion üyesi ⚔️'}</div>
          <input type="hidden" id="profile-edit-bio-input" value="${user.bio || ''}">
          <div class="profile-stats">
            <div class="stat"><div class="stat-num">${posts.length||0}</div><div class="stat-label">Post</div></div>
            <div class="stat"><div class="stat-num">${user.followers_count||0}</div><div class="stat-label">Takipçi</div></div>
            <div class="stat"><div class="stat-num">${user.following_count||0}</div><div class="stat-label">Takip</div></div>
          </div>
        </div>
       <div class="section-title" style="margin-bottom:12px">Postlar</div>
      <div>${posts.map(p => renderPost({...p, user:{username:user.username}, likes_count:0, comments_count:0, reposts_count:0})).join("") || 
        "<div class=\"empty-state\"><div class=\"icon\">💬</div><p>Henüz post yok</p></div>"}</div>
    `;
  } catch(e) { container.innerHTML = 
        "<div class=\"empty-state\"><div class=\"icon\">⚠️</div><p>Profil yüklenemedi</p></div>"; }
}// ADMIN
async function loadAdminStats() {
  try {
    const usersCount = await sb('/users?select=id', { method: 'HEAD' });
    const postsCount = await sb('/posts?select=id', { method: 'HEAD' });
    const articlesCount = await sb('/articles?select=id', { method: 'HEAD' });
    const toolsCount = allTools.length;
    const promptsCount = allPrompts.length;

    const stats = {
      users: usersCount.headers.get('content-range').split('/')[1],
      posts: postsCount.headers.get('content-range').split('/')[1],
      articles: articlesCount.headers.get('content-range').split('/')[1],
      tools: toolsCount,
      prompts: promptsCount
    };

    document.getElementById("stat-users").textContent = stats.users || 0;
    document.getElementById("stat-posts").textContent = stats.posts || 0;
    document.getElementById("stat-articles").textContent = stats.articles || 0;
    document.getElementById("stat-likes").textContent = 0; // Supabase de likes tablosu yok, bu yüzden 0 olarak ayarlandı
    document.getElementById("stat-comments").textContent = 0; // Supabase de comments tablosu yok, bu yüzden 0 olarak ayarlandı
  } catch(e) {}
}

async function loadAdminPosts() {
  try {
    const posts = await sb('/posts?order=created_at.desc');

    const container = document.getElementById('admin-posts-list');
    if (!posts.length) { container.innerHTML = '<div class="empty-state"><div class="icon">📝</div><p>Henüz post yok</p></div>'; return; }
    container.innerHTML = `
      <table class="data-table">
        <thead><tr><th>Kullanıcı</th><th>İçerik</th><th>Tarih</th><th>İşlem</th></tr></thead>
        <tbody>
          ${posts.map(p => `
            <tr>
              <td>@${p.user?.username||'?'}</td>
              <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.content}</td>
              <td style="color:var(--text3)">${new Date(p.created_at).toLocaleDateString('tr-TR')}</td>
             <td><button class="btn btn-gold btn-sm" onclick="adminEditPost('${p.id}')">Düzenle</button> <button class="btn btn-red btn-sm" onclick="adminDeletePost('${p.id}')">Sil</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch(e) {}
}

async function loadAdminUsers() {
  try {
    const users = await sb("/users?order=created_at.desc");
 
    const container = document.getElementById('admin-users-list');
    container.innerHTML = `
      <table class="data-table">
        <thead><tr><th>Kullanıcı Adı</th><th>E-posta</th><th>Admin</th><th>Kayıt</th><th>İşlem</th></tr></thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td style="font-weight:600">@${u.username}</td>
              <td style="color:var(--text2)">${u.email||'-'}</td>
              <td>${u.is_admin ? '<span class="badge badge-admin">Admin</span>' : '-'}</td>
            <td style="color:var(--text3)">${new Date(u.created_at).toLocaleDateString('tr-TR')}</td>
              <td><button class="btn btn-gold btn-sm" onclick="adminEditUser('${u.id}')">Düzenle</button> ${!u.is_admin ? `<button class="btn btn-red btn-sm" onclick="adminDeleteUser('${u.id}')">Sil</button>` : ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch(e) {}
}

async function loadAdminArticles() {
  try {
    const articles = await sb("/articles?order=created_at.desc");

    const container = document.getElementById('admin-articles-list');
    if (!articles.length) { container.innerHTML = '<div class="empty-state"><div class="icon">📰</div><p>Henüz haber yok</p></div>'; return; }
    container.innerHTML = `
      <table class="data-table">
        <thead><tr><th>Başlık</th><th>Kategori</th><th>Yazar</th><th>Tarih</th><th>İşlem</th></tr></thead>
        <tbody>
          ${articles.map(a => `
            <tr>
              <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.title}</td>
              <td><span class="article-category" style="font-size:10px">${a.category}</span></td>
              <td style="color:var(--text2)">${a.author||'-'}</td>
              <td style="color:var(--text3)">${new Date(a.created_at).toLocaleDateString('tr-TR')}</td>
              <td><button class="btn btn-gold btn-sm" onclick="adminEditArticle('${a.id}')">Düzenle</button> <button class="btn btn-red btn-sm" onclick="adminDeleteArticle('${a.id}')">Sil</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch(e) {}
}

function switchAdminTab(tab, el) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('admin-' + tab).classList.add('active');
  if (tab === 'users') loadAdminUsers();
  if (tab === 'articles') loadAdminArticles();
  if (tab === 'nav') renderNavManager();
}
async function adminEditPost(id) {
  try {
    const posts = await sb('/posts?id=eq.' + id + '&limit=1');
    if (posts && posts.length > 0) {
      document.getElementById('edit-post-id').value = id;
      document.getElementById('edit-post-content').value = posts[0].content || '';
      openModal('edit-post-modal');
    } else {
      showToast('Post bulunamadı');
    }
  } catch(e) { showToast('Post yüklenemedi'); }
}

async function saveEditedPost() {
  const id = document.getElementById('edit-post-id').value;
  const content = document.getElementById('edit-post-content').value.trim();
  if (!content) { showToast('Post içeriği boş olamaz'); return; }
  try {
    await sb(`/posts?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ content }) });
    closeModal('edit-post-modal');
    showToast('Post güncellendi!');
    loadAdminPosts();
  } catch(e) { showToast('Hata oluştu'); }
}

async function adminDeletePost(id) {
  if (!confirm("Bu postu silmek istediğinize emin misiniz?")) return;
  try {
    await sb(`/posts?id=eq.${id}`, { method: 'DELETE' });
    showToast("Post silindi!");
    loadAdminPosts();
  } catch(e) { showToast("Hata oluştu"); }
}

async function adminEditUser(id) {
  const user = (await sb(`/users?id=eq.${id}&limit=1`))[0];
  if (!user) { showToast('Kullanıcı bulunamadı'); return; }
  document.getElementById('edit-user-id').value = user.id;
  document.getElementById('edit-user-username').value = user.username;
  document.getElementById('edit-user-bio').value = user.bio || '';
  document.getElementById('edit-user-is-admin').checked = user.is_admin;
  openModal('edit-user-modal');
}

async function saveEditedUser() {
  const id = document.getElementById('edit-user-id').value;
  const bio = document.getElementById('edit-user-bio').value.trim();
  const is_admin = document.getElementById('edit-user-is-admin').checked;
  try {
    await sb(`/users?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ bio, is_admin }) });
    closeModal('edit-user-modal');
    showToast('Kullanıcı güncellendi!');
    loadAdminUsers();
  } catch(e) { showToast('Hata oluştu'); }
}

async function adminDeleteUser(id) {
  if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
  try {
    await sb(`/users?id=eq.${id}`, { method: 'DELETE' });
    showToast('Kullanıcı silindi');
    loadAdminUsers();
    loadAdminStats();
  } catch(e) { showToast("Hata oluştu"); }
}

async function adminEditArticle(id) {
  const article = (await sb(`/articles?id=eq.${id}&limit=1`))[0];
  if (!article) { showToast('Haber bulunamadı'); return; }
  document.getElementById('edit-article-id').value = article.id;
  document.getElementById('edit-article-title').value = article.title;
  document.getElementById('edit-article-content').value = article.content;
  openModal('edit-article-modal');
}

async function saveEditedArticle() {
  const id = document.getElementById('edit-article-id').value;
  const title = document.getElementById('edit-article-title').value.trim();
  const content = document.getElementById('edit-article-content').value.trim();
  if (!title || !content) { showToast('Başlık ve içerik zorunlu'); return; }
  try {
    await sb(`/articles?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ title, content }) });
    closeModal('edit-article-modal');
    showToast('Haber güncellendi!');
    loadAdminArticles();
  } catch(e) { showToast('Hata oluştu'); }
}

async function adminDeleteArticle(id) {
  if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
  try {
    await sb(`/articles?id=eq.${id}`, { method: 'DELETE' });
    showToast("Haber silindi!");
    loadAdminArticles();
  } catch(e) { showToast("Hata oluştu"); }
}
