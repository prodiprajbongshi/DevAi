import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Code2, Lightbulb, Download, Copy } from 'lucide-react'
import { languages, frameworks as frameworksMap } from '../data/mockData'
import { generateMockCode, downloadCode } from '../utils/helpers'
import { useClipboard } from '../hooks/useClipboard'
import { useCodeHistory } from '../hooks/useCodeHistory'
import { useToast } from '../components/ui/Toast'
import CodeEditor from '../components/ui/CodeEditor'
import { Button } from '../components/ui/Button'

const examplePrompts = [
  'Create a custom React hook for debounced search',
  'Build a REST API endpoint with authentication',
  'Implement a binary search tree in Python',
  'Create a responsive navigation component',
  'Write a rate limiter middleware for Express',
  'Generate a TypeScript generic utility type',
]

export default function CodeGenerator() {
  const location = useLocation()
  const { toast } = useToast()
  const { copied, copy } = useClipboard()
  const { addItem } = useCodeHistory()

  const [prompt, setPrompt] = useState(location.state?.prompt || '')
  const [language, setLanguage] = useState(location.state?.language || 'TypeScript')
  const [framework, setFramework] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const availableFrameworks = frameworksMap[language as keyof typeof frameworksMap] || []

  useEffect(() => {
    setFramework(availableFrameworks[0] || '')
  }, [language])

  useEffect(() => {
    if (location.state?.prompt) {
      handleGenerate(location.state.prompt)
    }
  }, [])

  const handleGenerate = async (p?: string) => {
    const promptToUse = p || prompt
    if (!promptToUse.trim()) {
      toast('Please enter a prompt', 'warning')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000))
    const generated = generateMockCode(promptToUse, language)
    setCode(generated)
    addItem({
      name: promptToUse.slice(0, 50),
      language,
      taskType: 'Code Generator',
      code: generated,
      prompt: promptToUse,
    })
    setLoading(false)
    toast('Code generated successfully!', 'success')
  }

  const handleCopy = async () => {
    if (!code) return
    await copy(code)
    toast('Code copied!', 'success')
  }

  const handleDownload = () => {
    if (!code) return
    downloadCode(code, `devai-generated`, language)
    toast('Code downloaded!', 'success')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#252B36]">
        <div className="flex items-center gap-2 mb-0.5">
          <Code2 size={16} className="text-[#7C6CFF]" />
          <h1 className="text-base font-semibold text-[#F1F5F9]">Code Generator</h1>
        </div>
        <p className="text-xs text-[#929AAA]">Turn natural language into production-ready code</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left panel */}
        <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-[#252B36] flex flex-col overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Language & Framework */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Language</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF]"
                >
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Framework</label>
                <select
                  value={framework}
                  onChange={e => setFramework(e.target.value)}
                  className="w-full bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF]"
                >
                  <option value="">None</option>
                  {availableFrameworks.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Describe what you want to build</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleGenerate() }}
                placeholder="e.g. Create a React hook for managing form state with validation..."
                rows={5}
                className="w-full bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF] placeholder-[#929AAA]/70 resize-none"
              />
              <p className="text-[10px] text-[#929AAA]/60 mt-1">Ctrl+Enter to generate</p>
            </div>

            <Button
              onClick={() => handleGenerate()}
              loading={loading}
              icon={<Sparkles size={14} />}
              className="w-full"
            >
              {loading ? 'Generating...' : 'Generate Code'}
            </Button>

            {/* Examples */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={12} className="text-[#929AAA]" />
                <span className="text-xs text-[#929AAA] font-medium">Example prompts</span>
              </div>
              <div className="space-y-1.5">
                {examplePrompts.map(ex => (
                  <button
                    key={ex}
                    onClick={() => setPrompt(ex)}
                    className="w-full text-left text-xs text-[#929AAA] hover:text-[#F1F5F9] bg-[#0B0D12] border border-[#252B36] rounded-lg px-3 py-2 hover:border-[#353D4E] transition-all"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Code editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#252B36]">
            <span className="text-xs text-[#929AAA] font-medium">Generated Output</span>
            {code && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#929AAA] hover:text-[#F1F5F9] bg-[#151922] border border-[#252B36] rounded-lg hover:border-[#353D4E] transition-all"
                >
                  <Copy size={12} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#929AAA] hover:text-[#F1F5F9] bg-[#151922] border border-[#252B36] rounded-lg hover:border-[#353D4E] transition-all"
                >
                  <Download size={12} />
                  Download
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-[#7C6CFF] border-t-transparent rounded-full"
                />
                <div className="text-center">
                  <p className="text-sm text-[#F1F5F9] font-medium">Generating code...</p>
                  <p className="text-xs text-[#929AAA] mt-1">Analyzing your prompt and crafting the solution</p>
                </div>
              </div>
            ) : (
              <CodeEditor
                code={code}
                language={language}
                filename={`generated.${language.toLowerCase().slice(0, 2)}`}
                onChange={setCode}
                onClear={() => setCode('')}
                showDownload
                showClear
                minHeight="calc(100vh - 220px)"
                placeholder="Generated code will appear here..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

