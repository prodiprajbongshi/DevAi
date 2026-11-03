import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon, User, Palette, Code2, Bot,
  Shield, Bell, Save, Check, ChevronRight, Moon, Sun,
  Monitor, Globe, Key
} from 'lucide-react'
import { languages } from '../data/mockData'
import { useToast } from '../components/ui/Toast'
import { Button } from '../components/ui/Button'

type Tab = 'profile' | 'appearance' | 'ai' | 'account' | 'notifications'

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'ai', label: 'AI Preferences', icon: Bot },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Account & Security', icon: Shield },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-semibold text-[#929AAA] uppercase tracking-wider mb-3">{children}</h3>
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-[#1C2333] last:border-0">
      <div>
        <div className="text-sm font-medium text-[#F1F5F9]">{label}</div>
        {description && <div className="text-xs text-[#929AAA] mt-0.5">{description}</div>}
      </div>
      <div className="ml-4 flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-5.5 rounded-full transition-colors ${enabled ? 'bg-[#7C6CFF]' : 'bg-[#252B36]'}`}
      style={{ height: '22px', width: '40px' }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-[18px]' : 'translate-x-0'}`}
        style={{ width: '18px', height: '18px' }}
      />
    </button>
  )
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [saved, setSaved] = useState(false)
  const { toast } = useToast()

  // Profile
  const [name, setName] = useState('Prodip')
  const [email, setEmail] = useState('prodip@devai.app')
  const [bio, setBio] = useState('Full-stack developer passionate about AI tools')

  // Appearance
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark')
  const [fontSize, setFontSize] = useState('14')
  const [compactMode, setCompactMode] = useState(false)

  // AI
  const [defaultLang, setDefaultLang] = useState('TypeScript')
  const [model, setModel] = useState('devai-pro')
  const [streamResponse, setStreamResponse] = useState(true)
  const [codeComments, setCodeComments] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true)
  const [browserNotif, setBrowserNotif] = useState(false)
  const [weeklyReport, setWeeklyReport] = useState(true)

  const handleSave = async () => {
    setSaved(true)
    toast('Settings saved successfully!', 'success')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon size={16} className="text-[#929AAA]" />
        <h1 className="text-base font-semibold text-[#F1F5F9]">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="w-full md:w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#7C6CFF]/10 text-[#7C6CFF] border border-[#7C6CFF]/20'
                    : 'text-[#929AAA] hover:text-[#F1F5F9] hover:bg-[#151922]'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#151922] border border-[#252B36] rounded-xl p-5"
          >
            {activeTab === 'profile' && (
              <div>
                <SectionTitle>Profile Information</SectionTitle>
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-[#0B0D12] border border-[#252B36] rounded-xl">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7C6CFF] to-[#38BDF8] flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                    P
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#F1F5F9]">{name}</div>
                    <div className="text-xs text-[#929AAA]">{email}</div>
                    <button className="text-xs text-[#7C6CFF] mt-1.5 hover:underline">Change avatar</button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Full Name</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Email Address</label>
                    <input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      type="email"
                      className="w-full bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Bio</label>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      rows={3}
                      className="w-full bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF] resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <SectionTitle>Appearance</SectionTitle>
                <div className="mb-5">
                  <label className="block text-xs text-[#929AAA] font-medium mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['dark', 'light', 'system'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                          theme === t
                            ? 'border-[#7C6CFF] bg-[#7C6CFF]/10'
                            : 'border-[#252B36] hover:border-[#353D4E]'
                        }`}
                      >
                        {t === 'dark' && <Moon size={18} className={theme === t ? 'text-[#7C6CFF]' : 'text-[#929AAA]'} />}
                        {t === 'light' && <Sun size={18} className={theme === t ? 'text-[#7C6CFF]' : 'text-[#929AAA]'} />}
                        {t === 'system' && <Monitor size={18} className={theme === t ? 'text-[#7C6CFF]' : 'text-[#929AAA]'} />}
                        <span className="text-xs capitalize font-medium text-[#F1F5F9]">{t}</span>
                        {theme === t && <Check size={12} className="text-[#7C6CFF]" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0B0D12] border border-[#252B36] rounded-xl divide-y divide-[#1C2333] px-4">
                  <SettingRow label="Font Size" description="Editor and code font size">
                    <select
                      value={fontSize}
                      onChange={e => setFontSize(e.target.value)}
                      className="bg-[#151922] border border-[#252B36] text-[#F1F5F9] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    >
                      {['12', '13', '14', '15', '16'].map(s => (
                        <option key={s} value={s}>{s}px</option>
                      ))}
                    </select>
                  </SettingRow>
                  <SettingRow label="Compact Mode" description="Reduce spacing and padding">
                    <Toggle enabled={compactMode} onChange={setCompactMode} />
                  </SettingRow>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div>
                <SectionTitle>AI Preferences</SectionTitle>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Default Programming Language</label>
                    <select
                      value={defaultLang}
                      onChange={e => setDefaultLang(e.target.value)}
                      className="w-full bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF]"
                    >
                      {languages.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#929AAA] font-medium mb-1.5">Default AI Model</label>
                    <select
                      value={model}
                      onChange={e => setModel(e.target.value)}
                      className="w-full bg-[#0B0D12] border border-[#252B36] text-[#F1F5F9] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7C6CFF]"
                    >
                      <option value="devai-pro">DevAI Pro — Most capable</option>
                      <option value="devai-fast">DevAI Fast — Optimized for speed</option>
                      <option value="devai-code">DevAI Code — Specialized for code</option>
                    </select>
                  </div>
                </div>
                <div className="bg-[#0B0D12] border border-[#252B36] rounded-xl divide-y divide-[#1C2333] px-4">
                  <SettingRow label="Stream Responses" description="Show AI responses as they're generated">
                    <Toggle enabled={streamResponse} onChange={setStreamResponse} />
                  </SettingRow>
                  <SettingRow label="Add Code Comments" description="Include explanatory comments in generated code">
                    <Toggle enabled={codeComments} onChange={setCodeComments} />
                  </SettingRow>
                  <SettingRow label="Auto-save to History" description="Automatically save generated code to history">
                    <Toggle enabled={autoSave} onChange={setAutoSave} />
                  </SettingRow>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <SectionTitle>Notification Settings</SectionTitle>
                <div className="bg-[#0B0D12] border border-[#252B36] rounded-xl divide-y divide-[#1C2333] px-4">
                  <SettingRow label="Email Notifications" description="Receive updates via email">
                    <Toggle enabled={emailNotif} onChange={setEmailNotif} />
                  </SettingRow>
                  <SettingRow label="Browser Notifications" description="Push notifications in your browser">
                    <Toggle enabled={browserNotif} onChange={setBrowserNotif} />
                  </SettingRow>
                  <SettingRow label="Weekly Usage Report" description="Get a weekly summary of your AI usage">
                    <Toggle enabled={weeklyReport} onChange={setWeeklyReport} />
                  </SettingRow>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div>
                <SectionTitle>Account & Security</SectionTitle>
                <div className="bg-[#0B0D12] border border-[#252B36] rounded-xl divide-y divide-[#1C2333] mb-4 px-4">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-[#F1F5F9]">Current Plan</div>
                        <div className="text-xs text-[#929AAA] mt-0.5">Free — 100 generations/month</div>
                      </div>
                      <button className="px-3 py-1.5 bg-[#7C6CFF] text-white text-xs font-medium rounded-lg hover:bg-[#6C5CFF] transition-colors">
                        Upgrade
                      </button>
                    </div>
                  </div>
                  <SettingRow label="API Key" description="Your personal API access key">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#929AAA] font-mono">sk-****-****-3kR2</span>
                      <button className="p-1.5 text-[#929AAA] hover:text-[#F1F5F9] rounded hover:bg-[#252B36] transition-colors">
                        <Key size={13} />
                      </button>
                    </div>
                  </SettingRow>
                  <SettingRow label="Change Password" description="Update your account password">
                    <button className="flex items-center gap-1 text-xs text-[#929AAA] hover:text-[#F1F5F9] transition-colors">
                      Update <ChevronRight size={12} />
                    </button>
                  </SettingRow>
                  <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security">
                    <button className="flex items-center gap-1 text-xs text-[#929AAA] hover:text-[#F1F5F9] transition-colors">
                      Enable <ChevronRight size={12} />
                    </button>
                  </SettingRow>
                </div>
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <div className="text-sm font-medium text-red-400 mb-1">Danger Zone</div>
                  <div className="text-xs text-[#929AAA] mb-3">Once you delete your account, there is no going back.</div>
                  <button className="text-xs text-red-400 border border-red-500/30 rounded-lg px-3 py-1.5 hover:bg-red-500/10 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Save button */}
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSave}
              icon={saved ? <Check size={14} /> : <Save size={14} />}
              variant={saved ? 'secondary' : 'primary'}
            >
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

