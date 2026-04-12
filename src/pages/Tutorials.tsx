export default function Tutorials() {
  const tutorials = [
    { id: 1, title: 'ChatGPT ile Başlangıç', category: 'Başlangıç', duration: '15 min' },
    { id: 2, title: 'Prompt Engineering Rehberi', category: 'İleri', duration: '30 min' },
    { id: 3, title: 'Midjourney ile Görüntü Oluşturma', category: 'Görüntü', duration: '20 min' },
    { id: 4, title: 'Claude ile Kod Yazma', category: 'Kod', duration: '25 min' },
    { id: 5, title: 'AI Etik ve Güvenlik', category: 'Etik', duration: '40 min' },
  ]

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '30px' }}>📚 Öğretici Yazılar</h2>
      
      <div className="grid">
        {tutorials.map(tutorial => (
          <div key={tutorial.id} className="card">
            <h3 style={{ color: '#d4af37' }}>{tutorial.title}</h3>
            <div style={{ marginBottom: '10px' }}>
              <span className="tool-category">{tutorial.category}</span>
              <span style={{ marginLeft: '10px', color: '#999' }}>⏱️ {tutorial.duration}</span>
            </div>
            <p>Bu öğretici yazıda konuyu adım adım öğreneceksiniz.</p>
            <button style={{ marginTop: '15px' }}>Oku →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
