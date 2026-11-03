import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Search, Filter, TrendingUp, X, ChevronRight, Globe, Brain, Smartphone, Server, BarChart2 } from 'lucide-react'
import { projectIdeas } from '../data/mockData'
import { Badge } from '../components/ui/Badge'

const categories = [
  { id: 'all', label: 'All', icon: Filter },
  { id: 'Web Development', label: 'Web Dev', icon: Globe },
  { id: 'AI & Machine Learning', label: 'AI / ML', icon: Brain },
  { id: 'Mobile Applications', label: 'Mobile', icon: Smartphone },
  { id: 'Backend Development', label: 'Backend', icon: Server },
  { id: 'Data Science', label: 'Data Science', icon: BarChart2 },
]

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

const difficultyVariant = {
  Beginner: 'success' as const,
  Intermediate: 'warning' as const,
  Advanced: 'error' as const,
}

type IdeaDetails = typeof projectIdeas[number] | null

function IdeaCard({ idea, onClick }: { idea: typeof projectIdeas[number]; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-[#151922] border border-[#252B36] rounded-xl p-4 hover:border-[#353D4E] hover:bg-[#1A2030] transition-all group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-[#F1F5F9] group-hover:text-white leading-tight">
          {idea.title}
        </h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {idea.trending && (
            <Badge variant="purple">
              <TrendingUp size={10} className="mr-0.5" />
              Trending
            </Badge>
          )}
        </div>
      </div>
      <p className="text-xs text-[#929AAA] leading-relaxed mb-3">{idea.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={difficultyVariant[idea.difficulty as keyof typeof difficultyVariant]}>
            {idea.difficulty}
          </Badge>
          <Badge variant="default">{idea.category}</Badge>
        </div>
        <button className="text-xs text-[#929AAA] hover:text-[#7C6CFF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          Details <ChevronRight size={11} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {idea.technologies.slice(0, 3).map(tech => (
          <span key={tech} className="text-[10px] text-[#929AAA] bg-[#0B0D12] border border-[#252B36] rounded px-1.5 py-0.5 font-mono">
            {tech}
          </span>
        ))}
        {idea.technologies.length > 3 && (
          <span className="text-[10px] text-[#929AAA]">+{idea.technologies.length - 3}</span>
        )}
      </div>
    </motion.div>
  )
}

function DetailModal({ idea, onClose }: { idea: NonNullable<IdeaDetails>; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#151922] border border-[#252B36] rounded-2xl p-6 max-w-lg w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {idea.trending && <Badge variant="purple"><TrendingUp size={10} className="mr-0.5" /> Trending</Badge>}
              <Badge variant={difficultyVariant[idea.difficulty as keyof typeof difficultyVariant]}>{idea.difficulty}</Badge>
            </div>
            <h2 className="text-base font-semibold text-[#F1F5F9]">{idea.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#929AAA] hover:text-[#F1F5F9] rounded-lg hover:bg-[#252B36] transition-colors">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-[#929AAA] leading-relaxed mb-4">{idea.description}</p>
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-[#F1F5F9] mb-2">Technology Stack</h4>
          <div className="flex flex-wrap gap-2">
            {idea.technologies.map(tech => (
              <span key={tech} className="text-xs text-[#38BDF8] bg-blue-500/10 border border-blue-500/20 rounded-lg px-2.5 py-1 font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-[#F1F5F9] mb-2">Category</h4>
          <Badge variant="default">{idea.category}</Badge>
        </div>
        <div className="pt-4 border-t border-[#252B36] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm text-[#929AAA] bg-[#0B0D12] border border-[#252B36] rounded-lg hover:text-[#F1F5F9] transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm text-white bg-[#7C6CFF] rounded-lg hover:bg-[#6C5CFF] transition-colors"
          >
            Start Building
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProjectIdeas() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState('All')
  const [selected, setSelected] = useState<IdeaDetails>(null)

  const filtered = useMemo(() => projectIdeas.filter(idea => {
    const matchSearch = !search || idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.description.toLowerCase().includes(search.toLowerCase()) ||
      idea.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchCat = category === 'all' || idea.category === category
    const matchDiff = difficulty === 'All' || idea.difficulty === difficulty
    return matchSearch && matchCat && matchDiff
  }), [search, category, difficulty])

  return (
    <>
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb size={16} className="text-amber-400" />
            <h1 className="text-base font-semibold text-[#F1F5F9]">Project Ideas</h1>
          </div>
          <p className="text-xs text-[#929AAA]">Discover {projectIdeas.length} curated project ideas to build and learn</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929AAA]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ideas, technologies..."
              className="w-full pl-8 pr-4 py-2 text-sm bg-[#151922] border border-[#252B36] rounded-lg text-[#F1F5F9] placeholder-[#929AAA] focus:outline-none focus:ring-1 focus:ring-[#7C6CFF] focus:border-[#7C6CFF]"
            />
          </div>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="bg-[#151922] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF]"
          >
            {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  category === cat.id
                    ? 'bg-[#7C6CFF]/10 text-[#7C6CFF] border border-[#7C6CFF]/30'
                    : 'text-[#929AAA] hover:text-[#F1F5F9] hover:bg-[#151922] border border-transparent'
                }`}
              >
                <Icon size={12} />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Count */}
        <div className="text-xs text-[#929AAA] mb-4">
          Showing <span className="text-[#F1F5F9] font-medium">{filtered.length}</span> ideas
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Lightbulb size={32} className="text-[#252B36] mx-auto mb-3" />
            <p className="text-sm text-[#929AAA]">No ideas match your filters</p>
            <button
              onClick={() => { setSearch(''); setCategory('all'); setDifficulty('All') }}
              className="mt-3 text-xs text-[#7C6CFF] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map(idea => (
                <IdeaCard key={idea.id} idea={idea} onClick={() => setSelected(idea)} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <DetailModal idea={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  )
}

