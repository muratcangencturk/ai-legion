import ShareActions from '../components/ShareActions'
import { tutorials } from '../data/tutorials'

export default function Tutorials() {
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
              <button style={{ marginTop: '15px' }}>Oku →</button>
              <ShareActions path={`/tutorials/${tutorial.slug}`} title={tutorial.title} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
