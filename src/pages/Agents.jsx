import { Link } from 'react-router-dom'

const agents = [
  {
    title: '语音转 Prompt',
    description: '语音转文字 + Prompt 结构化优化。',
    to: '/agents/voice-to-prompt',
    status: 'Active',
  },
  {
    title: '工作流助手',
    description: '规划任务、梳理执行步骤的模板。',
    to: '/agents',
    status: 'Coming Soon',
  },
  {
    title: '会议速记',
    description: '会议记录结构化与摘要输出。',
    to: '/agents',
    status: 'Coming Soon',
  },
]

function Agents() {
  return (
    <section className="section">
      <div className="section-head">
        <h2>Agents</h2>
        <p>个人工具库与 AI 模块列表。</p>
      </div>
      <div className="card-grid">
        {agents.map((agent) => (
          <article key={agent.title} className="info-card">
            <div className="card-title">
              <h3>{agent.title}</h3>
              <span className={`badge ${agent.status === 'Active' ? 'badge-active' : ''}`}>
                {agent.status}
              </span>
            </div>
            <p>{agent.description}</p>
            {agent.status === 'Active' ? (
              <Link className="ghost-btn" to={agent.to}>
                打开工具
              </Link>
            ) : (
              <span className="muted">规划中</span>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default Agents
