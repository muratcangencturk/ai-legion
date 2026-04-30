import re
with open('index.html','r',encoding='utf-8') as f:
    text = f.read()

# Find allNews block
m_news = re.search(r'allNews\s*=\s*\[(.*?)\];', text, re.DOTALL)
news_block = m_news.group(1) if m_news else ''

# Find allLearn block
m_learn = re.search(r'allLearn\s*=\s*\[(.*?)\];', text, re.DOTALL)
learn_block = m_learn.group(1) if m_learn else ''

# Extract image_url values (both single and double quotes)
def extract_urls(block, name):
    urls_sq = re.findall(r"image_url\s*:\s*'([^']+)'", block)
    urls_dq = re.findall(r'image_url\s*:\s*"([^"]+)"', block)
    urls = urls_sq + urls_dq
    # Also capture old 'image:' field if image_url missing
    img_sq = re.findall(r"image\s*:\s*'([^']+)'", block)
    img_dq = re.findall(r'image\s*:\s*"([^"]+)"', block)
    # But only if not already in urls
    extra = [u for u in (img_sq+img_dq) if u not in urls]
    return urls + extra

news_urls = extract_urls(news_block, 'news')
learn_urls = extract_urls(learn_block, 'learn')

print(f'allNews resim sayisi: {len(news_urls)}')
print(f'allLearn resim sayisi: {len(learn_urls)}')

# Cross duplicates between news and learn cross = set(news_urls) & set(learn_urls) print(f'\nNews <-> Learn Cakisan: {len(cross)}') for u in sorted(cross): print(f'  CROSS: {u}')

# Duplicate check inside allLearn from collections import Counter learn_counts = Counter(learn_urls) dups_learn = {u:c for u,c in learn_counts.items() if c > 1} print(f'\nallLearn icinde tekrar: {len(dups_learn)}') for u,c in dups_learn.items(): print(f'  {c}x {u}')

# Duplicate check inside allNews news_counts = Counter(news_urls) dups_news = {u:c for u,c in news_counts.items() if c > 1} print(f'\nallNews icinde tekrar: {len(dups_news)}') for u,c in dups_news.items(): print(f'  {c}x {u}')

# Print which learn entries have cross duplicates
print('\n--- DETAY: allLearn title + Cakisan image_url ---')
entries = re.findall(r"\{[^{}]*category:[^{}]*\}", learn_block, re.DOTALL)
for entry in entries:
    title_match = re.search(r"title\s*:\s*['\"]([^'\"]+)['\"]", entry)
    img_match = re.search(r"image_url\s*:\s*['\"]([^'\"]+)['\"]", entry)
    if not img_match:
        img_match = re.search(r"image\s*:\s*['\"]([^'\"]+)['\"]", entry)
    if title_match and img_match:
        title = title_match.group(1)
        img = img_match.group(1)
        if img in cross:
            print(f'  "{title}" -> {img}')
