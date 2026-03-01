import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="section">
      <div className="section-head">
        <h2>页面不存在</h2>
        <p>你访问的页面找不到，可以返回首页继续浏览。</p>
      </div>
      <Link className="primary-btn" to="/">
        返回首页
      </Link>
    </section>
  )
}

export default NotFound
