import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles, Clock, Layers, Cpu } from 'lucide-react'
import { languages } from '../data/mockData'
import { generateExplanation } from '../utils/helpers'
import { useToast } from '../components/ui/Toast'
import CodeEditor from '../components/ui/CodeEditor'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

const exampleCode = `async function fetchUserData(userId: string) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}`

export default function CodeExplainer() {
  const [code, setCode] = useState(exampleCode)
  const [language, setLanguage] = useState('TypeScript')
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState<ReturnType<typeof generateExplanation> | null>(null)
  const { toast } = useToast()

  const handleExplain = async () => {
    if (!code.trim()) {
      toast('Please enter code to explain', 'warning')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
    setExplanation(generateExplanation(code, language))
    setLoading(false)
    toast('Code explained!', 'success')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-[#252B36]">
        <div className="flex items-center gap-2 mb-0.5">
          <BookOpen size={16} className="text-[#38BDF8]" />
          <h1 className="text-base font-semibold text-[#F1F5F9]">Code Explainer</h1>
        </div>
        <p className="text-xs text-[#929AAA]">Understand any code with AI-powered explanations</p>
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
              <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Code to Explain</label>
              <CodeEditor
                code={code}
                language={language}
                onChange={setCode}
                onClear={() => setCode('')}
                showClear
                minHeight="300px"
                placeholder="Paste any code snippet you want explained..."
              />
            </div>
            <Button
              onClick={handleExplain}
              loading={loading}
              icon={<Sparkles size={14} />}
              className="w-full"
            >
              {loading ? 'Analyzing...' : 'Explain Code'}
            </Button>
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-[#38BDF8] border-t-transparent rounded-full"
              />
              <p className="text-sm text-[#929AAA]">Reading and analyzing code...</p>
            </div>
          ) : explanation ? (
            <div className="p-4 space-y-4">
              {/* Summary */}
              <div className="bg-[#151922] border border-[#252B36] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#38BDF8]" />
                  <span className="text-xs font-semibold text-[#F1F5F9]">Summary</span>
                </div>
                <p className="text-sm text-[#929AAA] leading-relaxed">{explanation.summary}</p>
              </div>

              {/* Complexity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#151922] border border-[#252B36] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={13} className="text-amber-400" />
                    <span className="text-xs font-semibold text-[#F1F5F9]">Time Complexity</span>
                  </div>
                  <div className="text-xl font-mono font-bold text-amber-400">{explanation.complexity.time}</div>
                </div>
                <div className="bg-[#151922] border border-[#252B36] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu size={13} className="text-[#7C6CFF]" />
                    <span className="text-xs font-semibold text-[#F1F5F9]">Space Complexity</span>
                  </div>
                  <div className="text-xl font-mono font-bold text-[#7C6CFF]">{explanation.complexity.space}</div>
                </div>
              </div>

              {/* Key concepts */}
              <div className="bg-[#151922] border border-[#252B36] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={14} className="text-emerald-400" />
                  <span className="text-xs font-semibold text-[#F1F5F9]">Key Concepts</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {explanation.concepts.map(c => (
                    <Badge key={c} variant="info">{c}</Badge>
                  ))}
                </div>
              </div>

              {/* Line by line */}
              <div className="bg-[#151922] border border-[#252B36] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#252B36]">
                  <span className="text-xs font-semibold text-[#F1F5F9]">Line-by-Line Explanation</span>
                </div>
                <div className="divide-y divide-[#1C2333]">
                  {explanation.lineExplanations.map(line => (
                    <div key={line.line} className="flex gap-3 px-4 py-3 hover:bg-[#1C2333] transition-colors">
                      <span className="text-xs font-mono text-[#929AAA]/60 w-6 flex-shrink-0 pt-0.5">
                        {line.line}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono text-[#38BDF8] mb-1 truncate">{line.code}</div>
                        <div className="text-xs text-[#929AAA]">{line.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center h-full">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <BookOpen size={20} className="text-[#38BDF8]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F1F5F9] mb-1">Explain any code</h3>
              <p className="text-xs text-[#929AAA] max-w-xs">
                Paste code and get a detailed breakdown with complexity analysis and concept explanations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

