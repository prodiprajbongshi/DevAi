import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, Code2, Bug, BookOpen,
  Zap, Lightbulb, History, Settings, HelpCircle, ChevronLeft,
  ChevronRight, User, Bot
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { path: '/generator', icon: Code2, label: 'Code Generator' },
  { path: '/debugger', icon: Bug, label: 'Code Debugger' },
  { path: '/explainer', icon: BookOpen, label: 'Code Explainer' },
  { path: '/optimizer', icon: Zap, label: 'Code Optimizer' },
  { path: '/ideas', icon: Lightbulb, label: 'Project Ideas' },
  { path: '/history', icon: History, label: 'Code History' },
]

const bottomItems = [
  { path: '/settings', icon: Settings, label: 'Settings' },
]

function NavItem({ path, icon: Icon, label, collapsed }: {
  path: string; icon: any; label: string; collapsed: boolean
}) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative ${
          isActive
            ? 'bg-[#7C6CFF]/10 text-[#7C6CFF] border border-[#7C6CFF]/20'
            : 'text-[#929AAA] hover:text-[#F1F5F9] hover:bg-[#1C2333]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#7C6CFF] rounded-r-full" />
          )}
          <Icon size={16} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#1C2333] border border-[#252B36] text-[#F1F5F9] text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const width = collapsed ? 'w-16' : 'w-60'

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-3 h-14 border-b border-[#252B36]">
        <div className="flex items-center gap-2.5 min-w-0">
           
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <span className="text-sm font-bold text-[#F1F5F9] tracking-tight">DevAI</span>
                <span className="block text-[10px] text-[#929AAA] -mt-0.5">AI Developer Assistant</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-md text-[#929AAA] hover:text-[#F1F5F9] hover:bg-[#1C2333] transition-colors flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <div className="mb-1">
          {!collapsed && (
            <span className="px-3 text-[10px] font-semibold text-[#929AAA]/70 uppercase tracking-wider">
              Workspace
            </span>
          )}
        </div>
        {navItems.map(item => (
          <NavItem key={item.path} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-2 py-3 border-t border-[#252B36] space-y-0.5">
        {bottomItems.map(item => (
          <NavItem key={item.path} {...item} collapsed={collapsed} />
        ))}
        <NavLink
          to="/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#929AAA] hover:text-[#F1F5F9] hover:bg-[#1C2333] transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-[#7C6CFF]/20 flex items-center justify-center flex-shrink-0">
            <User size={12} className="text-[#7C6CFF]" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="text-xs font-medium text-[#F1F5F9]">Prodip</div>
                <div className="text-[10px] text-[#929AAA]">Free Plan</div>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-[#10131A] border-r border-[#252B36] h-screen sticky top-0 flex-shrink-0 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-60 bg-[#10131A] border-r border-[#252B36] z-50 flex flex-col"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

