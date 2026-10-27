/**
 * Profile & Timeline Data Layer - Single Source of Truth
 * STRICTLY based on resume.html facts. NO INVENTED NUMBERS.
 */

const profileData = {
  name: 'Jnanesh Sharma H.',
  role: 'Backend & Systems Engineer',
  education: {
    institution: 'Vivekananda College of Engineering and Technology (VCET)',
    affiliation: 'Affiliated with Visvesvaraya Technological University (VTU)',
    degree: 'Bachelor of Engineering (B.E.) in Computer Science Engineering',
    status: '3rd Year, Semester 5',
    cgpa: '7.4 / 10.0',
    expectedGraduation: 'Expected 2028',
    location: 'Puttur, Karnataka, India'
  },
  contact: {
    email: 'jnaneshsharmah@gmail.com',
    github: 'https://github.com/Jnanesh321',
    // Public phone intentionally removed for privacy
    location: 'India'
  },
  stats: [
    { label: 'Server Stability', value: '20.0 TPS', context: 'MGU.One Paper Infrastructure' },
    { label: 'Internship Role', value: 'Software Intern', context: 'Akanksha Charitable Trust' },
    { label: 'Engineering Degree', value: '3rd Year CS', context: 'VCET Puttur (VTU)' },
    { label: 'Academic CGPA', value: '7.4', context: 'VTU Computer Science' }
  ],
  experience: [
    {
      period: 'Jan 2026 – Jul 2026',
      role: 'Software Intern',
      organization: 'Akanksha Charitable Trust — Codex Learning Platform Backend',
      type: 'Work Experience',
      highlights: [
        'Implemented JWT authentication improvements, including security validation for tampered and invalid tokens.',
        'Designed and built a Firebase Cloud Messaging (FCM) notification service with a lightweight in-process scheduler for streak reminders.',
        'Integrated achievement notifications with gamification system and extended user models with configurable notification preferences.',
        'Contributed unit tests covering notification logic, gamification milestones, and authentication scenarios.',
        'Enhanced backend repository support and Firestore indexing to optimize notification operations.'
      ]
    },
    {
      period: '2022 – 2025',
      role: 'Creative Head',
      organization: 'WeMod (Atlantis Corporation)',
      type: 'Creative & Operations',
      highlights: [
        'Led creative planning and asset production across gaming and YouTube creator initiatives, including work with creators such as MrGamerJay and Mineplex-related projects.',
        'Coordinated cross-functional deliverables involving creator specifications, production schedules, and community assets.',
        'Owned end-to-end creative workflows and communication between external partners and internal teams.'
      ]
    },
    {
      period: 'Mar 2025 – Present',
      role: 'Administrator',
      organization: 'MGU.One Minecraft Server',
      type: 'Systems & Community Leadership',
      highlights: [
        'Administer ongoing server operations and community moderation.',
        'Manage operational workflows, player support, platform rules, and community operations.'
      ]
    },
    {
      period: 'Active',
      role: 'Member',
      organization: 'CoRE Club — VCET',
      type: 'Technical Community',
      highlights: [
        'Participate in club technical sessions, hackathons, and collaborative student engineering initiatives.'
      ]
    }
  ],
  activitiesAndCertifications: [
    'Participated in the IEEE Xtreme Competitive Programming competition.',
    'Solved approximately 50 algorithmic problems on LeetCode.',
    'Built custom integrations including Demand Balancer ShopGUI and BWLava BW2023.',
    'Python Programming Certificate — MICE Institute.',
    'Entrepreneurship Workshop — NITK Surathkal.'
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = profileData;
}
