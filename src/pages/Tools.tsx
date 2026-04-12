import { useState, useEffect } from 'react'
import axios from 'axios'
import ShareActions from '../components/ShareActions'
import DetailModal from '../components/DetailModal'
import { modelSpecs } from '../data/models'

interface Tool {
  id: string
  name: string
  category: string
  description: string
  score?: number
  url?: string
  free?: boolean
}

export default function Tools({ apiUrl }: { apiUrl: string }) {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<{ title: string; content: string; category?: string; sourceUrl?: string } | null>(null)

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/tools`)
        setTools(response.data)
      } catch (error) {
        console.error('Araçlar yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTools()
  }, [apiUrl])

  const categories = ['LLM', 'Görüntü', 'Video', 'Müzik', 'Ses', 'Geliştirici', 'Arama', 'Genel']

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '30px' }}>🤖 AI Araçları</h2>

      <div className="section-box" style={{ marginBottom: '28px' }}>
        <h3 style={{ color: '#d4af37', marginBottom: '8px' }}>Model Özellik Kartları</h3>
        <div className="grid">
          {modelSpecs.map((model) => (
            <article key={model.id} className="card">
              <h4 style={{ color: '#d4af37' }}>{model.name}</h4>
              <p><strong>Lisans:</strong> {model.openSource}</p>
              <p><strong>Parametre:</strong> {model.parameters}</p>
              <p><strong>Hız:</strong> {model.speed}</p>
              <p><strong>Sistem:</strong> {model.systemNeeds}</p>
            </article>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Araçlar yükleniyor...</div>
      ) : (
        categories.map(category => {
          const list = tools.filter((t) => t.category === category)
          if (!list.length) return null
          return (
            <section key={category} style={{ marginBottom: '40px' }}>
              <h3 style={{ color: '#d4af37', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d4af37' }}>{category}</h3>
              <div className="grid">
                {list.map(tool => (
                  <article key={tool.id} className="tool-card clickable-card">
                    <h4>{tool.name}</h4>
                    <p>{tool.description}</p>
                    <p style={{ marginTop: '8px', color: '#999' }}>{tool.free ? 'Ücretsiz plan var' : 'Ücretli plan ağırlıklı'}</p>
                    <div className="card-footer-row">
                      <button className="secondary-btn" onClick={() => setSelected({ title: tool.name, content: tool.description, category: tool.category, sourceUrl: tool.url })}>Detaylar</button>
                      <ShareActions path={`/tools/${tool.id}`} title={tool.name} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })
      )}

      {selected && <DetailModal title={selected.title} content={selected.content} category={selected.category} sourceUrl={selected.sourceUrl} onClose={() => setSelected(null)} />}
    </div>
  )
}
