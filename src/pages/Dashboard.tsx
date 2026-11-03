import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, Bell, Code2, Bug, BookOpen, Zap,
  ArrowRight, Sparkles, Clock, ChevronRight, Plus,
  TrendingUp, FileCode, Cpu
} from 'lucide-react'
import { recentActivity, templates, models } from '../data/mockData'
import { languages } from '../utils/helpers'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'

const statusConfig = {
  completed: { label: 'Completed', variant: 'success' as const },
  'in-progress': { label: 'In Progress', variant: 'warning' as const },
  failed: { label: 'Failed', variant: 'error' as const },
}

const quickActions = [
  {
    path: '/generator',
    icon: Code2,
    label: 'Generate Code',
    description: 'Turn natural language into working code',
    color: 'text-[#7C6CFF]',
    bg: 'bg-[#7C6CFF]/10',
    border: 'border-[#7C6CFF]/20',
  },
  {
    path: '/debugger',
    icon: Bug,
    label: 'Debug Code',
    description: 'Find and fix bugs instantly with AI',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    path: '/explainer',
    icon: BookOpen,
    label: 'Explain Code',
    description: 'Understand any code snippet clearly',
    color: 'text-[#38BDF8]',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    path: '/optimizer',
    icon: Zap,
    label: 'Optimize Code',
    description: 'Boost performance with smart refactoring',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
]

const stats = [
  { label: 'Code Generated', value: '1,284', change: '+12%', icon: FileCode },
  { label: 'Bugs Fixed', value: '347', change: '+8%', icon: Bug },
  { label: 'Hours Saved', value: '94h', change: '+23%', icon: Clock },
  { label: 'Tokens Used', value: '2.4M', change: '+5%', icon: Cpu },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [prompt, setPrompt] = useState('')
  const [selectedLang, setSelectedLang] = useState('TypeScript')
  const [selectedModel, setSelectedModel] = useState('devai-pro')
  const [search, setSearch] = useState('')

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast('Please enter a prompt first', 'warning')
      return
    }
    navigate('/generator', { state: { prompt, language: selectedLang } })
  }

  const filteredActivity = recentActivity.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.language.toLowerCase().includes(search.toLowerCase())
  )

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-semibold text-[#F1F5F9]">Welcome back, Prodip </h1>
          <p className="text-sm text-[#929AAA] mt-0.5">Your AI-powered development workspace.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929AAA]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search activity..."
              className="pl-8 pr-4 py-2 text-sm bg-[#151922] border border-[#252B36] rounded-lg text-[#F1F5F9] placeholder-[#929AAA] focus:outline-none focus:ring-1 focus:ring-[#7C6CFF] focus:border-[#7C6CFF] w-48"
            />
          </div>
          <button className="relative p-2 rounded-lg border border-[#252B36] bg-[#151922] text-[#929AAA] hover:text-[#F1F5F9] hover:border-[#353D4E] transition-colors">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#7C6CFF] rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C6CFF] to-[#38BDF8] flex items-center justify-center text-white text-xs font-semibold">
            P
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {stats.map(stat => (
          <motion.div key={stat.label} variants={item}>
            <div className="bg-[#151922] border border-[#252B36] rounded-xl p-4 hover:border-[#353D4E] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={14} className="text-[#929AAA]" />
                <span className="text-[10px] text-emerald-400 font-medium">{stat.change}</span>
              </div>
              <div className="text-xl font-semibold text-[#F1F5F9]">{stat.value}</div>
              <div className="text-xs text-[#929AAA] mt-0.5">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Prompt Box */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-[#151922] border border-[#252B36] rounded-xl overflow-hidden"
      >
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#7C6CFF]" />
            <span className="text-xs font-semibold text-[#7C6CFF] uppercase tracking-wider">AI Assistant</span>
          </div>
          <h2 className="text-lg font-semibold text-[#F1F5F9]">Build smarter. Code faster.</h2>
          <p className="text-sm text-[#929AAA] mt-0.5">Your intelligent coding companion is ready to help.</p>
        </div>
        <div className="p-4">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
            }}
            placeholder="What do you want to build today? e.g. 'Create a React hook for infinite scroll...'"
            rows={3}
            className="w-full bg-[#0B0D12] border border-[#252B36] rounded-lg px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#929AAA]/70 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF] focus:border-[#7C6CFF] resize-none"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedLang}
                onChange={e => setSelectedLang(e.target.value)}
                className="text-xs bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF] cursor-pointer"
              >
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                className="text-xs bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF] cursor-pointer"
              >
                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#929AAA] hidden sm:block">⌘ + Enter to generate</span>
              <Button onClick={handleGenerate} icon={<Sparkles size={14} />}>
                Generate
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={container} initial="hidden" animate="show">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#F1F5F9]">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <motion.div key={action.path} variants={item}>
              <button
                onClick={() => navigate(action.path)}
                className="w-full text-left bg-[#151922] border border-[#252B36] rounded-xl p-4 hover:border-[#353D4E] hover:bg-[#1A2030] transition-all group"
              >
                <div className={`w-8 h-8 rounded-lg ${action.bg} border ${action.border} flex items-center justify-center mb-3`}>
                  <action.icon size={15} className={action.color} />
                </div>
                <div className="text-sm font-semibold text-[#F1F5F9] group-hover:text-white mb-1">{action.label}</div>
                <div className="text-xs text-[#929AAA] leading-relaxed">{action.description}</div>
                <div className={`mt-2 flex items-center gap-1 text-xs ${action.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Open <ArrowRight size={11} />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Recent Activity</h2>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-[#929AAA] hover:text-[#7C6CFF] flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="bg-[#151922] border border-[#252B36] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#252B36]">
                  <th className="text-left text-[10px] text-[#929AAA] uppercase tracking-wider px-4 py-2.5">Project</th>
                  <th className="text-left text-[10px] text-[#929AAA] uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">Language</th>
                  <th className="text-left text-[10px] text-[#929AAA] uppercase tracking-wider px-4 py-2.5 hidden md:table-cell">Type</th>
                  <th className="text-left text-[10px] text-[#929AAA] uppercase tracking-wider px-4 py-2.5 hidden lg:table-cell">Updated</th>
                  <th className="text-left text-[10px] text-[#929AAA] uppercase tracking-wider px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivity.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#1C2333] transition-colors cursor-pointer ${i < filteredActivity.length - 1 ? 'border-b border-[#1C2333]' : ''}`}
                    onClick={() => navigate('/history')}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#7C6CFF]/10 flex items-center justify-center flex-shrink-0">
                          <Code2 size={11} className="text-[#7C6CFF]" />
                        </div>
                        <span className="text-sm text-[#F1F5F9] font-medium truncate max-w-[140px]">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="default">{item.language}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-[#929AAA]">{item.taskType}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-[#929AAA]">{item.lastUpdated}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusConfig[item.status as keyof typeof statusConfig]?.variant}>
                        {statusConfig[item.status as keyof typeof statusConfig]?.label}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filteredActivity.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#929AAA]">
                      No matching activity found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Templates */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Popular Templates</h2>
            <button className="text-xs text-[#929AAA] hover:text-[#7C6CFF] flex items-center gap-1 transition-colors">
              All <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {templates.map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => navigate('/generator', { state: { template: tmpl.name } })}
                className="w-full text-left bg-[#151922] border border-[#252B36] rounded-xl p-3.5 hover:border-[#353D4E] hover:bg-[#1A2030] transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg leading-none mt-0.5">{tmpl.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-[#F1F5F9] group-hover:text-white">{tmpl.name}</span>
                      <Plus size={13} className="text-[#929AAA] group-hover:text-[#7C6CFF] flex-shrink-0 transition-colors" />
                    </div>
                    <p className="text-xs text-[#929AAA] mt-0.5 leading-relaxed">{tmpl.description}</p>
                    <Badge variant="default" className="mt-1.5">{tmpl.language}</Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

