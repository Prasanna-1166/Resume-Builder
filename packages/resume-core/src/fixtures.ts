import { ResumeData } from './types.js';

export const studentFresherFixture: ResumeData = {
  id: 'fixture-student-fresher',
  title: 'CS Fresher Resume',
  targetRole: 'Software Engineer - New Grad',
  updatedAt: new Date().toISOString(),
  templateId: 'template_01',
  personalInfo: {
    fullName: 'Aarav Sharma',
    professionalTitle: 'Computer Science Graduate & Junior Developer',
    email: 'aarav.sharma@example.edu',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    github: 'github.com/aaravsharma',
    linkedin: 'linkedin.com/in/aaravsharma-dev',
    portfolio: 'aaravsharma.dev',
    rollNumber: '2020BCS0042'
  },
  summary: 'Motivated Computer Science graduate with strong fundamentals in data structures, algorithms, and full-stack web development. Proven track record of building production-grade web applications and contributing to open-source software.',
  education: [
    {
      id: 'edu-1',
      institution: 'Indian Institute of Information Technology',
      degree: 'Bachelor of Technology',
      field: 'Computer Science and Engineering',
      location: 'Bangalore, India',
      startDate: 'Aug 2020',
      endDate: 'May 2024',
      gpaOrGrade: '8.85 / 10.0',
      coursework: ['Data Structures & Algorithms', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Cloud Computing']
    }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'TechCorp Solutions',
      role: 'Software Engineering Intern',
      location: 'Bangalore, India',
      startDate: 'Jan 2024',
      endDate: 'Jun 2024',
      departmentOrTeam: 'Backend Platform Team',
      bullets: [
        'Developed microservices using Node.js and PostgreSQL to process 50,000+ daily student transaction logs.',
        'Optimized Redis caching layer, reducing API endpoint response times by 35%.',
        'Wrote automated integration test suites with Jest, increasing test coverage from 62% to 88%.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Algolens - Interactive Algorithm Visualizer',
      technologies: ['React', 'TypeScript', 'Canvas API', 'Tailwind CSS'],
      url: 'https://algolens.dev',
      repoUrl: 'github.com/aaravsharma/algolens',
      bullets: [
        'Architected visual simulations for 20+ sorting and graph algorithms with step-by-step execution playback.',
        'Adopted by 3,500+ university students across 12 computer science courses.',
        'Achieved 99 Lighthouse performance score by implementing Web Workers for graph computation.'
      ]
    },
    {
      id: 'proj-2',
      name: 'DevMarket - Peer-to-Peer Code Review Hub',
      technologies: ['Next.js', 'Go', 'PostgreSQL', 'Docker', 'GraphQL'],
      url: 'https://devmarket.app',
      repoUrl: 'github.com/aaravsharma/devmarket',
      bullets: [
        'Built real-time collaborative code review editor using WebSockets and Monaco Editor.',
        'Engineered OAuth2 authentication flow with GitHub API and role-based permissions.'
      ]
    }
  ],
  skills: [
    {
      id: 'sk-1',
      category: 'Languages',
      items: ['Python', 'TypeScript', 'JavaScript', 'C++', 'SQL', 'Go']
    },
    {
      id: 'sk-2',
      category: 'Frameworks & Libraries',
      items: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'FastAPI']
    },
    {
      id: 'sk-3',
      category: 'Tools & Platforms',
      items: ['Git', 'Docker', 'PostgreSQL', 'Redis', 'Linux', 'AWS (S3/EC2)', 'Vercel']
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2023',
      credentialUrl: 'https://aws.amazon.com/verify'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Smart India Hackathon Finalist',
      date: '2023',
      description: 'Ranked top 5 out of 1,200 teams nationwide for AI emergency dispatch solution.'
    },
    {
      id: 'ach-2',
      title: 'LeetCode Knight (Rating 1950+)',
      date: '2023',
      description: 'Solved 600+ algorithmic problems; ranked in top 3% globally.'
    }
  ],
  sectionVisibility: {
    personalInfo: true,
    summary: true,
    education: true,
    experience: true,
    projects: true,
    skills: true,
    certifications: true,
    achievements: true,
    publications: false,
    activities: false,
    languages: true,
    customSections: false
  },
  sectionOrder: ['personalInfo', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements']
};

export const softwareEngineerFixture: ResumeData = {
  id: 'fixture-software-engineer',
  title: 'Senior Software Engineer Resume',
  targetRole: 'Senior Backend Engineer',
  updatedAt: new Date().toISOString(),
  templateId: 'template_06',
  personalInfo: {
    fullName: 'Alex Chen',
    professionalTitle: 'Senior Software Engineer',
    email: 'alex.chen@email.com',
    phone: '(415) 555-0142',
    location: 'San Francisco, CA',
    github: 'github.com/alexchen',
    linkedin: 'linkedin.com/in/alexchen-swe',
    website: 'alexchen.dev'
  },
  summary: 'Staff-track backend engineer with 7+ years building high-throughput distributed systems, fault-tolerant payment pipelines, and real-time streaming architectures. Deep expertise in Golang, Rust, Kubernetes, and database query optimization.',
  education: [
    {
      id: 'edu-swe-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science & Mathematics',
      location: 'Berkeley, CA',
      startDate: '2014',
      endDate: '2018',
      gpaOrGrade: '3.91 / 4.0'
    }
  ],
  experience: [
    {
      id: 'exp-swe-1',
      company: 'Stripe',
      role: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: 'Present',
      departmentOrTeam: 'Payments Infrastructure Team',
      bullets: [
        'Designed and implemented a distributed rate-limiting service handling 2.4M requests/sec, reducing payment processing failures by 34%.',
        'Optimized critical-path database queries using B-tree index restructuring, cutting P99 latency from 180ms to 45ms across 12 microservices.',
        'Led migration of monolithic payment routing engine to event-driven Kafka architecture serving 50M+ daily transactions.',
        'Mentored 6 junior/mid-level engineers and spearheaded quarterly architectural design reviews.'
      ]
    },
    {
      id: 'exp-swe-2',
      company: 'Uber Technologies',
      role: 'Software Engineer II',
      location: 'San Francisco, CA',
      startDate: 'Aug 2018',
      endDate: 'Dec 2020',
      departmentOrTeam: 'Dispatch & Routing Engine',
      bullets: [
        'Constructed real-time geospatial driver matching microservice in Go, processing 300K updates/sec with <10ms latency.',
        'Implemented distributed circuit breaker pattern using Envoy proxy, increasing system uptime from 99.9% to 99.99%.',
        'Reduced AWS compute costs by $450K annually by profiling memory allocations and tuning Go garbage collection.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj-swe-1',
      name: 'RaftKV - Distributed Consensus Key-Value Store',
      technologies: ['Rust', 'gRPC', 'Protobuf', 'Raft Algorithm'],
      repoUrl: 'github.com/alexchen/raft-kv',
      bullets: [
        'Implemented leader election, log replication, and dynamic cluster membership changes in Rust.',
        'Verified safety and liveness properties using Jepsen fault injection testing under network partitions.'
      ]
    }
  ],
  skills: [
    {
      id: 'sk-swe-1',
      category: 'Languages',
      items: ['Go', 'Rust', 'Java', 'Python', 'C++', 'SQL', 'TypeScript']
    },
    {
      id: 'sk-swe-2',
      category: 'Distributed Systems & Cloud',
      items: ['Kubernetes', 'Docker', 'Apache Kafka', 'gRPC', 'AWS (EKS, DynamoDB, RDS)', 'Terraform', 'Prometheus']
    },
    {
      id: 'sk-swe-3',
      category: 'Databases & Storage',
      items: ['PostgreSQL', 'Redis', 'Cassandra', 'CockroachDB', 'Elasticsearch']
    }
  ],
  certifications: [
    {
      id: 'cert-swe-1',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2022'
    }
  ],
  sectionVisibility: {
    personalInfo: true,
    summary: true,
    education: true,
    experience: true,
    projects: true,
    skills: true,
    certifications: true,
    achievements: false,
    publications: false,
    activities: false,
    languages: false,
    customSections: false
  },
  sectionOrder: ['personalInfo', 'summary', 'experience', 'projects', 'skills', 'education', 'certifications']
};

export const productManagerFixture: ResumeData = {
  id: 'fixture-product-manager',
  title: 'Product Management Resume',
  targetRole: 'Principal Product Manager',
  updatedAt: new Date().toISOString(),
  templateId: 'template_04',
  personalInfo: {
    fullName: 'Emily Zhang',
    professionalTitle: 'Lead Product Manager - Search & Discovery',
    email: 'emily.zhang@email.com',
    phone: '(650) 555-0312',
    location: 'Mountain View, CA',
    linkedin: 'linkedin.com/in/emilyzhang-pm',
    website: 'emilyzhang.me'
  },
  summary: 'Product Manager with 7+ years driving 0-to-1 products and growth at scale. Technical background with expertise in search algorithms, personalization, and ML-powered recommendation engines. Track record of launching features used by 100M+ active users with measurable ARR impact.',
  education: [
    {
      id: 'edu-pm-1',
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Management Science & Engineering',
      location: 'Stanford, CA',
      startDate: '2015',
      endDate: '2017'
    },
    {
      id: 'edu-pm-2',
      institution: 'University of Michigan',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Ann Arbor, MI',
      startDate: '2011',
      endDate: '2015'
    }
  ],
  experience: [
    {
      id: 'exp-pm-1',
      company: 'Spotify',
      role: 'Senior Product Manager',
      location: 'New York, NY',
      startDate: 'Jan 2021',
      endDate: 'Present',
      departmentOrTeam: 'Search & Discovery Pod',
      bullets: [
        'Defined and launched personalized search suggestions feature serving 400M+ users, increasing search-to-play conversion by 23% and reducing null result rate by 40%.',
        'Designed and analyzed 15+ A/B experiments across iOS, Android, and Desktop platforms.',
        'Led cross-functional team of 14 engineers, 2 designers, 2 data scientists, and product marketing managers.'
      ]
    },
    {
      id: 'exp-pm-2',
      company: 'Pinterest',
      role: 'Product Manager - Visual Search',
      location: 'San Francisco, CA',
      startDate: 'Aug 2017',
      endDate: 'Dec 2020',
      departmentOrTeam: 'Computer Vision Product Team',
      bullets: [
        'Spearheaded Lens visual search commerce feature, driving $18M in incremental affiliate e-commerce revenue.',
        'Increased weekly active visual searchers from 2M to 12M through organic UX discovery entry points.'
      ]
    }
  ],
  projects: [],
  skills: [
    {
      id: 'sk-pm-1',
      category: 'Product & Strategy',
      items: ['Product Roadmap', 'A/B Testing & Experimentation', 'User Research', 'GTM Strategy', 'Data Analytics', 'SQL']
    },
    {
      id: 'sk-pm-2',
      category: 'Domain & Tools',
      items: ['Machine Learning Systems', 'Personalization', 'Figma', 'Amplitude', 'Jira', 'Mixpanel', 'Looker']
    }
  ],
  certifications: [
    {
      id: 'cert-pm-1',
      name: 'Reforge Advanced Growth Series',
      issuer: 'Reforge',
      date: '2021'
    }
  ],
  sectionVisibility: {
    personalInfo: true,
    summary: true,
    education: true,
    experience: true,
    projects: false,
    skills: true,
    certifications: true,
    achievements: false,
    publications: false,
    activities: false,
    languages: false,
    customSections: false
  },
  sectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'certifications']
};

export const sparseResumeFixture: ResumeData = {
  id: 'fixture-sparse-resume',
  title: 'Sparse Resume Edge Case',
  targetRole: 'Entry Level Trainee',
  updatedAt: new Date().toISOString(),
  templateId: 'template_01',
  personalInfo: {
    fullName: 'Rohan Gupta',
    email: 'rohan.gupta@email.com',
    phone: '+91 91234 56789',
    location: 'Delhi, India'
  },
  summary: 'Hardworking student seeking an entry-level software developer position.',
  education: [
    {
      id: 'edu-sp-1',
      institution: 'Delhi Technological University',
      degree: 'B.Tech',
      field: 'Information Technology',
      startDate: '2021',
      endDate: '2025'
    }
  ],
  experience: [],
  projects: [
    {
      id: 'proj-sp-1',
      name: 'Portfolio Website',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      bullets: ['Created personal website to showcase academic projects.']
    }
  ],
  skills: [
    {
      id: 'sk-sp-1',
      category: 'Core Skills',
      items: ['C++', 'Python', 'Web Development']
    }
  ],
  certifications: [],
  sectionVisibility: {
    personalInfo: true,
    summary: true,
    education: true,
    experience: false,
    projects: true,
    skills: true,
    certifications: false,
    achievements: false,
    publications: false,
    activities: false,
    languages: false,
    customSections: false
  },
  sectionOrder: ['personalInfo', 'summary', 'education', 'projects', 'skills']
};

export const longResumeFixture: ResumeData = {
  id: 'fixture-long-resume',
  title: 'Long Multi-Section Resume',
  targetRole: 'VP of Engineering',
  updatedAt: new Date().toISOString(),
  templateId: 'template_13',
  personalInfo: {
    fullName: 'Dr. Marcus Vance, PhD',
    professionalTitle: 'Technology Executive & Research Director',
    email: 'marcus.vance@alum.mit.edu',
    phone: '+1 (617) 555-8900',
    location: 'Boston, MA',
    website: 'https://vance-research.org',
    linkedin: 'linkedin.com/in/marcusvance-phd',
    github: 'github.com/mvance-ai'
  },
  summary: 'Distinguished engineering executive and systems researcher with 18+ years leading deep-tech organizations across autonomous systems, robotics, and distributed infrastructure. Oversaw engineering departments of 120+ engineers across 4 global hubs with $40M annual R&D budget.',
  education: [
    {
      id: 'edu-long-1',
      institution: 'Massachusetts Institute of Technology (MIT)',
      degree: 'Ph.D.',
      field: 'Electrical Engineering & Computer Science',
      location: 'Cambridge, MA',
      startDate: '2005',
      endDate: '2010',
      description: 'Dissertation on Distributed Consensus in High-Latency Asynchronous Networks.'
    },
    {
      id: 'edu-long-2',
      institution: 'Stanford University',
      degree: 'B.S.',
      field: 'Computer Systems Engineering',
      location: 'Stanford, CA',
      startDate: '2001',
      endDate: '2005'
    }
  ],
  experience: [
    {
      id: 'exp-long-1',
      company: 'Apex Autonomous Systems',
      role: 'Vice President of Software Engineering',
      location: 'Boston, MA',
      startDate: '2018',
      endDate: 'Present',
      bullets: [
        'Built and scaled software organization from 18 to 140 engineers across perception, motion planning, simulation, and cloud teleoperation.',
        'Achieved Level 4 autonomous commercial deployment across 8 major metropolitan regions with zero safety incidents.',
        'Reduced compute hardware bill of materials (BOM) by 42% through custom tensor quantization and CUDA kernel tuning.',
        'Authored 14 granted international patents in sensor fusion and real-time path planning.'
      ]
    },
    {
      id: 'exp-long-2',
      company: 'Google Cloud Platform',
      role: 'Principal Staff Engineer',
      location: 'Cambridge, MA',
      startDate: '2013',
      endDate: '2018',
      bullets: [
        'Architected globally distributed consensus layer powering Google Spanner multi-region replication.',
        'Led incident post-mortem engineering culture and reliability reviews across Tier-1 cloud storage services.',
        'Managed $15M equipment capital expenditure budget and directed joint academic research grants with MIT CSAIL.'
      ]
    },
    {
      id: 'exp-long-3',
      company: 'Bell Labs / Alcatel-Lucent',
      role: 'Member of Technical Staff (Research)',
      location: 'Murray Hill, NJ',
      startDate: '2010',
      endDate: '2013',
      bullets: [
        'Investigated software-defined networking protocols and published 8 peer-reviewed IEEE papers.',
        'Developed high-throughput packet classification algorithms in hardware-accelerated FPGA pipelines.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj-long-1',
      name: 'OpenFusion - Open Source Sensor Calibration Suite',
      technologies: ['C++', 'Python', 'ROS2', 'Eigen', 'OpenCV'],
      repoUrl: 'github.com/mvance-ai/openfusion',
      bullets: [
        'Developed multi-camera LiDAR spatial-temporal calibration framework adopted by 80+ robotics research labs worldwide.'
      ]
    }
  ],
  skills: [
    {
      id: 'sk-long-1',
      category: 'Leadership & Executive',
      items: ['Executive Leadership', 'Organizational Scaling', 'R&D Portfolio Management', 'Budgeting & P&L', 'Technical Hiring']
    },
    {
      id: 'sk-long-2',
      category: 'Systems & Deep Tech',
      items: ['Autonomous Vehicles', 'Distributed Systems', 'Real-Time Operating Systems (RTOS)', 'C++', 'CUDA', 'Python', 'ROS2']
    }
  ],
  certifications: [
    {
      id: 'cert-long-1',
      name: 'Stanford Executive Program in Leadership',
      issuer: 'Stanford Graduate School of Business',
      date: '2019'
    }
  ],
  publications: [
    {
      id: 'pub-long-1',
      title: 'Scalable Consensus for Low-Latency Robotic Swarms',
      publisher: 'IEEE Transactions on Robotics (T-RO)',
      date: '2017',
      url: 'https://doi.org/10.1109/TRO.2017.001'
    },
    {
      id: 'pub-long-2',
      title: 'Asynchronous Sensor Fusion in Dense Urban Navigation',
      publisher: 'ACM Transactions on Cyber-Physical Systems',
      date: '2015',
      url: 'https://doi.org/10.1145/281001'
    }
  ],
  achievements: [
    {
      id: 'ach-long-1',
      title: 'IEEE Senior Member',
      date: '2016',
      description: 'Elected for significant contributions to real-time networked robotics.'
    },
    {
      id: 'ach-long-2',
      title: 'MIT Presidential Fellowship',
      date: '2005',
      description: 'Awarded full doctoral research fellowship for exceptional academic achievement.'
    }
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'German', proficiency: 'Professional' },
    { id: 'lang-3', name: 'Mandarin', proficiency: 'Conversational' }
  ],
  sectionVisibility: {
    personalInfo: true,
    summary: true,
    education: true,
    experience: true,
    projects: true,
    skills: true,
    certifications: true,
    achievements: true,
    publications: true,
    activities: false,
    languages: true,
    customSections: false
  },
  sectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'publications', 'achievements', 'certifications', 'languages']
};
