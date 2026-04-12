export default function Profile({ apiUrl, user }: { apiUrl: string; user: any }) {
  if (!user) {
    return (
      <div className="card">
        <p>Profil görmek için giriş yapmanız gerekir.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="card" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '4em', marginBottom: '10px' }}>👤</div>
        <h2 style={{ color: '#d4af37' }}>{user.username}</h2>
        <p style={{ color: '#999' }}>@{user.username.toLowerCase()}</p>
        <p style={{ marginTop: '10px' }}>Biyografi: Yapay zeka meraklısı</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
          <div>
            <div style={{ color: '#d4af37', fontSize: '1.5em', fontWeight: 'bold' }}>42</div>
            <small>Takipçi</small>
          </div>
          <div>
            <div style={{ color: '#d4af37', fontSize: '1.5em', fontWeight: 'bold' }}>15</div>
            <small>Takip Edilen</small>
          </div>
          <div>
            <div style={{ color: '#d4af37', fontSize: '1.5em', fontWeight: 'bold' }}>128</div>
            <small>Paylaşım</small>
          </div>
        </div>

        <button style={{ marginTop: '20px' }}>Profili Düzenle</button>
      </div>

      <div>
        <h3 style={{ color: '#d4af37', marginBottom: '15px' }}>📝 Son Paylaşımlar</h3>
        <div className="post">
          <div className="post-header">
            <span>{user.username}</span>
            <small>2 saat önce</small>
          </div>
          <div className="post-content">
            AI Legion Pro Cloudflare'de canlı! 🚀
          </div>
          <div className="post-actions">
            <span className="post-action">❤️ 24</span>
            <span className="post-action">🔄 8</span>
            <span className="post-action">💬 3</span>
            <span className="post-action">🔖</span>
          </div>
        </div>
      </div>
    </div>
  )
}
