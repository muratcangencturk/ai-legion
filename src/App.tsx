import { useState, useEffect } from 'react'
import axios from 'axios'
import Home from './pages/Home'
import Social from './pages/Social'
import Tools from './pages/Tools'
import Tutorials from './pages/Tutorials'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'

const API_URL = 'https://ai-legion-api.muratcangencturk.workers.dev'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`)
        console.log('✅ Workers API çalışıyor:', response.data)
      } catch (error) {
        console.error('❌ Workers API bağlantı hatası:', error)
      }
    }
    checkHealth()
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home apiUrl={API_URL} />
      case 'social':
        return <Social apiUrl={API_URL} user={user} setUser={setUser} />
      case 'tools':
        return <Tools apiUrl={API_URL} />
      case 'tutorials':
        return <Tutorials />
      case 'profile':
        return <Profile apiUrl={API_URL} user={user} />
      case 'admin':
        return <AdminPanel apiUrl={API_URL} />
      default:
        return <Home apiUrl={API_URL} />
    }
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ color: '#d4af37', fontSize: '1.8em' }}>🏛️ AI LEGION PRO</h1>
            {user && <span style={{ color: '#d4af37' }}>👤 {user.username}</span>}
          </div>
          <nav className="nav">
            <a onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer', color: currentPage === 'home' ? '#0a0a0a' : '#d4af37', background: currentPage === 'home' ? '#d4af37' : 'transparent' }}>
              📰 Haberler
            </a>
            <a onClick={() => setCurrentPage('social')} style={{ cursor: 'pointer', color: currentPage === 'social' ? '#0a0a0a' : '#d4af37', background: currentPage === 'social' ? '#d4af37' : 'transparent' }}>
              💬 Sosyal
            </a>
            <a onClick={() => setCurrentPage('tools')} style={{ cursor: 'pointer', color: currentPage === 'tools' ? '#0a0a0a' : '#d4af37', background: currentPage === 'tools' ? '#d4af37' : 'transparent' }}>
              🤖 Araçlar
            </a>
            <a onClick={() => setCurrentPage('tutorials')} style={{ cursor: 'pointer', color: currentPage === 'tutorials' ? '#0a0a0a' : '#d4af37', background: currentPage === 'tutorials' ? '#d4af37' : 'transparent' }}>
              📚 Öğretici
            </a>
            <a onClick={() => setCurrentPage('profile')} style={{ cursor: 'pointer', color: currentPage === 'profile' ? '#0a0a0a' : '#d4af37', background: currentPage === 'profile' ? '#d4af37' : 'transparent' }}>
              👤 Profil
            </a>
            <a onClick={() => setCurrentPage('admin')} style={{ cursor: 'pointer', color: currentPage === 'admin' ? '#0a0a0a' : '#d4af37', background: currentPage === 'admin' ? '#d4af37' : 'transparent' }}>
              ⚙️ Admin
            </a>
          </nav>
        </div>
      </header>

      <main className="container">
        {renderPage()}
      </main>

      <footer className="footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <p>© 2026 AI Legion Pro - Cloudflare Pages + Workers</p>
            <p style={{ fontSize: '0.9em', marginTop: '10px' }}>Workers API: {API_URL}</p>
          </div>
          <a 
            href="https://chat.whatsapp.com/LAu2OosQEmd73CBl56sIRi?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '2.5em',
              cursor: 'pointer',
              transition: 'transform 0.3s',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="WhatsApp Grubuna Katıl"
          >
            💬
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
