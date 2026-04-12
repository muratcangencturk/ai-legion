export interface ModelSpec {
  id: string
  name: string
  provider: string
  openSource: 'Açık Kaynak' | 'Kapalı Kaynak'
  parameters: string
  speed: string
  systemNeeds: string
  strengths: number
  coding: number
  multimodal: number
  pricePerformance: number
}

export const modelSpecs: ModelSpec[] = [
  {
    id: 'gpt',
    name: 'GPT Serisi',
    provider: 'OpenAI',
    openSource: 'Kapalı Kaynak',
    parameters: 'Paylaşılmıyor',
    speed: 'Çok hızlı',
    systemNeeds: 'Bulut API ile kullanılır',
    strengths: 9,
    coding: 9,
    multimodal: 9,
    pricePerformance: 7
  },
  {
    id: 'claude',
    name: 'Claude Serisi',
    provider: 'Anthropic',
    openSource: 'Kapalı Kaynak',
    parameters: 'Paylaşılmıyor',
    speed: 'Hızlı',
    systemNeeds: 'Bulut API ile kullanılır',
    strengths: 9,
    coding: 8,
    multimodal: 8,
    pricePerformance: 7
  },
  {
    id: 'gemini',
    name: 'Gemini Serisi',
    provider: 'Google',
    openSource: 'Kapalı Kaynak',
    parameters: 'Paylaşılmıyor',
    speed: 'Hızlı',
    systemNeeds: 'Bulut API ile kullanılır',
    strengths: 8,
    coding: 8,
    multimodal: 9,
    pricePerformance: 8
  },
  {
    id: 'llama',
    name: 'Llama Serisi',
    provider: 'Meta',
    openSource: 'Açık Kaynak',
    parameters: '8B / 70B / 405B varyantlar',
    speed: 'Donanıma bağlı',
    systemNeeds: 'Yerel GPU veya bulut sunucu',
    strengths: 8,
    coding: 7,
    multimodal: 7,
    pricePerformance: 9
  }
]
