import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar'
import { Menu } from 'lucide-react'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#0B0D12] overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#252B36] bg-[#10131A]">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 text-[#929AAA] hover:text-[#F1F5F9] rounded-md hover:bg-[#1C2333] transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-semibold text-[#F1F5F9]">DevAI</span>
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

