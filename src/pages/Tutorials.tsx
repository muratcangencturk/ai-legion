import { useState } from 'react'
import ShareActions from '../components/ShareActions'
import DetailModal from '../components/DetailModal'
import { tutorials } from '../data/tutorials'

export default function Tutorials() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = tutorials.find((tutorial) => tutorial.id === selectedId)

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '30px' }}>📚 Öğretici Yazılar</h2>

      <div className="grid">
        {tutorials.map(tutorial => (
          <article key={tutorial.id} className="card clickable-card">
            <h3 style={{ color: '#d4af37' }}>{tutorial.title}</h3>
            <div style={{ marginBottom: '10px' }}>
              <span className="tool-category">{tutorial.category}</span>
              <span style={{ marginLeft: '10px', color: '#999' }}>⏱️ {tutorial.duration}</span>
            </div>
            <p>{tutorial.summary}</p>
            <div className="card-footer-row">
              <button className="secondary-btn" onClick={() => setSelectedId(tutorial.id)}>Oku</button>
              <ShareActions path={`/tutorials/${tutorial.slug}`} title={tutorial.title} />
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <DetailModal
          title={selected.title}
          content={selected.summary}
          category={selected.category}
          sourceUrl={selected.sourceUrl}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
