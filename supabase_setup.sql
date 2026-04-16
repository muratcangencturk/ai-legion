-- AI Legion Pro - Supabase Tablo Kurulumu

-- Users tablosu
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts tablosu
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes tablosu
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Reposts tablosu
CREATE TABLE IF NOT EXISTS reposts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Comments tablosu
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookmarks tablosu
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Follows tablosu
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Articles tablosu
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  author TEXT DEFAULT 'AI Legion',
  category TEXT DEFAULT 'Genel',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) kapat - herkes okuyabilsin
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni ver
CREATE POLICY "Public read" ON users FOR SELECT USING (true);
CREATE POLICY "Public read" ON posts FOR SELECT USING (true);
CREATE POLICY "Public read" ON likes FOR SELECT USING (true);
CREATE POLICY "Public read" ON reposts FOR SELECT USING (true);
CREATE POLICY "Public read" ON comments FOR SELECT USING (true);
CREATE POLICY "Public read" ON bookmarks FOR SELECT USING (true);
CREATE POLICY "Public read" ON follows FOR SELECT USING (true);
CREATE POLICY "Public read" ON articles FOR SELECT USING (true);

-- Herkese yazma izni ver (service role ile)
CREATE POLICY "Public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert" ON reposts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert" ON bookmarks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert" ON follows FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert" ON articles FOR INSERT WITH CHECK (true);

CREATE POLICY "Public delete" ON likes FOR DELETE USING (true);
CREATE POLICY "Public delete" ON reposts FOR DELETE USING (true);
CREATE POLICY "Public delete" ON bookmarks FOR DELETE USING (true);
CREATE POLICY "Public delete" ON follows FOR DELETE USING (true);
CREATE POLICY "Public delete" ON posts FOR DELETE USING (true);
CREATE POLICY "Public delete" ON comments FOR DELETE USING (true);
CREATE POLICY "Public delete" ON users FOR DELETE USING (true);
CREATE POLICY "Public delete" ON articles FOR DELETE USING (true);

-- Admin kullanicisi ekle
INSERT INTO users (username, email, password_hash, is_admin, bio)
VALUES ('muratcangencturk', 'muratcangencturk@windowslive.com', '276398MG', TRUE, 'AI Legion kurucusu')
ON CONFLICT (username) DO NOTHING;

-- Örnek haberler ekle
INSERT INTO articles (title, content, summary, author, category) VALUES
('OpenAI GPT-4o Yeni Özellikler Duyurdu', 'OpenAI, GPT-4o modelinin yeni ses ve görüntü işleme özelliklerini duyurdu. Model artık gerçek zamanlı konuşma yapabiliyor ve duygusal tonları algılayabiliyor.', 'GPT-4o artık gerçek zamanlı ses ve görüntü işleyebiliyor.', 'AI Legion', 'Haberler'),
('Google Gemini 2.0 Flash Çıktı', 'Google, Gemini 2.0 Flash modelini yayınladı. 1 milyon token context window ile uzun belgeleri analiz edebiliyor. Ücretsiz kullanım limiti de artırıldı.', 'Gemini 2.0 Flash 1M token destekliyor.', 'AI Legion', 'Haberler'),
('Claude 3.7 Sonnet Coding Benchmarklarda Zirvede', 'Anthropic''in Claude 3.7 Sonnet modeli, SWE-bench coding testinde %70 üzeri başarı oranıyla rekor kırdı. Yazılım geliştirmede yeni standart.', 'Claude 3.7 coding''de rekor kırdı.', 'AI Legion', 'Haberler');

-- Örnek post ekle (admin hesabından)
INSERT INTO posts (user_id, content)
SELECT id, 'AI Legion''a hoş geldiniz! Bu platform AI haberleri, araç kıyaslamaları ve topluluk paylaşımları için kuruldu. Hesap açın, post atın, tartışın! 🚀'
FROM users WHERE username = 'muratcangencturk';
