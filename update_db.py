import urllib.request
import json

BASE = "https://cnxeckhygerxdhlahimp.supabase.co/rest/v1/articles"
APIKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNueGVja2h5Z2VyeGRobGFoaW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU5NDUxNiwiZXhwIjoyMDkwMTcwNTE2fQ.zoYYmI4R_2W-aSGNAsMm7J2RpXQqhpGhXOPfJgCqsHk"

updates = [
    ("e9eb7407-5a8e-417a-81dc-02c6e9174e6e", {"title": "GPT-5.5 Tanıtıldı: OpenAI'den Devrim Niteliğinde Güncelleme", "category": "Model", "summary": "OpenAI, GPT-5.5 ile 1M token context ve agent yetenekleri müjdesini verdi.", "content": "OpenAI, GPT-5.5'i duyurdu. Yeni model, 1 milyon token context window ile geliyor. SWE-bench'de %74.9, MMLU'da %88.2 skorlarıyla dikkat çekiyor."}),
    ("c47582e4-225b-46c9-b7af-6b535cb59d35", {"title": "Claude Opus 4.7: Anthropic'in En Güçlü Modeli", "category": "Model", "summary": "Anthropic'in yeni amiral gemisi Claude Opus 4.7, tüm benchmarklarda insanları geride bıraktı.", "content": "Anthropic, Claude Opus 4.7'yi piyasaya çıkardı. LMSYS Elo 1506, MMLU %88.7, SWE-bench %74.2 skorlarıyla sektör lideri. 200K token context window."}),
    ("d0a2243c-a194-4f75-8b73-d2158a613003", {"title": "Gemini 3.1 Pro: Google'ın En Güçlü Modeli Artık Ücretsiz", "category": "Model", "summary": "Google, Gemini 3.1 Pro'yu tamamen ücretsiz hale getirdi.", "content": "Gemini 3.1 Pro, SWE-bench %80.6 ile kod yazma lideri, 1M token context window. MMLU %87.9 skorlarıyla ücretsiz."}),
    ("63d6c887-c54f-4e3e-b850-beadda5d9bd6", {"title": "Llama 4 Scout: Meta'nın Açık Kaynak Devrimi", "category": "Model", "summary": "Meta, Llama 4 Scout'u açık kaynak olarak yayınladı.", "content": "Llama 4 Scout, MoE mimarisi, 128 uzman, 16M token context window. LMSYS Elo 1421, MMLU %79.6."}),
    ("eb90cc62-8cab-4ee3-adf2-bb6d31b6c59e", {"title": "Grok 4: xAI'ın En Güçlü Modeli", "category": "Model", "summary": "xAI, Grok 4'ü X platformuyla entegre şekilde sundu.", "content": "Grok 4, LMSYS Elo 1471, MMLU %87.1, SWE-bench %75.0. Gerçek zamanlı X verisi."}),
    ("f7468243-c95f-4b26-9e32-c43ccd6e1345", {"title": "DeepSeek V4: Açık Kaynak Devrimi", "category": "Model", "summary": "DeepSeek V4, açık kaynak dünyasında devrim yaraktı.", "content": "DeepSeek V4, LMSYS Elo 1452, MMLU %87.1 skorlarıyla ücretsiz."}),
    ("5ac04e28-b76f-4904-a502-bd24c2aece01", {"title": "AI Düzenlemeleri: AB AI Act Yürürlüğe Girdi", "category": "Düzenleme", "summary": "Avrupa Birliği'nin kapsamlı AI düzenlemesi resmen yürürlükte.", "content": "AI Act ile yüksek riskli AI sistemleri için şeffaflık ve denetim zorunlulukları getirildi."}),
    ("9397daff-2d1c-4d04-b76f-d7ee12ebcd07", {"title": "Cursor ve Windsurf: AI Kod Editörleri Savaşı", "category": "Araçlar", "summary": "AI destekli kod editörleri pazarında rekabet kızışıyor.", "content": "Cursor, Claude ve GPT entegrasyonuyla öne çıkarken, Windsurf geniş ücretsiz tieri ile dikkat çekiyor."}),
]

for aid, data in updates:
    url = f"{BASE}?id=eq.{aid}"
    body = json.dumps(data, ensure_ascii=False).encode('utf-8')
    req = urllib.request.Request(url, data=body, method='PATCH')
    req.add_header('apikey', APIKEY)
    req.add_header('Authorization', f'Bearer {APIKEY}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Prefer', 'return=representation')
    try:
        resp = urllib.request.urlopen(req)
        result = resp.read().decode('utf-8')
        print(f"✓ {data['title'][:40]}: {resp.status}")
    except Exception as e:
        print(f"✗ {aid[:8]}: {e}")