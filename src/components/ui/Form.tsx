import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  className?: string
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-[#929AAA] font-medium">{label}</label>}
      <select
        className={`bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF] focus:border-[#7C6CFF] cursor-pointer ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs text-[#929AAA] font-medium">{label}</label>}
      <textarea
        className={`bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF] focus:border-[#7C6CFF] placeholder-[#929AAA] resize-none ${className}`}
        {...props}
      />
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
}

export function Input({ label, icon, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs text-[#929AAA] font-medium">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929AAA]">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF] focus:border-[#7C6CFF] placeholder-[#929AAA] ${icon ? 'pl-9' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  )
}

