import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Search, Filter, Trash2, Copy, Check, Eye, X, Code2 } from 'lucide-react'
import { useCodeHistory } from '../hooks/useCodeHistory'
import { formatRelativeTime } from '../utils/helpers'
import { useClipboard } from '../hooks/useClipboard'
import { useToast } from '../components/ui/Toast'
import { Badge } from '../components/ui/Badge'
import CodeEditor from '../components/ui/CodeEditor'

const taskTypes = ['All', 'Code Generator', 'Code Debugger', 'Code Explainer', 'Code Optimizer']
const langOptions = ['All', 'JavaScript', 'TypeScript', 'Python', 'PHP', 'Go', 'Java', 'Ruby']

const taskVariant = {
  'Code Generator': 'purple' as const,
  'Code Debugger': 'error' as const,
  'Code Explainer': 'info' as const,
  'Code Optimizer': 'warning' as const,
}

export default function CodeHistory() {
  const { history, deleteItem, clearAll } = useCodeHistory()
  const [search, setSearch] = useState('')
  const [taskFilter, setTaskFilter] = useState('All')
  const [langFilter, setLangFilter] = useState('All')
  const [preview, setPreview] = useState<string | null>(null)
  const { copied, copy } = useClipboard()
  const { toast } = useToast()

  const filtered = useMemo(() => history.filter(item => {
    const matchSearch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.prompt.toLowerCase().includes(search.toLowerCase())
    const matchTask = taskFilter === 'All' || item.taskType === taskFilter
    const matchLang = langFilter === 'All' || item.language === langFilter
    return matchSearch && matchTask && matchLang
  }), [history, search, taskFilter, langFilter])

  const previewItem = preview ? history.find(h => h.id === preview) : null

  const handleDelete = (id: string) => {
    deleteItem(id)
    if (preview === id) setPreview(null)
    toast('Deleted from history', 'success')
  }

  const handleClearAll = () => {
    clearAll()
    setPreview(null)
    toast('History cleared', 'success')
  }

  return (
    <>
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <History size={16} className="text-[#929AAA]" />
              <h1 className="text-base font-semibold text-[#F1F5F9]">Code History</h1>
            </div>
            <p className="text-xs text-[#929AAA]">{history.length} items in history</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <Trash2 size={12} />
              Clear All
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929AAA]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search history..."
              className="pl-8 pr-4 py-2 text-sm bg-[#151922] border border-[#252B36] rounded-lg text-[#F1F5F9] placeholder-[#929AAA] focus:outline-none focus:ring-1 focus:ring-[#7C6CFF] w-56"
            />
          </div>
          <select
            value={taskFilter}
            onChange={e => setTaskFilter(e.target.value)}
            className="bg-[#151922] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF]"
          >
            {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={langFilter}
            onChange={e => setLangFilter(e.target.value)}
            className="bg-[#151922] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF]"
          >
            {langOptions.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <History size={32} className="text-[#252B36] mx-auto mb-3" />
            <p className="text-sm text-[#929AAA]">
              {history.length === 0 ? 'No history yet. Start generating some code!' : 'No items match your filters'}
            </p>
          </div>
        ) : (
          <div className="bg-[#151922] border border-[#252B36] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#252B36]">
                  <th className="text-left text-[10px] text-[#929AAA] uppercase tracking-wider px-4 py-2.5">Name</th>
                  <th className="text-left text-[10px] text-[#929AAA] uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">Language</th>
                  <th className="text-left text-[10px] text-[#929AAA] uppercase tracking-wider px-4 py-2.5 hidden md:table-cell">Type</th>
                  <th className="text-left text-[10px] text-[#929AAA] uppercase tracking-wider px-4 py-2.5 hidden lg:table-cell">Created</th>
                  <th className="text-right text-[10px] text-[#929AAA] uppercase tracking-wider px-4 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`hover:bg-[#1C2333] transition-colors ${i < filtered.length - 1 ? 'border-b border-[#1C2333]' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#7C6CFF]/10 flex items-center justify-center flex-shrink-0">
                            <Code2 size={11} className="text-[#7C6CFF]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm text-[#F1F5F9] font-medium truncate max-w-[180px]">{item.name}</div>
                            <div className="text-[10px] text-[#929AAA] truncate max-w-[180px]">{item.prompt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant="default">{item.language}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge variant={taskVariant[item.taskType as keyof typeof taskVariant] || 'default'}>
                          {item.taskType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-[#929AAA]">{formatRelativeTime(item.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => setPreview(item.id)}
                            className="p-1.5 text-[#929AAA] hover:text-[#38BDF8] rounded hover:bg-[#252B36] transition-colors"
                            title="Preview"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={async () => { await copy(item.code); toast('Code copied!', 'success') }}
                            className="p-1.5 text-[#929AAA] hover:text-[#F1F5F9] rounded hover:bg-[#252B36] transition-colors"
                            title="Copy code"
                          >
                            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-[#929AAA] hover:text-red-400 rounded hover:bg-[#252B36] transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#151922] border border-[#252B36] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#252B36]">
                <div>
                  <div className="text-sm font-semibold text-[#F1F5F9]">{previewItem.name}</div>
                  <div className="text-xs text-[#929AAA] mt-0.5">{previewItem.prompt}</div>
                </div>
                <button onClick={() => setPreview(null)} className="p-1.5 text-[#929AAA] hover:text-[#F1F5F9] rounded-lg hover:bg-[#252B36] transition-colors">
                  <X size={15} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <CodeEditor
                  code={previewItem.code}
                  language={previewItem.language}
                  readOnly
                  minHeight="300px"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

