import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, Copy, Check, ArrowRight, Sparkles } from 'lucide-react'
import { languages } from '../data/mockData'
import { generateOptimizedCode } from '../utils/helpers'
import { useClipboard } from '../hooks/useClipboard'
import { useCodeHistory } from '../hooks/useCodeHistory'
import { useToast } from '../components/ui/Toast'
import CodeEditor from '../components/ui/CodeEditor'
import { Button } from '../components/ui/Button'

const slowCode = `function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}`

type Tab = 'original' | 'optimized'

export default function CodeOptimizer() {
  const [code, setCode] = useState(slowCode)
  const [language, setLanguage] = useState('JavaScript')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof generateOptimizedCode> | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('original')
  const { copied, copy } = useClipboard()
  const { addItem } = useCodeHistory()
  const { toast } = useToast()

  const handleOptimize = async () => {
    if (!code.trim()) {
      toast('Please enter code to optimize', 'warning')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000))
    const optimized = generateOptimizedCode(code, language)
    setResult(optimized)
    setActiveTab('optimized')
    addItem({
      name: 'Optimized: ' + code.slice(0, 30),
      language,
      taskType: 'Code Optimizer',
      code: optimized.optimizedCode,
      prompt: 'Optimize this code',
    })
    setLoading(false)
    toast('Code optimized!', 'success')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-[#252B36]">
        <div className="flex items-center gap-2 mb-0.5">
          <Zap size={16} className="text-amber-400" />
          <h1 className="text-base font-semibold text-[#F1F5F9]">Code Optimizer</h1>
        </div>
        <p className="text-xs text-[#929AAA]">Refactor and optimize code for maximum performance</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Input */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[#252B36] flex flex-col overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#929AAA] font-medium">Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF]"
              >
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Code to Optimize</label>
              <CodeEditor
                code={code}
                language={language}
                onChange={setCode}
                onClear={() => setCode('')}
                showClear
                minHeight="280px"
              />
            </div>
            <Button
              onClick={handleOptimize}
              loading={loading}
              icon={<Zap size={14} />}
              className="w-full"
            >
              {loading ? 'Optimizing...' : 'Optimize Code'}
            </Button>
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full"
              />
              <p className="text-sm text-[#929AAA]">Optimizing your code...</p>
            </div>
          ) : result ? (
            <div className="p-4 space-y-4">
              {/* Performance metrics */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span className="text-xs font-semibold text-[#F1F5F9]">Performance Improvements</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {result.improvements.map(imp => (
                    <div key={imp.name} className="bg-[#151922] border border-[#252B36] rounded-xl p-3">
                      <div className="text-[10px] text-[#929AAA] mb-1">{imp.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-400 font-mono">{imp.before}</span>
                        <ArrowRight size={10} className="text-[#929AAA]" />
                        <span className="text-xs text-emerald-400 font-mono">{imp.after}</span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-400 mt-1">{imp.improvement}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Techniques */}
              <div className="bg-[#151922] border border-[#252B36] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={13} className="text-[#7C6CFF]" />
                  <span className="text-xs font-semibold text-[#F1F5F9]">Optimizations Applied</span>
                </div>
                <ul className="space-y-1.5">
                  {result.techniques.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[#929AAA]">
                      <Check size={11} className="text-emerald-400 flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code comparison tabs */}
              <div className="bg-[#151922] border border-[#252B36] rounded-xl overflow-hidden">
                <div className="flex border-b border-[#252B36]">
                  {(['original', 'optimized'] as Tab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-[#F1F5F9] border-b-2 border-[#7C6CFF] -mb-px'
                          : 'text-[#929AAA] hover:text-[#F1F5F9]'
                      }`}
                    >
                      {tab === 'optimized' ? '✨ Optimized' : 'Original'}
                    </button>
                  ))}
                </div>
                <div className="p-3">
                  {activeTab === 'original' ? (
                    <CodeEditor
                      code={code}
                      language={language}
                      readOnly
                      minHeight="200px"
                    />
                  ) : (
                    <>
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={async () => { await copy(result.optimizedCode); toast('Copied!', 'success') }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#929AAA] hover:text-[#F1F5F9] bg-[#0B0D12] border border-[#252B36] rounded-lg transition-all"
                        >
                          {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <CodeEditor
                        code={result.optimizedCode}
                        language={language}
                        readOnly
                        minHeight="200px"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center h-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                <Zap size={20} className="text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-[#F1F5F9] mb-1">Optimize your code</h3>
              <p className="text-xs text-[#929AAA] max-w-xs">
                Paste your code and DevAI will refactor it for better performance, readability, and efficiency.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

