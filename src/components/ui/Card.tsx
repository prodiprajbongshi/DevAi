import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#151922] border border-[#252B36] rounded-xl p-4 ${hover ? 'hover:border-[#353D4E] hover:bg-[#1A2030] transition-all cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

export function CardHeader({ title, subtitle, action, icon }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[#7C6CFF]/10 border border-[#7C6CFF]/20 flex items-center justify-center text-[#7C6CFF]">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-[#F1F5F9]">{title}</h3>
          {subtitle && <p className="text-xs text-[#929AAA] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

