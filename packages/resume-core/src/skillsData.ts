export interface SkillCatalogCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  skills: string[];
}

export const SKILL_CATEGORIES_PRESETS: string[] = [
  'Languages',
  'Frameworks & Libraries',
  'Databases & Storage',
  'Cloud & DevOps',
  'Developer Tools & Platforms',
  'AI, ML & Data Science',
  'Core CS & Architecture',
  'Soft Skills & Leadership',
  'Cybersecurity & Networking',
  'Mobile & Desktop Development',
  'Web Technologies'
];

export const SKILLS_CATALOG: SkillCatalogCategory[] = [
  {
    id: 'languages',
    name: 'Languages',
    description: 'Programming, scripting, and markup languages',
    skills: [
      'JavaScript',
      'TypeScript',
      'Python',
      'Java',
      'C++',
      'C',
      'C#',
      'Go (Golang)',
      'Rust',
      'SQL',
      'HTML5',
      'CSS3',
      'Ruby',
      'PHP',
      'Swift',
      'Kotlin',
      'Dart',
      'R',
      'Scala',
      'Shell / Bash',
      'PowerShell',
      'GraphQL',
      'Solidity',
      'MATLAB',
      'Lua',
      'Perl',
      'Haskell',
      'Elixir',
      'Clojure',
      'Assembly'
    ]
  },
  {
    id: 'frameworks',
    name: 'Frameworks & Libraries',
    description: 'Frontend, backend, and full-stack frameworks and UI libraries',
    skills: [
      'React',
      'Next.js',
      'Node.js',
      'Express.js',
      'NestJS',
      'Vue.js',
      'Nuxt.js',
      'Angular',
      'Svelte',
      'SvelteKit',
      'Django',
      'Flask',
      'FastAPI',
      'Spring Boot',
      'ASP.NET Core',
      'Ruby on Rails',
      'Laravel',
      'Fastify',
      'Remix',
      'Tailwind CSS',
      'Bootstrap',
      'Material UI (MUI)',
      'Shadcn UI',
      'Chakra UI',
      'Redux / Redux Toolkit',
      'Zustand',
      'React Query (TanStack Query)',
      'React Native',
      'Flutter',
      'Expo',
      'SwiftUI',
      'Jetpack Compose',
      'Electron',
      'Three.js',
      'D3.js',
      'Jest',
      'Vitest',
      'Cypress',
      'Playwright',
      'Selenium',
      'Pandas',
      'NumPy',
      'PyTorch',
      'TensorFlow',
      'Scikit-Learn',
      'LangChain',
      'LlamaIndex'
    ]
  },
  {
    id: 'databases',
    name: 'Databases & Storage',
    description: 'Relational, NoSQL, in-memory databases, and ORMs',
    skills: [
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Redis',
      'SQLite',
      'Firebase Firestore',
      'Supabase',
      'Cassandra',
      'DynamoDB',
      'Elasticsearch',
      'Neo4j',
      'Oracle Database',
      'Microsoft SQL Server',
      'MariaDB',
      'CouchDB',
      'Prisma ORM',
      'Drizzle ORM',
      'Mongoose',
      'TypeORM',
      'SQLAlchemy',
      'Pinecone (Vector DB)',
      'ChromaDB',
      'Milvus',
      'ClickHouse',
      'Snowflake'
    ]
  },
  {
    id: 'cloud_devops',
    name: 'Cloud & DevOps',
    description: 'Cloud infrastructure, containerization, CI/CD, and orchestration',
    skills: [
      'AWS (Amazon Web Services)',
      'Microsoft Azure',
      'Google Cloud Platform (GCP)',
      'Docker',
      'Kubernetes (K8s)',
      'Terraform',
      'Ansible',
      'Jenkins',
      'GitHub Actions',
      'GitLab CI/CD',
      'CircleCI',
      'Linux / Unix Administration',
      'Nginx',
      'Apache',
      'Serverless Architecture',
      'AWS Lambda',
      'Vercel',
      'Netlify',
      'Cloudflare',
      'Helm',
      'Prometheus',
      'Grafana',
      'Datadog',
      'Kafka',
      'RabbitMQ'
    ]
  },
  {
    id: 'tools',
    name: 'Developer Tools & Platforms',
    description: 'Productivity, version control, API testing, and collaboration tools',
    skills: [
      'Git',
      'GitHub',
      'GitLab',
      'Bitbucket',
      'Postman',
      'Swagger / OpenAPI',
      'VS Code',
      'IntelliJ IDEA',
      'Webpack',
      'Vite',
      'npm / yarn / pnpm',
      'JIRA',
      'Confluence',
      'Trello',
      'Figma',
      'Adobe XD',
      'Insomnia',
      'Wireshark',
      'Postico / DBeaver',
      'Babel',
      'ESLint / Prettier'
    ]
  },
  {
    id: 'ai_data',
    name: 'AI, ML & Data Science',
    description: 'Machine learning, generative AI, LLMs, and big data',
    skills: [
      'Machine Learning (ML)',
      'Deep Learning (DL)',
      'Generative AI & LLMs',
      'Prompt Engineering',
      'Retrieval-Augmented Generation (RAG)',
      'Natural Language Processing (NLP)',
      'Computer Vision (CV)',
      'OpenAI API',
      'Hugging Face Transformers',
      'Fine-Tuning Models',
      'Data Analysis & Modeling',
      'Data Visualization',
      'Apache Spark',
      'Big Data Analytics',
      'ETL Pipeline Development',
      'Tableau',
      'Power BI',
      'Jupyter Notebooks',
      'Statistical Analysis'
    ]
  },
  {
    id: 'core_cs',
    name: 'Core CS & Architecture',
    description: 'Computer science fundamentals, system design, and software architecture',
    skills: [
      'Data Structures & Algorithms (DSA)',
      'Object-Oriented Programming (OOP)',
      'System Design & Architecture',
      'Microservices Architecture',
      'RESTful API Design',
      'GraphQL APIs',
      'gRPC & Protocol Buffers',
      'Test-Driven Development (TDD)',
      'Agile / Scrum Methodologies',
      'Clean Code & SOLID Principles',
      'Design Patterns',
      'Web Security & OWASP',
      'Performance Optimization',
      'Scalability & High Availability',
      'Database Normalization & Indexing'
    ]
  },
  {
    id: 'soft_skills',
    name: 'Soft Skills & Leadership',
    description: 'Communication, team leadership, problem-solving, and collaboration',
    skills: [
      'Problem Solving',
      'Team Leadership',
      'Technical Communication',
      'Cross-Functional Collaboration',
      'Project Management',
      'Agile & Sprint Planning',
      'Code Review & Mentorship',
      'Critical Thinking',
      'Time Management',
      'Stakeholder Management',
      'Adaptability & Fast Learner',
      'Public Speaking & Presentations',
      'Conflict Resolution'
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Networking',
    description: 'Security protocols, penetration testing, compliance, and networking',
    skills: [
      'Network Security',
      'Web Application Security',
      'Cryptography & Hashing',
      'Penetration Testing',
      'Vulnerability Assessment',
      'Identity & Access Management (IAM)',
      'OAuth 2.0 & OpenID Connect',
      'JWT Authentication',
      'SOC 2 & GDPR Compliance',
      'Ethical Hacking',
      'Firewalls & VPNs',
      'SSL / TLS Protocols',
      'SIEM & Incident Response'
    ]
  }
];

export interface FlatSkillItem {
  name: string;
  category: string;
  categoryId: string;
}

// Flat list of all unique skills across all catalog categories
export const ALL_SKILLS_FLAT: FlatSkillItem[] = SKILLS_CATALOG.flatMap(cat =>
  cat.skills.map(skill => ({
    name: skill,
    category: cat.name,
    categoryId: cat.id
  }))
);

/**
 * Returns curated skill suggestions for a given category name.
 * It intelligently matches category names (e.g. "Language", "Frontend", "Database", "Cloud", "Tools").
 */
export function getRecommendedSkillsForCategory(categoryName: string, existingSkills: string[] = []): string[] {
  const normCat = (categoryName || '').toLowerCase();
  const existingSet = new Set(existingSkills.map(s => s.trim().toLowerCase()));

  let matchedCategory = SKILLS_CATALOG.find(c =>
    normCat.includes(c.name.toLowerCase()) ||
    normCat.includes(c.id.toLowerCase()) ||
    c.name.toLowerCase().includes(normCat)
  );

  if (!matchedCategory) {
    if (normCat.includes('lang') || normCat.includes('code') || normCat.includes('prog')) {
      matchedCategory = SKILLS_CATALOG.find(c => c.id === 'languages');
    } else if (normCat.includes('frame') || normCat.includes('lib') || normCat.includes('tech') || normCat.includes('stack')) {
      matchedCategory = SKILLS_CATALOG.find(c => c.id === 'frameworks');
    } else if (normCat.includes('data') || normCat.includes('db') || normCat.includes('sql')) {
      matchedCategory = SKILLS_CATALOG.find(c => c.id === 'databases');
    } else if (normCat.includes('cloud') || normCat.includes('devops') || normCat.includes('infra') || normCat.includes('deploy')) {
      matchedCategory = SKILLS_CATALOG.find(c => c.id === 'cloud_devops');
    } else if (normCat.includes('tool') || normCat.includes('util') || normCat.includes('platform')) {
      matchedCategory = SKILLS_CATALOG.find(c => c.id === 'tools');
    } else if (normCat.includes('ai') || normCat.includes('ml') || normCat.includes('learn') || normCat.includes('model')) {
      matchedCategory = SKILLS_CATALOG.find(c => c.id === 'ai_data');
    } else if (normCat.includes('soft') || normCat.includes('lead') || normCat.includes('manage') || normCat.includes('people')) {
      matchedCategory = SKILLS_CATALOG.find(c => c.id === 'soft_skills');
    } else if (normCat.includes('sec') || normCat.includes('cyber') || normCat.includes('net')) {
      matchedCategory = SKILLS_CATALOG.find(c => c.id === 'cybersecurity');
    } else {
      matchedCategory = SKILLS_CATALOG.find(c => c.id === 'languages') || SKILLS_CATALOG[0];
    }
  }

  const pool = matchedCategory ? matchedCategory.skills : [];
  return pool.filter(skill => !existingSet.has(skill.toLowerCase()));
}

/**
 * Filter skills by search query and optional category filter
 */
export function filterSkillsCatalog(query: string, categoryId?: string): FlatSkillItem[] {
  const normQuery = (query || '').trim().toLowerCase();
  
  return ALL_SKILLS_FLAT.filter(item => {
    if (categoryId && categoryId !== 'all' && item.categoryId !== categoryId) {
      return false;
    }
    if (!normQuery) return true;
    return (
      item.name.toLowerCase().includes(normQuery) ||
      item.category.toLowerCase().includes(normQuery)
    );
  });
}
