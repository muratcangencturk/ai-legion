import { useState, useEffect } from 'react'
import axios from 'axios'

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
        // Demo veri göster
        setTools([
          { id: '1', name: 'GPT-5.4', category: 'LLM', description: 'OpenAI\'nin en güçlü modeli', score: 9.8 },
          { id: '2', name: 'Claude Opus 4.6', category: 'LLM', description: 'Anthropic\'in gelişmiş modeli', score: 9.7 },
          { id: '3', name: 'Midjourney v7', category: 'Görüntü', description: 'Profesyonel görüntü oluşturma', score: 9.6 },
          { id: '4', name: 'Runway Gen-3', category: 'Video', description: 'Video oluşturma ve düzenleme', score: 9.5 },
          { id: '5', name: 'Suno', category: 'Müzik', description: 'AI müzik oluşturma', score: 9.4 },
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
            <div key={category} style={{ marginBottom: '40px' }}>
              <h3 style={{ color: '#d4af37', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d4af37' }}>
                {category === 'LLM' && '🧠'} {category === 'Görüntü' && '🖼️'} {category === 'Video' && '🎬'} {category === 'Müzik' && '🎵'} {category === 'Genel' && '⚙️'} {category}
              </h3>
              <div className="grid">
                {toolsByCategory[category].map(tool => (
                  <div key={tool.id} className="tool-card">
                    <h4>{tool.name}</h4>
                    {tool.score && (
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ color: '#d4af37' }}>⭐ {tool.score}/10</span>
                      </div>
                    )}
                    <p>{tool.description}</p>
                    <button style={{ marginTop: '10px', fontSize: '0.9em', padding: '8px 12px' }}>
                      Detaylar →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        ))
      )}
    </div>
  )
}
