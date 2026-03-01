import { Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Agents from './pages/Agents.jsx'
import AiTools from './pages/AiTools.jsx'
import VoiceToPrompt from './pages/agents/VoiceToPrompt.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="agents">
          <Route index element={<Agents />} />
          <Route path="voice-to-prompt" element={<VoiceToPrompt />} />
        </Route>
        <Route path="ai-tools" element={<AiTools />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
