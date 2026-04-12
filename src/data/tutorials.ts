export interface TutorialItem {
  id: number
  title: { tr: string; en: string }
  category: { tr: string; en: string }
  duration: { tr: string; en: string }
  summary: { tr: string; en: string }
  slug: string
  sourceUrl?: string
}

export const tutorials: TutorialItem[] = [
  {
    id: 1,
    title: { tr: 'GPT ile Üretkenlik Akışı Kurma', en: 'Building a Productivity Workflow with GPT' },
    category: { tr: 'Başlangıç', en: 'Beginner' },
    duration: { tr: '18 dk', en: '18 min' },
    summary: { tr: 'Günlük iş akışında AI kullanımını adım adım anlatan pratik rehber.', en: 'A practical step-by-step guide for using AI in your daily workflow.' },
    slug: 'gpt-uretkenlik-akisi',
    sourceUrl: 'https://platform.openai.com/docs'
  },
  {
    id: 2,
    title: { tr: 'Modern Prompt Tasarımı', en: 'Modern Prompt Design' },
    category: { tr: 'İleri', en: 'Advanced' },
    duration: { tr: '28 dk', en: '28 min' },
    summary: { tr: 'Rol, bağlam, çıktı şablonu ve değerlendirme teknikleriyle güçlü prompt yazımı.', en: 'Write stronger prompts using role framing, context, output templates, and evaluation techniques.' },
    slug: 'modern-prompt-tasarimi',
    sourceUrl: 'https://www.promptingguide.ai/'
  },
  {
    id: 3,
    title: { tr: 'Görsel Üretimde Stil Kontrolü', en: 'Style Control in Image Generation' },
    category: { tr: 'Görüntü', en: 'Image' },
    duration: { tr: '22 dk', en: '22 min' },
    summary: { tr: 'Referans, varyasyon ve kalite ayarlarıyla tutarlı görsel sonuçlar alma.', en: 'Create consistent visuals with reference inputs, variation methods, and quality settings.' },
    slug: 'gorsel-uretim-stil-kontrolu',
    sourceUrl: 'https://docs.midjourney.com/'
  },
  {
    id: 4,
    title: { tr: 'Kod Yardımcılarıyla Hızlı Geliştirme', en: 'Faster Development with Coding Assistants' },
    category: { tr: 'Kod', en: 'Code' },
    duration: { tr: '25 dk', en: '25 min' },
    summary: { tr: 'Kod öneri araçlarıyla güvenli ve sürdürülebilir geliştirme pratiği.', en: 'A secure and sustainable development workflow with code suggestion tools.' },
    slug: 'kod-yardimcilari-hizli-gelistirme',
    sourceUrl: 'https://docs.github.com/en/copilot'
  },
  {
    id: 5,
    title: { tr: 'AI Güvenlik ve Doğrulama Kontrol Listesi', en: 'AI Safety and Validation Checklist' },
    category: { tr: 'Güvenlik', en: 'Security' },
    duration: { tr: '20 dk', en: '20 min' },
    summary: { tr: 'Halüsinasyon azaltma, kaynak doğrulama ve risk yönetimi için temel checklist.', en: 'A core checklist for reducing hallucinations, verifying sources, and managing risks.' },
    slug: 'ai-guvenlik-dogrulama-kontrol-listesi',
    sourceUrl: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/'
  }
]
