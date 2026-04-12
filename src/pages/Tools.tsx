import { useState, useEffect } from 'react'
import axios from 'axios'
import ShareActions from '../components/ShareActions'
import DetailModal from '../components/DetailModal'
import { modelSpecs } from '../data/models'

type Language = 'tr' | 'en'

interface Tool {
  id: string
  name: string
  category: string
  description: string
  score?: number
  url?: string
  free?: boolean
}

const text = {
  tr: { title: '🤖 AI Araçları', modelCards: 'Model Özellik Kartları', license: 'Lisans', parameters: 'Parametre', speed: 'Token Hızı', system: 'Sistem', loading: 'Araçlar yükleniyor...', free: 'Ücretsiz plan var', paid: 'Ücretli plan ağırlıklı', details: 'Detaylar' },
  en: { title: '🤖 AI Tools', modelCards: 'Model Capability Cards', license: 'License', parameters: 'Parameters', speed: 'Token Speed', system: 'System', loading: 'Loading tools...', free: 'Free plan available', paid: 'Mostly paid plans', details: 'Details' }
}

const categories: Record<Language, string[]> = {
  tr: ['LLM', 'Görüntü', 'Video', 'Müzik', 'Ses', 'Geliştirici', 'Arama', 'Genel'],
  en: ['LLM', 'Image', 'Video', 'Music', 'Audio', 'Developer', 'Search', 'General']
}

const categoryAliases: Record<string, string[]> = {
  LLM: ['LLM'], Görüntü: ['Görüntü', 'Image'], Video: ['Video'], Müzik: ['Müzik', 'Music'], Ses: ['Ses', 'Audio'], Geliştirici: ['Geliştirici', 'Developer'], Arama: ['Arama', 'Search'], Genel: ['Genel', 'General'],
  Image: ['Görüntü', 'Image'], Music: ['Müzik', 'Music'], Audio: ['Ses', 'Audio'], Developer: ['Geliştirici', 'Developer'], Search: ['Arama', 'Search'], General: ['Genel', 'General']
}

export default function Tools({ apiUrl, language }: { apiUrl: string; language: Language }) {
  const t = text[language]
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<{ title: string; content: string; category?: string; sourceUrl?: string } | null>(null)

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/tools`)
        setTools(response.data)
      } catch (error) {
        console.error('Error loading tools:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTools()
  }, [apiUrl])

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '30px' }}>{t.title}</h2>
      <div className="section-box" style={{ marginBottom: '28px' }}>
        <h3 style={{ color: '#d4af37', marginBottom: '8px' }}>{t.modelCards}</h3>
        <div className="grid">{modelSpecs.map((model) => (
          <article key={model.id} className="card">
            <h4 style={{ color: '#d4af37' }}>{model.name}</h4>
            <p><strong>{t.license}:</strong> {model.openSource[language]}</p>
            <p><strong>{t.parameters}:</strong> {model.parameters[language]}</p>
            <p><strong>{t.speed}:</strong> {model.generationSpeed[language]}</p>
            <p><strong>{t.system}:</strong> {model.systemNeeds[language]}</p>
          </article>
        ))}</div>
      </div>
      {loading ? <div className="loading">{t.loading}</div> : categories[language].map(category => {
        const list = tools.filter((tool) => (categoryAliases[category] || [category]).includes(tool.category))
        if (!list.length) return null
        return (
          <section key={category} style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#d4af37', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d4af37' }}>{category}</h3>
            <div className="grid">{list.map(tool => (
              <article key={tool.id} className="tool-card clickable-card">
                <h4>{tool.name}</h4><p>{tool.description}</p><p style={{ marginTop: '8px', color: '#999' }}>{tool.free ? t.free : t.paid}</p>
                <div className="card-footer-row"><button className="secondary-btn" onClick={() => setSelected({ title: tool.name, content: tool.description, category: tool.category, sourceUrl: tool.url })}>{t.details}</button><ShareActions path={`/tools/${tool.id}`} title={tool.name} language={language} /></div>
              </article>
            ))}</div>
          </section>
        )
      })}
      {selected && <DetailModal title={selected.title} content={selected.content} category={selected.category} sourceUrl={selected.sourceUrl} onClose={() => setSelected(null)} language={language} />}
    </div>
  )
}
