import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Plus, MessageSquare, Copy, Check, RefreshCw,
  ChevronDown, Trash2, Bot, User, Code2, Sparkles
} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { chatSuggestions, mockAIResponses, languages } from '../data/mockData'
import { useClipboard } from '../hooks/useClipboard'
import { useToast } from '../components/ui/Toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
}

function parseContent(content: string) {
  const parts: { type: 'text' | 'code'; content: string; language?: string }[] = []
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'code', content: match[2].trim(), language: match[1] || 'javascript' })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) })
  }

  return parts
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const { copied, copy } = useClipboard()
  const { toast } = useToast()

  return (
    <div className="rounded-lg border border-[#252B36] overflow-hidden my-2">
      <div className="flex items-center justify-between px-3 py-2 bg-[#151922] border-b border-[#252B36]">
        <span className="text-xs text-[#929AAA] font-mono">{language}</span>
        <button
          onClick={async () => { await copy(code); toast('Copied!', 'success') }}
          className="p-1 text-[#929AAA] hover:text-[#F1F5F9] rounded transition-colors"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, background: '#0D1117', padding: '12px 16px', fontSize: '12px', lineHeight: '1.6' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

function MessageBubble({ message, onRegenerate }: { message: Message; onRegenerate?: () => void }) {
  const isUser = message.role === 'user'
  const parts = parseContent(message.content)
  const { copy } = useClipboard()
  const { toast } = useToast()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
        isUser ? 'bg-gradient-to-br from-[#7C6CFF] to-[#38BDF8]' : 'bg-[#7C6CFF]/15 border border-[#7C6CFF]/30'
      }`}>
        {isUser ? <User size={13} className="text-white" /> : <Bot size={13} className="text-[#7C6CFF]" />}
      </div>
      <div className={`flex-1 min-w-0 max-w-[85%] ${isUser ? 'items-end flex flex-col' : ''}`}>
        <div className={`rounded-xl px-4 py-3 ${
          isUser
            ? 'bg-[#7C6CFF] text-white'
            : 'bg-[#151922] border border-[#252B36] text-[#F1F5F9]'
        }`}>
          {parts.map((part, i) => (
            <div key={i}>
              {part.type === 'text' ? (
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {part.content.split('**').map((seg, j) =>
                    j % 2 === 1 ? <strong key={j} className="font-semibold">{seg}</strong> : <span key={j}>{seg}</span>
                  )}
                </div>
              ) : (
                <CodeBlock code={part.content} language={part.language || 'javascript'} />
              )}
            </div>
          ))}
        </div>
        {!isUser && (
          <div className="flex items-center gap-2 mt-1.5 px-1">
            <button
              onClick={() => { copy(message.content); toast('Copied!', 'success') }}
              className="p-1 text-[#929AAA] hover:text-[#F1F5F9] rounded transition-colors"
            >
              <Copy size={12} />
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1 text-[#929AAA] hover:text-[#F1F5F9] rounded transition-colors"
              >
                <RefreshCw size={12} />
              </button>
            )}
            <span className="text-[10px] text-[#929AAA]">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const initialConversations: Conversation[] = [
  {
    id: '1',
    title: 'React Auth Hook',
    timestamp: new Date(Date.now() - 3600000),
    messages: [
      { id: '1', role: 'user', content: 'How do I create a custom auth hook in React?', timestamp: new Date(Date.now() - 3600000) },
      { id: '2', role: 'assistant', content: mockAIResponses.default, timestamp: new Date(Date.now() - 3590000) },
    ],
  },
  {
    id: '2',
    title: 'Python Data Analysis',
    timestamp: new Date(Date.now() - 86400000),
    messages: [
      { id: '1', role: 'user', content: 'Help me analyze CSV data with pandas', timestamp: new Date(Date.now() - 86400000) },
    ],
  },
]

export default function AIChat() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeId, setActiveId] = useState('1')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedLang, setSelectedLang] = useState('TypeScript')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const activeConv = conversations.find(c => c.id === activeId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages])

  const newConversation = () => {
    const id = Date.now().toString()
    setConversations(prev => [{
      id,
      title: 'New Chat',
      messages: [],
      timestamp: new Date(),
    }, ...prev])
    setActiveId(id)
  }

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeId === id) {
      setActiveId(conversations.find(c => c.id !== id)?.id || '')
    }
    toast('Conversation deleted', 'success')
  }

  const sendMessage = async (content: string = input) => {
    if (!content.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setConversations(prev => prev.map(c =>
      c.id === activeId
        ? {
            ...c,
            title: c.messages.length === 0 ? content.slice(0, 40) : c.title,
            messages: [...c.messages, userMsg],
          }
        : c
    ))
    setInput('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: mockAIResponses.default,
      timestamp: new Date(),
    }

    setConversations(prev => prev.map(c =>
      c.id === activeId ? { ...c, messages: [...c.messages, aiMsg] } : c
    ))
    setLoading(false)
  }

  const regenerate = () => {
    if (!activeConv) return
    const lastUserMsg = [...activeConv.messages].reverse().find(m => m.role === 'user')
    if (lastUserMsg) {
      setConversations(prev => prev.map(c =>
        c.id === activeId
          ? { ...c, messages: c.messages.filter(m => m.role !== 'assistant' || c.messages.indexOf(m) < c.messages.length - 1) }
          : c
      ))
      sendMessage(lastUserMsg.content)
    }
  }

  return (
    <div className="flex h-[calc(100vh-0px)] md:h-screen">
      {/* Chat History Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-r border-[#252B36] bg-[#10131A] flex flex-col overflow-hidden flex-shrink-0"
          >
            <div className="p-3 border-b border-[#252B36]">
              <button
                onClick={newConversation}
                className="w-full flex items-center gap-2 px-3 py-2 bg-[#7C6CFF] text-white text-sm font-medium rounded-lg hover:bg-[#6C5CFF] transition-colors"
              >
                <Plus size={14} />
                New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {conversations.map(conv => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    conv.id === activeId ? 'bg-[#1C2333] text-[#F1F5F9]' : 'text-[#929AAA] hover:bg-[#151922] hover:text-[#F1F5F9]'
                  }`}
                  onClick={() => setActiveId(conv.id)}
                >
                  <MessageSquare size={13} className="flex-shrink-0" />
                  <span className="text-xs flex-1 truncate">{conv.title}</span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteConversation(conv.id) }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0D12]">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#252B36] bg-[#10131A]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(p => !p)}
              className="p-1.5 text-[#929AAA] hover:text-[#F1F5F9] rounded hover:bg-[#1C2333] transition-colors"
            >
              <MessageSquare size={15} />
            </button>
            <span className="text-sm font-medium text-[#F1F5F9]">
              {activeConv?.title || 'AI Chat'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              className="text-xs bg-[#151922] border border-[#252B36] text-[#F1F5F9] rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#151922] rounded-lg border border-[#252B36]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-[#929AAA]">DevAI Pro</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {!activeConv || activeConv.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="w-12 h-12 rounded-2xl bg-[#7C6CFF]/10 border border-[#7C6CFF]/20 flex items-center justify-center mb-4">
                <Bot size={22} className="text-[#7C6CFF]" />
              </div>
              <h2 className="text-lg font-semibold text-[#F1F5F9] mb-1">How can I help you?</h2>
              <p className="text-sm text-[#929AAA] mb-6 text-center max-w-sm">
                Ask me anything about code — I can generate, debug, explain, and optimize.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {chatSuggestions.slice(0, 4).map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-xs text-[#929AAA] bg-[#151922] border border-[#252B36] rounded-lg px-3 py-2.5 hover:border-[#353D4E] hover:text-[#F1F5F9] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 space-y-6 max-w-3xl mx-auto">
              {activeConv.messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onRegenerate={i === activeConv.messages.length - 1 && msg.role === 'assistant' ? regenerate : undefined}
                />
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#7C6CFF]/15 border border-[#7C6CFF]/30 flex items-center justify-center">
                    <Bot size={13} className="text-[#7C6CFF]" />
                  </div>
                  <div className="bg-[#151922] border border-[#252B36] rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#7C6CFF]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input composer */}
        <div className="px-4 py-4 border-t border-[#252B36] bg-[#10131A]">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-[#151922] border border-[#252B36] rounded-xl p-3 focus-within:border-[#7C6CFF]/50 transition-colors">
              <Code2 size={16} className="text-[#929AAA] mb-1 flex-shrink-0" />
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Ask about code... (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#F1F5F9] placeholder-[#929AAA]/70 focus:outline-none resize-none max-h-36 overflow-y-auto"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="p-2 bg-[#7C6CFF] text-white rounded-lg hover:bg-[#6C5CFF] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[10px] text-[#929AAA]/60 text-center mt-2">
              DevAI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

