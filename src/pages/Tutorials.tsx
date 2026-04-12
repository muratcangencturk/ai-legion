import { useState } from 'react'
import ShareActions from '../components/ShareActions'
import DetailModal from '../components/DetailModal'
import { tutorials } from '../data/tutorials'

type Language = 'tr' | 'en'

const text = {
  tr: { title: '📚 Öğretici Yazılar', read: 'Oku' },
  en: { title: '📚 Tutorial Articles', read: 'Read' }
}

export default function Tutorials({ language }: { language: Language }) {
  const t = text[language]
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = tutorials.find((tutorial) => tutorial.id === selectedId)

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '30px' }}>{t.title}</h2>
      <div className="grid">
        {tutorials.map(tutorial => (
          <article key={tutorial.id} className="card clickable-card">
            <h3 style={{ color: '#d4af37' }}>{tutorial.title[language]}</h3>
            <div style={{ marginBottom: '10px' }}>
              <span className="tool-category">{tutorial.category[language]}</span>
              <span style={{ marginLeft: '10px', color: '#999' }}>⏱️ {tutorial.duration[language]}</span>
            </div>
            <p>{tutorial.summary[language]}</p>
            <div className="card-footer-row">
              <button className="secondary-btn" onClick={() => setSelectedId(tutorial.id)}>{t.read}</button>
              <ShareActions path={`/tutorials/${tutorial.slug}`} title={tutorial.title[language]} language={language} />
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <DetailModal
          title={selected.title[language]}
          content={selected.summary[language]}
          category={selected.category[language]}
          sourceUrl={selected.sourceUrl}
          onClose={() => setSelectedId(null)}
          language={language}
        />
      )}
    </div>
  )
}
