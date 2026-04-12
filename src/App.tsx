import { useEffect, useState } from 'react'
import axios from 'axios'
import Home from './pages/Home'
import Social from './pages/Social'
import Tools from './pages/Tools'
import Tutorials from './pages/Tutorials'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'

const API_URL = 'https://ai-legion-api.muratcangencturk.workers.dev'

const NAV_ITEMS = [
  { key: 'home', label: '📰 Haberler' },
  { key: 'social', label: '💬 Sosyal' },
  { key: 'tools', label: '🤖 Araçlar' },
  { key: 'tutorials', label: '📚 Öğretici' },
  { key: 'profile', label: '👤 Profil' },
  { key: 'admin', label: '⚙️ Admin' }
]

const pageTitles: Record<string, string> = {
  home: 'AI Legion | Güncel AI Haberleri',
  social: 'AI Legion | Sosyal Akış',
  tools: 'AI Legion | AI Araçları',
  tutorials: 'AI Legion | Öğretici İçerikler',
  profile: 'AI Legion | Profil',
  admin: 'AI Legion | Admin Panel'
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState<any>(null)

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

  useEffect(() => {
    document.title = pageTitles[currentPage] || pageTitles.home
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home apiUrl={API_URL} onNavigate={setCurrentPage} />
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
        return <Home apiUrl={API_URL} onNavigate={setCurrentPage} />
    }
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="top-row">
            <h1 className="site-title">🏛️ AI LEGION</h1>
            {user && <span style={{ color: '#d4af37' }}>👤 {user.username}</span>}
          </div>
          <nav className="nav" aria-label="Ana navigasyon">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                className={`nav-link ${currentPage === item.key ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container">{renderPage()}</main>

      <footer className="footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <p>© 2026 AI Legion - Cloudflare Pages + Workers</p>
            <p style={{ fontSize: '0.9em', marginTop: '10px' }}>Workers API: {API_URL}</p>
          </div>
          <a
            href="https://chat.whatsapp.com/LAu2OosQEmd73CBl56sIRi?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '2.2em', cursor: 'pointer', transition: 'transform 0.3s', display: 'inline-block' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
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
