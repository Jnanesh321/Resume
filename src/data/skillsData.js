/**
 * Skills Data Layer - Single Source of Truth
 * Grouped into Core / Working Knowledge / Exploring (no percentages)
 * STRICTLY based on resume.html and verified project implementations.
 */

const skillsData = {
  tiers: [
    {
      id: 'core',
      name: 'Core Competencies',
      badge: 'Production & Systems',
      description: 'Technologies and computer science foundations utilized in production backends, server infrastructure, and daily engineering.',
      skills: [
        { name: 'Node.js', category: 'Backend' },
        { name: 'Express.js', category: 'Backend' },
        { name: 'RESTful APIs', category: 'Backend' },
        { name: 'JavaScript (ES6+)', category: 'Languages' },
        { name: 'Java 17', category: 'Languages' },
        { name: 'C++', category: 'Languages' },
        { name: 'MongoDB', category: 'Database' },
        { name: 'Data Structures & Algorithms', category: 'CS Fundamentals' },
        { name: 'OOP & System Design', category: 'CS Fundamentals' },
        { name: 'DBMS', category: 'CS Fundamentals' }
      ]
    },
    {
      id: 'working',
      name: 'Working Knowledge',
      badge: 'Applied & Tooling',
      description: 'Frameworks, languages, and development tooling actively used across projects, coursework, and team collaborations.',
      skills: [
        { name: 'React', category: 'Frontend' },
        { name: 'C', category: 'Languages' },
        { name: 'Python', category: 'Languages' },
        { name: 'Git & GitHub', category: 'Tooling' },
        { name: 'Relational Schemas', category: 'Database' },
        { name: 'Linux / Bash', category: 'Systems' },
        { name: 'JWT Authentication', category: 'Security' },
        { name: 'Firebase Cloud Messaging (FCM)', category: 'Cloud Services' }
      ]
    },
    {
      id: 'exploring',
      name: 'Exploring & Systems Research',
      badge: 'Specialized Architecture',
      description: 'Specialized paradigms, autonomous integrations, and game server concurrency models under active engineering study.',
      skills: [
        { name: 'Distributed Microservices', category: 'Architecture' },
        { name: 'Bukkit Async Concurrency', category: 'Systems' },
        { name: 'Paper API (Minecraft 1.21.x)', category: 'Game Infrastructure' },
        { name: 'AI Headless Bridges & Daemons', category: 'AI Systems' },
        { name: 'In-process Schedulers', category: 'Systems' }
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = skillsData;
}
