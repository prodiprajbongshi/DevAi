import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import AIChat from './pages/AIChat'
import CodeGenerator from './pages/CodeGenerator'
import CodeDebugger from './pages/CodeDebugger'
import CodeExplainer from './pages/CodeExplainer'
import CodeOptimizer from './pages/CodeOptimizer'
import ProjectIdeas from './pages/ProjectIdeas'
import CodeHistory from './pages/CodeHistory'
import Settings from './pages/Settings'
import { ToastProvider } from './components/ui/Toast'

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<AIChat />} />
            <Route path="generator" element={<CodeGenerator />} />
            <Route path="debugger" element={<CodeDebugger />} />
            <Route path="explainer" element={<CodeExplainer />} />
            <Route path="optimizer" element={<CodeOptimizer />} />
            <Route path="ideas" element={<ProjectIdeas />} />
            <Route path="history" element={<CodeHistory />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

