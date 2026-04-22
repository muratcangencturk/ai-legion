#!/usr/bin/env python3
import urllib.request
import json

BASE = "https://cnxeckhygerxdhlahimp.supabase.co/rest/v1/articles"
APIKEY = "sb_publishable_-Q9jXB9o2XHE39H4GL9lqw_eulC8lK5"

headers = {
    "apikey": APIKEY,
    "Authorization": f"Bearer {APIKEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

updates = [
    ("e9eb7407-5a8e-417a-81dc-02c6e9174e6e", {
        "title": "GPT-5.5 Tanıtıldı: OpenAI'den Devrim Niteliğinde Güncelleme",
        "category": "Model",
        "summary": "OpenAI, GPT-5.5 ile 1M token context ve agent yetenekleri müjdesini verdi.",
        "content": "OpenAI, GPT-5.5'i duyurdu. Yeni model, 1 milyon token context window ile geliyor. SWE-bench'de %74.9, MMLU'da %88.2 skorlarıyla dikkat çekiyor."
    }),
    ("c47582e4-225b-46c9-b7af-6b535cb59d35", {
        "title": "Claude Opus 4.7: Anthropic'in En Güçlü Modeli",
        "category": "Model",
        "summary": "Anthropic'in yeni amiral gemisi Claude Opus 4.7, tüm benchmarklarda insanları geride bıraktı.",
        "content": "Anthropic, Claude Opus 4.7'yi piyasaya çıkardı. LMSYS Elo 1506, MMLU %88.7, SWE-bench %74.2 skorlarıyla sektör lideri. 200K token context window ile uzun doküman analizi mümkün."
    }),
    ("d0a2243c-a194-4f75-8b73-d2158a613003", {
        "title": "Gemini 3.1 Pro: Google'ın En Güçlü Modeli Artık Ücretsiz",
        "category": "Model",
        "summary": "Google, Gemini 3.1 Pro'yu tamamen ücretsiz hale getirdi.",
        "content": "Google, Gemini 3.1 Pro'yu tüm kullanıcılar için ücretsiz olarak sundu. SWE-bench %80.6, 1M token context window. MMLU %87.9 skorlarıyla iddialı."
    }),
    ("63d6c887-c54f-4e3e-b850-beadda5d9bd6", {
        "title": "Llama 4 Scout: Meta'nın Açık Kaynak Devrimi",
        "category": "Model",
        "summary": "Meta, Llama 4 Scout'u açık kaynak olarak yayınladı. MoE mimarisi ve 16M token context.",
        "content": "Meta, Llama 4 Scout'u açık kaynak olarak duyurdu. Mixture of Experts mimarisi, 128 uzman, 16M token context window. LMSYS Elo 1421, MMLU %79.6."
    }),
    ("eb90cc62-8cab-4ee3-adf2-bb6d31b6c59e", {
        "title": "Grok 4: xAI'ın En Güçlü Modeli",
        "category": "Model",
        "summary": "xAI, Grok 4'ü X platformuyla entegre şekilde sundu.",
        "content": "xAI, Grok 4 modelini duyurdu. Gerçek zamanlı X verisine erişimiyle dikkat çekiyor. LMSYS Elo 1471, MMLU %87.1, SWE-bench %75.0. Ücretsiz erişim."
    }),
    ("f7468243-c95f-4b26-9e32-c43ccd6e1345", {
        "title": "DeepSeek V4: Açık Kaynak Devrimi",
        "category": "Model",
        "summary": "DeepSeek V4, açık kaynak dünyasında devrim yaraktı. Tamamen ücretsiz.",
        "content": "DeepSeek, V4 modeliyle büyük bir sürpriz yaptı. LMSYS Elo 1452, MMLU %87.1 skorlarıyla açık kaynak modeller arasında en iyilerden. Ücretsiz erişim."
    }),
    ("5ac04e28-b76f-4904-a502-bd24c2aece01", {
        "title": "AI Düzenlemeleri: AB AI Act Yürürlüğe Girdi",
        "category": "Düzenleme",
        "summary": "Avrupa Birliği'nin kapsamlı AI düzenlemesi resmen yürürlükte.",
        "content": "Avrupa Birliği, AI Act'i resmen yürürlüğe koydu. Yüksek riskli AI sistemleri için şeffaflık, güvenlik ve denetim zorunlulukları getirildi."
    }),
    ("9397daff-2d1c-4d04-b76f-d7ee12ebcd07", {
        "title": "Cursor ve Windsurf: AI Kod Editörleri Savaşı",
        "category": "Araçlar",
        "summary": "AI destekli kod editörleri pazarında rekabet kızışıyor.",
        "content": "Cursor, Claude ve GPT entegrasyonuyla öne çıkarken, Windsurf geniş ücretsiz tieri ile dikkat çekiyor."
    }),
]

for aid, data in updates:
    url = f"{BASE}?id=eq.{aid}"
    body = json.dumps(data, ensure_ascii=False).encode('utf-8')
    req = urllib.request.Request(url, data=body, method='PATCH')
    for k, v in headers.items():
        req.add_header(k, v)
    try:
        resp = urllib.request.urlopen(req)
        print(f"✓ {aid[:8]}: {resp.status}")
    except Exception as e:
        print(f"✗ {aid[:8]}: {e}")