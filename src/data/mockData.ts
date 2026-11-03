// Mock data for DevAI application

export const recentActivity = [
  {
    id: '1',
    name: 'React Authentication System',
    language: 'TypeScript',
    taskType: 'Code Generator',
    lastUpdated: '2 hours ago',
    status: 'completed',
  },
  {
    id: '2',
    name: 'Python Data Analyzer',
    language: 'Python',
    taskType: 'Code Debugger',
    lastUpdated: '5 hours ago',
    status: 'completed',
  },
  {
    id: '3',
    name: 'PHP CRUD API',
    language: 'PHP',
    taskType: 'Code Generator',
    lastUpdated: 'Yesterday',
    status: 'completed',
  },
  {
    id: '4',
    name: 'JavaScript Form Validation',
    language: 'JavaScript',
    taskType: 'Code Explainer',
    lastUpdated: '2 days ago',
    status: 'completed',
  },
  {
    id: '5',
    name: 'Go REST API',
    language: 'Go',
    taskType: 'Code Optimizer',
    lastUpdated: '3 days ago',
    status: 'in-progress',
  },
];

export const templates = [
  {
    id: '1',
    name: 'SaaS Dashboard',
    description: 'Full-stack SaaS dashboard with auth and billing',
    language: 'TypeScript',
    icon: '🧩',
  },
  {
    id: '2',
    name: 'REST API',
    description: 'RESTful API with CRUD operations and JWT auth',
    language: 'Node.js',
    icon: '⚡',
  },
  {
    id: '3',
    name: 'Authentication System',
    description: 'Complete auth system with OAuth2 and 2FA support',
    language: 'Python',
    icon: '🔐',
  },
  {
    id: '4',
    name: 'Portfolio Website',
    description: 'Modern animated portfolio with dark mode',
    language: 'React',
    icon: '🎨',
  },
];

export const projectIdeas = [
  {
    id: '1',
    title: 'AI-Powered Code Review Bot',
    description: 'A GitHub bot that automatically reviews PRs using AI, suggesting improvements and detecting bugs before they reach production.',
    difficulty: 'Advanced',
    category: 'AI & Machine Learning',
    technologies: ['Python', 'OpenAI API', 'GitHub API', 'FastAPI'],
    trending: true,
  },
  {
    id: '2',
    title: 'Real-time Collaborative Code Editor',
    description: 'A VS Code-like editor that supports real-time collaboration, similar to Google Docs but for code with syntax highlighting.',
    difficulty: 'Advanced',
    category: 'Web Development',
    technologies: ['React', 'WebSockets', 'Node.js', 'Monaco Editor'],
    trending: true,
  },
  {
    id: '3',
    title: 'Personal Finance Tracker',
    description: 'Track expenses, income, and savings goals with beautiful charts and AI-powered spending insights and recommendations.',
    difficulty: 'Intermediate',
    category: 'Web Development',
    technologies: ['React', 'Chart.js', 'Node.js', 'PostgreSQL'],
    trending: false,
  },
  {
    id: '4',
    title: 'ML Model Deployment Platform',
    description: 'A platform to deploy, monitor, and manage ML models with A/B testing, versioning, and performance dashboards.',
    difficulty: 'Advanced',
    category: 'AI & Machine Learning',
    technologies: ['Python', 'Docker', 'Kubernetes', 'FastAPI'],
    trending: true,
  },
  {
    id: '5',
    title: 'Job Application Tracker',
    description: 'Track job applications, interview stages, and follow-ups with Kanban board and email integration.',
    difficulty: 'Beginner',
    category: 'Web Development',
    technologies: ['React', 'Supabase', 'Tailwind CSS'],
    trending: false,
  },
  {
    id: '6',
    title: 'Sentiment Analysis Dashboard',
    description: 'Analyze social media sentiment about any topic in real-time with beautiful visualizations and trend tracking.',
    difficulty: 'Intermediate',
    category: 'Data Science',
    technologies: ['Python', 'Twitter API', 'NLTK', 'Streamlit'],
    trending: false,
  },
  {
    id: '7',
    title: 'Cross-Platform Habit Tracker',
    description: 'A mobile app to track daily habits, set streaks, and get AI-powered reminders and motivation based on your patterns.',
    difficulty: 'Intermediate',
    category: 'Mobile Applications',
    technologies: ['React Native', 'Expo', 'SQLite', 'Push Notifications'],
    trending: false,
  },
  {
    id: '8',
    title: 'GraphQL API Gateway',
    description: 'A unified GraphQL gateway that stitches together multiple microservices with caching, rate limiting, and monitoring.',
    difficulty: 'Advanced',
    category: 'Backend Development',
    technologies: ['Node.js', 'GraphQL', 'Redis', 'Prometheus'],
    trending: true,
  },
  {
    id: '9',
    title: 'Recipe Recommendation Engine',
    description: 'Recommends recipes based on available ingredients using ML, with nutritional analysis and meal planning features.',
    difficulty: 'Intermediate',
    category: 'AI & Machine Learning',
    technologies: ['Python', 'scikit-learn', 'FastAPI', 'React'],
    trending: false,
  },
  {
    id: '10',
    title: 'Stock Portfolio Analyzer',
    description: 'Analyze stock portfolios with historical data, risk assessment, and AI-driven investment suggestions.',
    difficulty: 'Intermediate',
    category: 'Data Science',
    technologies: ['Python', 'pandas', 'Plotly', 'Yahoo Finance API'],
    trending: false,
  },
  {
    id: '11',
    title: 'Event-Driven Microservices',
    description: 'Build a scalable event-driven architecture with message queues, sagas, and distributed tracing.',
    difficulty: 'Advanced',
    category: 'Backend Development',
    technologies: ['Go', 'Kafka', 'PostgreSQL', 'Jaeger'],
    trending: false,
  },
  {
    id: '12',
    title: 'Language Learning App',
    description: 'Mobile app for language learning with spaced repetition, AI pronunciation feedback, and native speaker conversations.',
    difficulty: 'Intermediate',
    category: 'Mobile Applications',
    technologies: ['Flutter', 'Firebase', 'OpenAI API', 'Dart'],
    trending: false,
  },
];

