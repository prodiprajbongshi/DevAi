import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bug, AlertCircle, Sparkles, Check, Copy, Wrench } from 'lucide-react'
import { languages } from '../data/mockData'
import { generateFixedCode } from '../utils/helpers'
import { useClipboard } from '../hooks/useClipboard'
import { useCodeHistory } from '../hooks/useCodeHistory'
import { useToast } from '../components/ui/Toast'
import CodeEditor from '../components/ui/CodeEditor'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

const buggyExample = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}`

const errorExample = `TypeError: Cannot read properties of undefined (reading 'price')
  at calculateTotal (app.js:4:22)
  at processOrder (app.js:28:15)`

export default function CodeDebugger() {
  const [code, setCode] = useState(buggyExample)
  const [errorMsg, setErrorMsg] = useState(errorExample)
  const [language, setLanguage] = useState('JavaScript')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | { fixedCode: string; explanation: string; issues: string[] }>(null)
  const { copied, copy } = useClipboard()
  const { addItem } = useCodeHistory()
  const { toast } = useToast()

  const handleDebug = async () => {
    if (!code.trim()) {
      toast('Please enter code to debug', 'warning')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000))

    const fixed = generateFixedCode(code, language, errorMsg)
    setResult({
      fixedCode: fixed,
      explanation: `**Root Cause Analysis:**\n\nThe bug is in the loop condition on line 3. Using \`i <= items.length\` causes an off-by-one error — when \`i\` equals \`items.length\`, \`items[i]\` is \`undefined\`, leading to the TypeError when accessing \`.price\`.\n\n**Fix Applied:**\n- Changed \`i <= items.length\` to \`i < items.length\`\n- Added null/undefined checks for safety\n- Added input validation`,
      issues: [
        'Off-by-one error in loop condition (i <= length should be i < length)',
        'No null check for items parameter',
        'No validation for item.price and item.quantity',
        'Missing error handling for edge cases',
      ],
    })
    addItem({
      name: 'Debug: ' + code.slice(0, 30),
      language,
      taskType: 'Code Debugger',
      code: fixed,
      prompt: errorMsg || 'Debug this code',
    })
    setLoading(false)
    toast('Bugs detected and fixed!', 'success')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-[#252B36]">
        <div className="flex items-center gap-2 mb-0.5">
          <Bug size={16} className="text-red-400" />
          <h1 className="text-base font-semibold text-[#F1F5F9]">Code Debugger</h1>
        </div>
        <p className="text-xs text-[#929AAA]">Paste your buggy code and AI will find and fix the issues</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Input panel */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[#252B36] flex flex-col overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#929AAA] font-medium">Programming Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF]"
              >
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Buggy Code</label>
              <CodeEditor
                code={code}
                language={language}
                onChange={setCode}
                onClear={() => setCode('')}
                showClear
                minHeight="200px"
                placeholder="Paste your buggy code here..."
              />
            </div>

            <div>
              <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Error Message (optional)</label>
              <textarea
                value={errorMsg}
                onChange={e => setErrorMsg(e.target.value)}
                placeholder="Paste the error message or stack trace..."
                rows={4}
                className="w-full bg-[#0B0D12] border border-red-500/20 text-red-300 text-xs font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-red-500/50 placeholder-[#929AAA]/50 resize-none"
              />
            </div>

            <Button
              onClick={handleDebug}
              loading={loading}
              icon={<Wrench size={14} />}
              className="w-full"
            >
              {loading ? 'Analyzing...' : 'Debug Code'}
            </Button>
          </div>
        </div>

        {/* Output panel */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full"
              />
              <p className="text-sm text-[#929AAA]">Analyzing code for bugs...</p>
            </div>
          ) : result ? (
            <div className="p-4 space-y-4">
              {/* Issues found */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={14} className="text-red-400" />
                  <span className="text-sm font-semibold text-red-400">Issues Detected ({result.issues.length})</span>
                </div>
                <ul className="space-y-1.5">
                  {result.issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#929AAA]">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">#{i + 1}</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explanation */}
              <div className="bg-[#151922] border border-[#252B36] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#7C6CFF]" />
                  <span className="text-xs font-semibold text-[#F1F5F9]">AI Explanation</span>
                </div>
                <div className="text-xs text-[#929AAA] leading-relaxed whitespace-pre-line">
                  {result.explanation.split('**').map((seg, i) =>
                    i % 2 === 1 ? <strong key={i} className="text-[#F1F5F9]">{seg}</strong> : <span key={i}>{seg}</span>
                  )}
                </div>
              </div>

              {/* Fixed code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">Fixed Code</span>
                  </div>
                  <button
                    onClick={async () => { await copy(result.fixedCode); toast('Copied!', 'success') }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#929AAA] hover:text-[#F1F5F9] bg-[#151922] border border-[#252B36] rounded-lg transition-all"
                  >
                    {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <CodeEditor
                  code={result.fixedCode}
                  language={language}
                  readOnly
                  minHeight="200px"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <Bug size={20} className="text-red-400" />
              </div>
              <h3 className="text-sm font-semibold text-[#F1F5F9] mb-1">Debug your code</h3>
              <p className="text-xs text-[#929AAA] max-w-xs">
                Paste your buggy code and optionally include the error message. DevAI will analyze and fix it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

