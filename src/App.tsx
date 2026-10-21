import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SentryBlogPost from './pages/BlogPost'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Dashboard" element={<Dashboard/>} />
      <Route path="/Blog" element={<SentryBlogPost/>} />
    </Routes>
  )
}

export default App