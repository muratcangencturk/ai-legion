export interface ModelSpec {
  id: string
  name: string
  provider: string
  openSource: { tr: string; en: string }
  parameters: { tr: string; en: string }
  speed: { tr: string; en: string }
  systemNeeds: { tr: string; en: string }
  strengths: number
  coding: number
  multimodal: number
  pricePerformance: number
}

export const modelSpecs: ModelSpec[] = [
  {
    id: 'gpt',
    name: 'GPT Series',
    provider: 'OpenAI',
    openSource: { tr: 'Kapalı Kaynak', en: 'Closed Source' },
    parameters: { tr: 'Paylaşılmıyor', en: 'Not disclosed' },
    speed: { tr: 'Çok hızlı', en: 'Very fast' },
    systemNeeds: { tr: 'Bulut API ile kullanılır', en: 'Used through cloud API' },
    strengths: 9,
    coding: 9,
    multimodal: 9,
    pricePerformance: 7
  },
  {
    id: 'claude',
    name: 'Claude Series',
    provider: 'Anthropic',
    openSource: { tr: 'Kapalı Kaynak', en: 'Closed Source' },
    parameters: { tr: 'Paylaşılmıyor', en: 'Not disclosed' },
    speed: { tr: 'Hızlı', en: 'Fast' },
    systemNeeds: { tr: 'Bulut API ile kullanılır', en: 'Used through cloud API' },
    strengths: 9,
    coding: 8,
    multimodal: 8,
    pricePerformance: 7
  },
  {
    id: 'gemini',
    name: 'Gemini Series',
    provider: 'Google',
    openSource: { tr: 'Kapalı Kaynak', en: 'Closed Source' },
    parameters: { tr: 'Paylaşılmıyor', en: 'Not disclosed' },
    speed: { tr: 'Hızlı', en: 'Fast' },
    systemNeeds: { tr: 'Bulut API ile kullanılır', en: 'Used through cloud API' },
    strengths: 8,
    coding: 8,
    multimodal: 9,
    pricePerformance: 8
  },
  {
    id: 'llama',
    name: 'Llama Series',
    provider: 'Meta',
    openSource: { tr: 'Açık Kaynak', en: 'Open Source' },
    parameters: { tr: '8B / 70B / 405B varyantlar', en: '8B / 70B / 405B variants' },
    speed: { tr: 'Donanıma bağlı', en: 'Hardware dependent' },
    systemNeeds: { tr: 'Yerel GPU veya bulut sunucu', en: 'Local GPU or cloud server' },
    strengths: 8,
    coding: 7,
    multimodal: 7,
    pricePerformance: 9
  }
]
