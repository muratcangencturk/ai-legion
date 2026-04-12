export default function Profile({ user }: { apiUrl: string; user: any }) {
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

        <div style={{ marginTop: '20px', color: '#999' }}>
          Bu profildeki istatistikler canlı veri geldikçe otomatik gösterilir.
        </div>

        <button style={{ marginTop: '20px' }}>Profili Düzenle</button>
      </div>
    </div>
  )
}
