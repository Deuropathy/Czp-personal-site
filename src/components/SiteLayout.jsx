import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { label: 'About', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Agents', to: '/agents' },
  { label: 'AI Tools', to: '/ai-tools' },
]

function SiteLayout() {
  return (
    <div className="site">
      <header className="site-header">
        <div className="brand-block">
          <span className="brand-mark" />
          <div>
            <p className="brand-eyebrow">Personal Site</p>
            <h1>你的名字</h1>
          </div>
        </div>
        <nav className="site-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div>
          <span className="footer-title">联系</span>
          <span>hello@yourdomain.com</span>
        </div>
        <div>
          <span className="footer-title">社交</span>
          <span>GitHub / X / LinkedIn</span>
        </div>
        <div>
          <span className="footer-title">位置</span>
          <span>Shanghai, China</span>
        </div>
      </footer>
    </div>
  )
}

export default SiteLayout
