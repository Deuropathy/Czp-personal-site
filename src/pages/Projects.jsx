const projects = [
  {
    title: '项目一',
    description: '一句话介绍你的项目价值与解决的问题。',
    tags: ['产品设计', '前端', 'AI'],
  },
  {
    title: '项目二',
    description: '对外展示的案例说明，可替换为真实项目。',
    tags: ['实验', '工具', '自动化'],
  },
  {
    title: '项目三',
    description: '强调成果、指标或影响力。',
    tags: ['增长', '体验', '数据'],
  },
]

function Projects() {
  return (
    <section className="section">
      <div className="section-head">
        <h2>Projects</h2>
        <p>精选项目与实验，持续更新。</p>
      </div>
      <div className="card-grid">
        {projects.map((project) => (
          <article key={project.title} className="info-card">
            <div className="card-title">
              <h3>{project.title}</h3>
              <span className="tag-row">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </span>
            </div>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects
