import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, Download, Trash2 } from 'lucide-react'
import { useClipboard } from '../../hooks/useClipboard'
import { downloadCode } from '../../utils/helpers'
import { useToast } from '../ui/Toast'

interface CodeEditorProps {
  code: string
  language?: string
  filename?: string
  readOnly?: boolean
  onChange?: (value: string) => void
  onClear?: () => void
  showDownload?: boolean
  showClear?: boolean
  minHeight?: string
  placeholder?: string
}

const langMap: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  go: 'go',
  rust: 'rust',
  java: 'java',
  'c++': 'cpp',
  'c#': 'csharp',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  bash: 'bash',
  sql: 'sql',
  'html/css': 'html',
}

export default function CodeEditor({
  code,
  language = 'javascript',
  filename,
  readOnly = false,
  onChange,
  onClear,
  showDownload = false,
  showClear = false,
  minHeight = '300px',
  placeholder = 'Your code will appear here...',
}: CodeEditorProps) {
  const { copied, copy } = useClipboard()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const syntaxLang = langMap[language.toLowerCase()] || 'javascript'

  const handleCopy = async () => {
    await copy(code)
    toast('Code copied to clipboard!', 'success')
  }

  const handleDownload = () => {
    const name = filename || `devai-${Date.now()}`
    downloadCode(code, name, language)
    toast('Code downloaded!', 'success')
  }

  return (
    <div className="flex flex-col rounded-xl border border-[#252B36] overflow-hidden bg-[#0D1117]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#252B36] bg-[#151922]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          {filename && (
            <span className="text-xs text-[#929AAA] ml-2 font-mono">{filename}</span>
          )}
          <span className="text-xs text-[#929AAA] px-1.5 py-0.5 rounded bg-[#252B36] ml-1">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!readOnly && onClear && showClear && (
            <button
              onClick={onClear}
              className="p-1.5 text-[#929AAA] hover:text-red-400 rounded hover:bg-[#252B36] transition-colors"
              title="Clear code"
            >
              <Trash2 size={14} />
            </button>
          )}
          {showDownload && code && (
            <button
              onClick={handleDownload}
              className="p-1.5 text-[#929AAA] hover:text-[#38BDF8] rounded hover:bg-[#252B36] transition-colors"
              title="Download code"
            >
              <Download size={14} />
            </button>
          )}
          {code && (
            <button
              onClick={handleCopy}
              className="p-1.5 text-[#929AAA] hover:text-[#F1F5F9] rounded hover:bg-[#252B36] transition-colors"
              title="Copy code"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Code area */}
      <div className="relative flex-1" style={{ minHeight }}>
        {!readOnly && !code ? (
          <textarea
            value={code}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full bg-[#0D1117] text-[#F1F5F9] font-mono text-sm p-4 resize-none focus:outline-none placeholder-[#929AAA]/50"
            style={{ minHeight, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
            spellCheck={false}
          />
        ) : !readOnly && isEditing ? (
          <textarea
            value={code}
            onChange={e => onChange?.(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="w-full h-full bg-[#0D1117] text-[#F1F5F9] font-mono text-sm p-4 resize-none focus:outline-none"
            style={{ minHeight, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
            spellCheck={false}
          />
        ) : code ? (
          <div onClick={() => !readOnly && setIsEditing(true)} className={!readOnly ? 'cursor-text' : ''}>
            <SyntaxHighlighter
              language={syntaxLang}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                background: '#0D1117',
                padding: '16px',
                fontSize: '13px',
                lineHeight: '1.6',
                minHeight,
              }}
              showLineNumbers
              lineNumberStyle={{ color: '#3A4050', minWidth: '2.5em' }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        ) : (
          <div
            onClick={() => !readOnly && setIsEditing(true)}
            className={`flex items-center justify-center text-[#929AAA]/50 text-sm font-mono ${!readOnly ? 'cursor-text' : ''}`}
            style={{ minHeight }}
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}

