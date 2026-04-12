import { useState, useEffect } from 'react'
import axios from 'axios'
import ShareActions from '../components/ShareActions'

interface Tool {
  id: string
  name: string
  category: string
  description: string
  score?: number
}

export default function Tools({ apiUrl }: { apiUrl: string }) {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/tools`)
        setTools(response.data)
      } catch (error) {
        console.error('Araçlar yüklenirken hata:', error)
        setTools([
          { id: '1', name: 'GPT Serisi', category: 'LLM', description: 'Metin üretimi, kod ve analiz için güçlü yardımcılar.' },
          { id: '2', name: 'Claude Serisi', category: 'LLM', description: 'Uzun içerik ve yapılandırılmış çıktı üretimi için ideal.' },
          { id: '3', name: 'Midjourney', category: 'Görüntü', description: 'Yüksek kaliteli yaratıcı görseller oluşturur.' },
          { id: '4', name: 'Runway', category: 'Video', description: 'Kısa video üretimi ve düzenleme otomasyonları.' },
          { id: '5', name: 'Suno', category: 'Müzik', description: 'Hızlı prototip müzik üretimi.' }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchTools()
  }, [apiUrl])

  const categories = ['LLM', 'Görüntü', 'Video', 'Müzik', 'Genel']
  const toolsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = tools.filter(t => t.category === cat)
    return acc
  }, {} as Record<string, Tool[]>)

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '30px' }}>🤖 AI Araçları</h2>

      {loading ? (
        <div className="loading">Araçlar yükleniyor...</div>
      ) : (
        categories.map(category => (
          toolsByCategory[category].length > 0 && (
            <section key={category} style={{ marginBottom: '40px' }}>
              <h3 style={{ color: '#d4af37', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d4af37' }}>
                {category === 'LLM' && '🧠'} {category === 'Görüntü' && '🖼️'} {category === 'Video' && '🎬'} {category === 'Müzik' && '🎵'} {category === 'Genel' && '⚙️'} {category}
              </h3>
              <div className="grid">
                {toolsByCategory[category].map(tool => (
                  <article key={tool.id} className="tool-card clickable-card">
                    <h4>{tool.name}</h4>
                    {tool.score && (
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ color: '#d4af37' }}>⭐ {tool.score}/10</span>
                      </div>
                    )}
                    <p>{tool.description}</p>
                    <div className="card-footer-row">
                      <button style={{ marginTop: '10px', fontSize: '0.9em', padding: '8px 12px' }}>Detaylar →</button>
                      <ShareActions path={`/tools/${tool.id}`} title={tool.name} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        ))
      )}
    </div>
  )
}
