export interface TutorialItem {
  id: number
  title: string
  category: string
  duration: string
  summary: string
  slug: string
}

export const tutorials: TutorialItem[] = [
  {
    id: 1,
    title: 'GPT ile Üretkenlik Akışı Kurma',
    category: 'Başlangıç',
    duration: '18 dk',
    summary: 'Günlük iş akışında AI kullanımını adım adım anlatan pratik rehber.',
    slug: 'gpt-uretkenlik-akisi'
  },
  {
    id: 2,
    title: 'Modern Prompt Tasarımı',
    category: 'İleri',
    duration: '28 dk',
    summary: 'Rol, bağlam, çıktı şablonu ve değerlendirme teknikleriyle güçlü prompt yazımı.',
    slug: 'modern-prompt-tasarimi'
  },
  {
    id: 3,
    title: 'Görsel Üretimde Stil Kontrolü',
    category: 'Görüntü',
    duration: '22 dk',
    summary: 'Referans, varyasyon ve kalite ayarlarıyla tutarlı görsel sonuçlar alma.',
    slug: 'gorsel-uretim-stil-kontrolu'
  },
  {
    id: 4,
    title: 'Kod Yardımcılarıyla Hızlı Geliştirme',
    category: 'Kod',
    duration: '25 dk',
    summary: 'Kod öneri araçlarıyla güvenli ve sürdürülebilir geliştirme pratiği.',
    slug: 'kod-yardimcilari-hizli-gelistirme'
  },
  {
    id: 5,
    title: 'AI Güvenlik ve Doğrulama Kontrol Listesi',
    category: 'Güvenlik',
    duration: '20 dk',
    summary: 'Halüsinasyon azaltma, kaynak doğrulama ve risk yönetimi için temel checklist.',
    slug: 'ai-guvenlik-dogrulama-kontrol-listesi'
  }
]
