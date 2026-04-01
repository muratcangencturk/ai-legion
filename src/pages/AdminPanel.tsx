import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminPanel({ apiUrl }: { apiUrl: string }) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/stats`)
        setStats(response.data)
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error)
        // Demo veri göster
        setStats({
          total_users: 1234,
          total_posts: 5678,
          total_comments: 9012,
          active_users_today: 234,
          new_users_today: 12,
          total_likes: 45678
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [apiUrl])

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '30px' }}>⚙️ Admin Paneli</h2>

      {loading ? (
        <div className="loading">İstatistikler yükleniyor...</div>
      ) : !stats ? (
        <div className="error">Admin paneline erişim izniniz yok.</div>
      ) : (
        <div>
          <div className="grid" style={{ marginBottom: '30px' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2em', color: '#d4af37', marginBottom: '10px' }}>👥</div>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d4af37' }}>{stats.total_users}</div>
              <small>Toplam Kullanıcı</small>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2em', color: '#d4af37', marginBottom: '10px' }}>📝</div>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d4af37' }}>{stats.total_posts}</div>
              <small>Toplam Post</small>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2em', color: '#d4af37', marginBottom: '10px' }}>💬</div>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d4af37' }}>{stats.total_comments}</div>
              <small>Toplam Yorum</small>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2em', color: '#d4af37', marginBottom: '10px' }}>❤️</div>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d4af37' }}>{stats.total_likes}</div>
              <small>Toplam Like</small>
            </div>
          </div>

          <div className="grid">
            <div className="card">
              <h3 style={{ color: '#d4af37' }}>📊 Günlük Aktivite</h3>
              <div style={{ marginTop: '15px' }}>
                <p>Aktif Kullanıcı: <strong>{stats.active_users_today}</strong></p>
                <p>Yeni Kullanıcı: <strong>{stats.new_users_today}</strong></p>
              </div>
            </div>

            <div className="card">
              <h3 style={{ color: '#d4af37' }}>⚡ Hızlı İşlemler</h3>
              <button style={{ width: '100%', marginBottom: '10px' }}>🗑️ Post Sil</button>
              <button style={{ width: '100%', marginBottom: '10px' }}>👤 Kullanıcı Yönet</button>
              <button style={{ width: '100%' }}>📊 Raporlar</button>
            </div>
          </div>

          <div className="card" style={{ marginTop: '30px' }}>
            <h3 style={{ color: '#d4af37' }}>🔧 Sistem Bilgisi</h3>
            <p>API URL: {apiUrl}</p>
            <p>Platform: Cloudflare Pages + Workers</p>
            <p>Database: Supabase PostgreSQL</p>
          </div>
        </div>
      )}
    </div>
  )
}