export const chatSuggestions = [
  'How do I implement JWT authentication in Node.js?',
  'Explain the difference between useEffect and useLayoutEffect',
  'Write a Python function to parse CSV files',
  'How to optimize React re-renders?',
  'What is the best way to handle errors in async/await?',
  'How to implement a rate limiter in Express.js?',
];

export const mockAIResponses: Record<string, string> = {
  default: `I'd be happy to help you with that! Here's a comprehensive solution:

\`\`\`typescript
// Example implementation
import { useState, useEffect } from 'react';

interface Config {
  apiKey: string;
  baseUrl: string;
  timeout: number;
}

async function fetchData<T>(endpoint: string, config: Config): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);
  
  try {
    const response = await fetch(\`\${config.baseUrl}\${endpoint}\`, {
      headers: {
        'Authorization': \`Bearer \${config.apiKey}\`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
\`\`\`

**Key points to remember:**
- Always handle errors with try/catch blocks
- Use AbortController for request cancellation
- Type your responses with TypeScript generics
- Clean up side effects in useEffect

Let me know if you need any clarification or have follow-up questions!`,
};

export const codeExamples = {
  javascript: `// Debounce function implementation
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);`,
  python: `# Python decorator for retry logic
import time
import functools

def retry(max_attempts=3, delay=1.0, exceptions=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay * (attempt + 1))
            return None
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def fetch_data(url):
    # Your API call here
    pass`,
  typescript: `// Generic API client with TypeScript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: \`Bearer \${token}\` }),
    };
  }

  async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(\`Request failed: \${response.statusText}\`);
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>('GET', endpoint);
  }

  post<T>(endpoint: string, body: unknown) {
    return this.request<T>('POST', endpoint, body);
  }
}`,
};

export const languages = [
  'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust',
  'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  'Dart', 'R', 'Scala', 'SQL', 'Bash', 'HTML/CSS',
];

export const frameworks = {
  JavaScript: ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'Express.js'],
  TypeScript: ['React', 'Next.js', 'Angular', 'NestJS', 'Fastify'],
  Python: ['FastAPI', 'Django', 'Flask', 'Streamlit', 'PyTorch', 'TensorFlow'],
  Go: ['Gin', 'Echo', 'Fiber', 'Chi', 'gRPC'],
  Java: ['Spring Boot', 'Micronaut', 'Quarkus', 'Vert.x'],
  'C#': ['.NET Core', 'ASP.NET', 'Blazor', 'MAUI'],
  PHP: ['Laravel', 'Symfony', 'WordPress', 'CodeIgniter'],
  Ruby: ['Ruby on Rails', 'Sinatra', 'Hanami'],
  Swift: ['SwiftUI', 'UIKit', 'Vapor'],
  Kotlin: ['Android', 'Ktor', 'Spring Boot'],
};

export const models = [
  { id: 'devai-pro', name: 'DevAI Pro', description: 'Most capable model' },
  { id: 'devai-fast', name: 'DevAI Fast', description: 'Optimized for speed' },
  { id: 'devai-code', name: 'DevAI Code', description: 'Specialized for code' },
];

