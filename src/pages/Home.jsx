import { Link } from 'react-router-dom'

const highlights = [
  {
    title: '产品与体验',
    description: '从 0 到 1 的体验设计与前端工程化落地。',
  },
  {
    title: 'AI 应用探索',
    description: '关注可落地的 AI 工具与团队协作效率。',
  },
  {
    title: '长期主义',
    description: '持续打磨个人作品、开源项目与工具集。',
  },
]

const entryCards = [
  {
    title: 'Projects',
    description: '项目案例、产品实验与技术实现。',
    to: '/projects',
  },
  {
    title: 'Agents',
    description: '日常使用的 AI 小工具与自动化模块。',
    to: '/agents',
  },
  {
    title: 'AI Tools',
    description: '常用模型、插件、资料与评测整理。',
    to: '/ai-tools',
  },
]

function Home() {
  return (
    <section className="hero">
      <div className="hero-main">
        <p className="hero-label">Designer / Builder / Explorer</p>
        <h2>你好，我是你的名字。</h2>
        <p className="hero-subtitle">
          我专注于 AI 体验、工具构建与个人生产力系统。这里汇集了我的项目、实验，以及正在持续打磨的智能工具。
        </p>
        <div className="hero-actions">
          <Link className="primary-btn" to="/projects">
            查看项目
          </Link>
          <Link className="ghost-btn" to="/agents">
            进入工具
          </Link>
        </div>
      </div>

      <div className="hero-grid">
        {highlights.map((item) => (
          <article key={item.title} className="info-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>

      <div className="section-head">
        <h3>快速入口</h3>
        <p>四大板块入口，继续扩展你的内容矩阵。</p>
      </div>
      <div className="card-grid">
        {entryCards.map((card) => (
          <Link key={card.title} to={card.to} className="nav-card">
            <div>
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </div>
            <span className="card-arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Home
