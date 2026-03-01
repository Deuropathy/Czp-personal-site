const tools = [
  {
    title: '模型与 API',
    description: '常用模型、价格与调用经验整理。',
  },
  {
    title: '效率插件',
    description: '写作、研究与产品体验相关的工具合集。',
  },
  {
    title: '学习资料',
    description: '持续更新的 AI 学习路线与资料库。',
  },
]

function AiTools() {
  return (
    <section className="section">
      <div className="section-head">
        <h2>AI Tools</h2>
        <p>常用 AI 工具与资源收藏。</p>
      </div>
      <div className="card-grid">
        {tools.map((tool) => (
          <article key={tool.title} className="info-card">
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AiTools
