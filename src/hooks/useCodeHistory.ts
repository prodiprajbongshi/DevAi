import { useState, useEffect } from 'react'

export interface HistoryItem {
  id: string
  name: string
  language: string
  taskType: string
  code: string
  prompt: string
  createdAt: string
}

const STORAGE_KEY = 'devai_code_history'

export function useCodeHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch {}
    // Default mock history
    return [
      {
        id: '1',
        name: 'React Auth System',
        language: 'TypeScript',
        taskType: 'Code Generator',
        code: `import { useState } from 'react';\n\nfunction useAuth() {\n  const [user, setUser] = useState(null);\n  return { user, setUser };\n}`,
        prompt: 'Create a React authentication hook',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        name: 'Python Data Analyzer',
        language: 'Python',
        taskType: 'Code Debugger',
        code: `import pandas as pd\n\ndef analyze(df):\n    return df.describe()`,
        prompt: 'Debug my pandas data analysis code',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        name: 'PHP CRUD API',
        language: 'PHP',
        taskType: 'Code Generator',
        code: `<?php\n\nclass UserController {\n  public function index() {\n    return User::all();\n  }\n}`,
        prompt: 'Generate a PHP CRUD API controller',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        name: 'JS Form Validation',
        language: 'JavaScript',
        taskType: 'Code Explainer',
        code: `function validate(form) {\n  const email = form.email.value;\n  return /^[^@]+@[^@]+\.[^@]+$/.test(email);\n}`,
        prompt: 'Explain this form validation code',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch {}
  }, [history])

  const addItem = (item: Omit<HistoryItem, 'id' | 'createdAt'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setHistory(prev => [newItem, ...prev])
    return newItem.id
  }

  const deleteItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  const clearAll = () => setHistory([])

  return { history, addItem, deleteItem, clearAll }
}

