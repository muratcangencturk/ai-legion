import re
with open('index.html','r',encoding='utf-8') as f:
    text = f.read()

m_news = re.search(r'allNews\s*=\s*(\[.*?\]);', text, re.DOTALL)
m_learn = re.search(r'allLearn\s*=\s*(\[.*?\]);', text, re.DOTALL)

news_text = m_news.group(1) if m_news else ''
learn_text = m_learn.group(1) if m_learn else ''

news_urls = re.findall(r'image_url:\s*"([^"]+)"', news_text)
learn_urls = re.findall(r'image_url:\s*"([^"]+)"', learn_text)

print(f'allNews: {len(news_urls)}, allLearn: {len(learn_urls)}')
news_set = set(news_urls)
learn_set = set(learn_urls)
dups = news_set & learn_set
print(f'Cakisan: {len(dups)}')
for u in sorted(dups):
    print(f'DUP: {u}')

# Also check duplicates within allLearn itself
learn_counts = {}
for u in learn_urls:
    learn_counts[u] = learn_counts.get(u, 0)+1
print(f'\nallLearn icinde tekrarlanan:')
for u,c in learn_counts.items():
    if c > 1:
        print(f'  {c}x {u}')
