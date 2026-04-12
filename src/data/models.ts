export interface ModelSpec {
  id: string
  name: string
  provider: string
  openSource: { tr: string; en: string }
  parameters: { tr: string; en: string }
  generationSpeed: { tr: string; en: string }
  pricing: { tr: string; en: string }
  systemNeeds: { tr: string; en: string }
  aime: number
  codebench: number
  swebench: number
  elo: number
}

export const modelSpecs: ModelSpec[] = [
  {
    id: 'gpt',
    name: 'GPT-4.1 / o-series',
    provider: 'OpenAI',
    openSource: { tr: 'Kapalı Kaynak', en: 'Closed Source' },
    parameters: { tr: 'Paylaşılmıyor', en: 'Not disclosed' },
    generationSpeed: { tr: '≈95 tok/sn (servis yoğunluğuna göre)', en: '≈95 tok/s (depends on load)' },
    pricing: { tr: 'Pro planlar yaklaşık aylık $20+ ile başlar', en: 'Pro plans start around $20+/mo' },
    systemNeeds: { tr: 'Bulut API ile kullanılır', en: 'Used via cloud API' },
    aime: 9.2,
    codebench: 9.5,
    swebench: 8.9,
    elo: 9.3
  },
  {
    id: 'claude',
    name: 'Claude 3.x / 4',
    provider: 'Anthropic',
    openSource: { tr: 'Kapalı Kaynak', en: 'Closed Source' },
    parameters: { tr: 'Paylaşılmıyor', en: 'Not disclosed' },
    generationSpeed: { tr: '≈80 tok/sn', en: '≈80 tok/s' },
    pricing: { tr: 'Pro planlar yaklaşık aylık $20+ ile başlar', en: 'Pro plans start around $20+/mo' },
    systemNeeds: { tr: 'Bulut API ile kullanılır', en: 'Used via cloud API' },
    aime: 8.8,
    codebench: 9.1,
    swebench: 8.7,
    elo: 9.0
  },
  {
    id: 'gemini',
    name: 'Gemini 2.x',
    provider: 'Google',
    openSource: { tr: 'Kapalı Kaynak', en: 'Closed Source' },
    parameters: { tr: 'Paylaşılmıyor', en: 'Not disclosed' },
    generationSpeed: { tr: '≈92 tok/sn', en: '≈92 tok/s' },
    pricing: { tr: 'Pro planlar yaklaşık aylık $19+ ile başlar', en: 'Pro plans start around $19+/mo' },
    systemNeeds: { tr: 'Bulut API ile kullanılır', en: 'Used via cloud API' },
    aime: 8.9,
    codebench: 8.7,
    swebench: 8.5,
    elo: 8.9
  },
  {
    id: 'llama',
    name: 'Llama 3.x',
    provider: 'Meta',
    openSource: { tr: 'Açık Kaynak', en: 'Open Source' },
    parameters: { tr: '8B / 70B / 405B', en: '8B / 70B / 405B' },
    generationSpeed: { tr: 'Donanıma bağlı, 35-120 tok/sn', en: 'Hardware-dependent, 35-120 tok/s' },
    pricing: { tr: 'Açık model, barındırma maliyeti ayrı', en: 'Open model, hosting cost separate' },
    systemNeeds: { tr: 'Yerel GPU veya bulut sunucu', en: 'Local GPU or cloud server' },
    aime: 8.0,
    codebench: 7.8,
    swebench: 7.6,
    elo: 8.1
  }
]
