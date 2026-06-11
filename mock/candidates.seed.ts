// mock/candidates.seed.ts — Realistic Mock Candidate Data

export interface CandidateSeed {
  id: string;
  name: string;
  email: string;
  location: string;
  timezone: string;
  role: string;
  experience_years: number;
  skills: string[];
  domain: string;
  project_count: number;
  max_project_complexity: number;
  job_hops_5yr: number;
  avg_tenure_years: number;
  education: string;
  github?: string;
  linkedin?: string;
  bio: string;
  signal_strength: number;
  source: string;
  avatar_url?: string;
}

export const mockCandidates: CandidateSeed[] = [
  {
    id: 'cand_001',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    location: 'San Francisco, US',
    timezone: 'America/Los_Angeles',
    role: 'Senior Full-Stack Engineer',
    experience_years: 8,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'GraphQL', 'Docker', 'Kubernetes', 'Redis', 'CI/CD'],
    domain: 'SaaS',
    project_count: 12,
    max_project_complexity: 9,
    job_hops_5yr: 2,
    avg_tenure_years: 3.5,
    education: 'MS Computer Science, Stanford',
    github: 'sarahchen',
    linkedin: 'sarahchen',
    bio: 'Full-stack engineer with deep expertise in scalable SaaS platforms. Led engineering teams at two YC startups.',
    signal_strength: 0.92,
    source: 'GitHub',
  },
  {
    id: 'cand_002',
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    location: 'New York, US',
    timezone: 'America/New_York',
    role: 'Backend Engineer',
    experience_years: 5,
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker', 'Celery', 'RabbitMQ', 'Elasticsearch'],
    domain: 'Fintech',
    project_count: 7,
    max_project_complexity: 7,
    job_hops_5yr: 3,
    avg_tenure_years: 2.0,
    education: 'BS Computer Science, MIT',
    github: 'marcusj',
    bio: 'Backend engineer specializing in fintech infrastructure. Built payment processing systems handling $10M+ daily.',
    signal_strength: 0.78,
    source: 'LinkedIn',
  },
  {
    id: 'cand_003',
    name: 'Aiko Tanaka',
    email: 'aiko.tanaka@email.com',
    location: 'Tokyo, Japan',
    timezone: 'Asia/Tokyo',
    role: 'ML Engineer',
    experience_years: 6,
    skills: ['Python', 'PyTorch', 'TensorFlow', 'MLOps', 'Docker', 'Kubernetes', 'AWS', 'Spark', 'SQL'],
    domain: 'AI/ML',
    project_count: 9,
    max_project_complexity: 8,
    job_hops_5yr: 1,
    avg_tenure_years: 4.0,
    education: 'PhD Machine Learning, University of Tokyo',
    github: 'aikotanaka',
    linkedin: 'aiko-tanaka-ml',
    bio: 'ML engineer with production-level experience deploying models at scale. Published 3 papers on NLP.',
    signal_strength: 0.88,
    source: 'GitHub',
  },
  {
    id: 'cand_004',
    name: 'Raj Patel',
    email: 'raj.patel@email.com',
    location: 'Bangalore, India',
    timezone: 'Asia/Kolkata',
    role: 'DevOps Engineer',
    experience_years: 7,
    skills: ['Kubernetes', 'Terraform', 'AWS', 'GCP', 'Docker', 'CI/CD', 'Python', 'Go', 'Prometheus', 'Grafana'],
    domain: 'Cloud Infrastructure',
    project_count: 15,
    max_project_complexity: 8,
    job_hops_5yr: 2,
    avg_tenure_years: 3.0,
    education: 'MS Computer Engineering, IIT Bombay',
    github: 'rajpatel',
    bio: 'DevOps engineer with extensive cloud infrastructure experience. Managed clusters serving 10M+ users.',
    signal_strength: 0.82,
    source: 'Stack Overflow',
  },
  {
    id: 'cand_005',
    name: 'Elena Volkov',
    email: 'elena.v@email.com',
    location: 'Berlin, Germany',
    timezone: 'Europe/Berlin',
    role: 'Frontend Engineer',
    experience_years: 4,
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Figma', 'Storybook', 'Jest', 'Cypress'],
    domain: 'E-commerce',
    project_count: 6,
    max_project_complexity: 6,
    job_hops_5yr: 3,
    avg_tenure_years: 1.8,
    education: 'BA Computer Science, TU Berlin',
    github: 'elenav',
    bio: 'Frontend engineer passionate about design systems and accessibility. Built component libraries used by 50+ developers.',
    signal_strength: 0.71,
    source: 'Dribbble',
  },
  {
    id: 'cand_006',
    name: 'James Wright',
    email: 'james.wright@email.com',
    location: 'London, UK',
    timezone: 'Europe/London',
    role: 'Security Engineer',
    experience_years: 10,
    skills: ['Python', 'Go', 'Rust', 'Kubernetes', 'AWS', 'Penetration Testing', 'SIEM', 'Zero Trust', 'Cryptography'],
    domain: 'Cybersecurity',
    project_count: 20,
    max_project_complexity: 10,
    job_hops_5yr: 1,
    avg_tenure_years: 5.0,
    education: 'MS Cybersecurity, Oxford',
    github: 'jwrightsec',
    bio: 'Security engineer with 10 years experience. Former CISO at a fintech unicorn. OSCP certified.',
    signal_strength: 0.95,
    source: 'Conference Talk',
  },
  {
    id: 'cand_007',
    name: 'Priya Sharma',
    email: 'priya.s@email.com',
    location: 'Singapore',
    timezone: 'Asia/Singapore',
    role: 'Data Engineer',
    experience_years: 5,
    skills: ['Python', 'Spark', 'Airflow', 'Snowflake', 'dbt', 'SQL', 'AWS', 'Kafka', 'Databricks'],
    domain: 'Data',
    project_count: 8,
    max_project_complexity: 7,
    job_hops_5yr: 2,
    avg_tenure_years: 2.5,
    education: 'MS Data Science, NUS',
    github: 'priyadata',
    bio: 'Data engineer building pipelines processing 100M+ events daily. Expert in real-time streaming architectures.',
    signal_strength: 0.79,
    source: 'LinkedIn',
  },
  {
    id: 'cand_008',
    name: 'Alex Rivera',
    email: 'alex.r@email.com',
    location: 'Austin, US',
    timezone: 'America/Chicago',
    role: 'Mobile Engineer',
    experience_years: 6,
    skills: ['React Native', 'TypeScript', 'Swift', 'Kotlin', 'Firebase', 'GraphQL', 'Redux', 'Jest'],
    domain: 'Mobile',
    project_count: 10,
    max_project_complexity: 7,
    job_hops_5yr: 4,
    avg_tenure_years: 1.5,
    education: 'BS Computer Science, UT Austin',
    github: 'alexrivera',
    bio: 'Mobile engineer with apps totaling 5M+ downloads. Expert in cross-platform development.',
    signal_strength: 0.68,
    source: 'GitHub',
  },
  {
    id: 'cand_009',
    name: 'Nina Kowalski',
    email: 'nina.k@email.com',
    location: 'Warsaw, Poland',
    timezone: 'Europe/Warsaw',
    role: 'Blockchain Engineer',
    experience_years: 4,
    skills: ['Solidity', 'Rust', 'TypeScript', 'Web3.js', 'Ethers.js', 'Hardhat', 'Anchor', 'Go', 'React'],
    domain: 'Web3',
    project_count: 5,
    max_project_complexity: 8,
    job_hops_5yr: 2,
    avg_tenure_years: 2.0,
    education: 'MS Computer Science, Warsaw University',
    github: 'ninakowalski',
    bio: 'Smart contract engineer with experience in DeFi protocols. Contributed to 3 major DEX launches.',
    signal_strength: 0.85,
    source: 'Gitcoin',
  },
  {
    id: 'cand_010',
    name: 'David Kim',
    email: 'david.kim@email.com',
    location: 'Seoul, South Korea',
    timezone: 'Asia/Seoul',
    role: 'Platform Engineer',
    experience_years: 9,
    skills: ['Go', 'Rust', 'Kubernetes', 'gRPC', 'PostgreSQL', 'Redis', 'Kafka', 'Terraform', 'AWS', 'GCP'],
    domain: 'Platform',
    project_count: 18,
    max_project_complexity: 9,
    job_hops_5yr: 1,
    avg_tenure_years: 4.5,
    education: 'MS Computer Engineering, KAIST',
    github: 'davidkim',
    bio: 'Platform engineer who built the infrastructure serving 50M+ users at a top Korean tech company.',
    signal_strength: 0.91,
    source: 'Conference Talk',
  },
  {
    id: 'cand_011',
    name: 'Olivia Brown',
    email: 'olivia.b@email.com',
    location: 'Toronto, Canada',
    timezone: 'America/Toronto',
    role: 'Product Engineer',
    experience_years: 6,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Figma', 'Product Sense', 'A/B Testing', 'Analytics'],
    domain: 'SaaS',
    project_count: 11,
    max_project_complexity: 7,
    job_hops_5yr: 2,
    avg_tenure_years: 3.0,
    education: 'BBA + CS, University of Toronto',
    linkedin: 'oliviabrown',
    bio: 'Product-minded engineer who bridges the gap between design and engineering. Led 0→1 product launches.',
    signal_strength: 0.76,
    source: 'LinkedIn',
  },
  {
    id: 'cand_012',
    name: 'Mohammed Al-Rashid',
    email: 'mohammed.ar@email.com',
    location: 'Dubai, UAE',
    timezone: 'Asia/Dubai',
    role: 'Solutions Architect',
    experience_years: 12,
    skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Python', 'Java', 'Microservices', 'Event-Driven'],
    domain: 'Enterprise',
    project_count: 25,
    max_project_complexity: 10,
    job_hops_5yr: 1,
    avg_tenure_years: 6.0,
    education: 'MS Computer Engineering, American University of Sharjah',
    linkedin: 'mohammedalrashid',
    bio: 'Solutions architect with 12 years designing enterprise systems. AWS Solutions Architect Professional certified.',
    signal_strength: 0.93,
    source: 'LinkedIn',
  },
];

export function getCandidateById(id: string): CandidateSeed | undefined {
  return mockCandidates.find(c => c.id === id);
}

export function searchCandidates(query: string): CandidateSeed[] {
  const q = query.toLowerCase();
  return mockCandidates.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.role.toLowerCase().includes(q) ||
    c.skills.some(s => s.toLowerCase().includes(q)) ||
    c.domain.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q)
  );
}

export function getCandidatesBySkill(skill: string): CandidateSeed[] {
  return mockCandidates.filter(c =>
    c.skills.some(s => s.toLowerCase() === skill.toLowerCase())
  );
}

export function getTopCandidates(count: number = 5): CandidateSeed[] {
  return [...mockCandidates]
    .sort((a, b) => b.signal_strength - a.signal_strength)
    .slice(0, count);
}
