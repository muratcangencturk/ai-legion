-- AI Legion - Articles Tablosu Görsel Güncelleme SQL
-- Supabase Dashboard > SQL Editor'da çalıştır
-- Tarih: 2026-04-26

-- ÖNEMLİ: Bu sorgu articles tablosundaki alakasız görselleri AI/teknoloji temalı görsellerle değiştirir

-- 1. Windows XP / Manzara / Çerçeve gibi alakasız görselleri temizle
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE image_url LIKE '%pexels-photo-17484899%' 
   OR image_url LIKE '%pexels-photo-18069166%'
   OR image_url LIKE '%bliss%'
   OR image_url LIKE '%windows%'
   OR title ILIKE '%açık kaynak%'
   OR title ILIKE '%deepseek%'
   OR title ILIKE '%llama%'
   OR title ILIKE '%meta%'
   OR title ILIKE '%claude%'
   OR title ILIKE '%freelance%'
   OR title ILIKE '%agent%';

-- 2. Yaprak / Doğa görsellerini AI network görselleriyle değiştir
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/8566589/pexels-photo-8566589.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE (image_url LIKE '%pexels-photo-843892%' OR image_url LIKE '%leaf%' OR image_url LIKE '%nature%')
  AND title ILIKE '%rag%';

-- 3. Bina / Şehir görsellerini AI model görselleriyle değiştir
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/8566500/pexels-photo-8566500.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE (image_url LIKE '%building%' OR image_url LIKE '%city%' OR image_url LIKE '%skyline%')
  AND title ILIKE '%mistral%';

-- 4. Gökyüzü / Ufuk görsellerini video AI görselleriyle değiştir
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/8566545/pexels-photo-8566545.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE (image_url LIKE '%sky%' OR image_url LIKE '%horizon%' OR image_url LIKE '%cloud%')
  AND (title ILIKE '%video%' OR title ILIKE '%minimax%' OR title ILIKE '%sora%');

-- 5. İş insanı / Ofis görsellerini AI data görselleriyle değiştir
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/8566525/pexels-photo-8566525.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE (image_url LIKE '%business%' OR image_url LIKE '%office%' OR image_url LIKE '%suit%')
  AND (title ILIKE '%qwen%' OR title ILIKE '%alibaba%' OR title ILIKE '%benchmark%');

-- 6. Tapınak / Silüet görsellerini AI model görselleriyle değiştir
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/18069596/pexels-photo-18069596.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE (image_url LIKE '%temple%' OR image_url LIKE '%silhouette%' OR image_url LIKE '%monument%')
  AND (title ILIKE '%glm%' OR title ILIKE '%zhipu%' OR title ILIKE '%kimi%');

-- 7. Google / Gemini için özel görsel
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/17485677/pexels-photo-17485677.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE title ILIKE '%gemini%' OR title ILIKE '%google%';

-- 8. GPT / OpenAI için özel görsel
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE title ILIKE '%gpt%' OR title ILIKE '%openai%';

-- 9. Cursor / Windsurf / Kod editörü için özel görsel
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE title ILIKE '%cursor%' OR title ILIKE '%windsurf%' OR title ILIKE '%kod%' OR title ILIKE '%editör%';

-- 10. SaaS / Ürün için özel görsel
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE title ILIKE '%saas%' OR title ILIKE '%ürün%';

-- 11. AB / Regülasyon için özel görsel
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/17485677/pexels-photo-17485677.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE title ILIKE '%ab%' OR title ILIKE '%act%' OR title ILIKE '%düzenleme%' OR title ILIKE '%regülasyon%';

-- 12. Framework / CrewAI / AutoGen için özel görsel
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/843892/pexels-photo-843892.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE title ILIKE '%framework%' OR title ILIKE '%crewai%' OR title ILIKE '%autogen%';

-- 13. İş gücü / Freelance için özel görsel
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/843892/pexels-photo-843892.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE title ILIKE '%iş gücü%' OR title ILIKE '%freelance%';

-- 14. Llama / Meta için özel görsel
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/18069157/pexels-photo-18069157.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE title ILIKE '%llama%' OR title ILIKE '%meta%';

-- 15. Self-host / Açık kaynak için özel görsel
UPDATE articles 
SET image_url = 'https://images.pexels.com/photos/18069157/pexels-photo-18069157.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
WHERE title ILIKE '%self-host%' OR title ILIKE '%açık kaynak%';

-- Sonuçları kontrol et
SELECT id, title, image_url, created_at 
FROM articles 
ORDER BY created_at DESC 
LIMIT 20;
