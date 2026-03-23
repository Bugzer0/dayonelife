interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'DayOneLife App',
    description: `A smart habit tracking app that helps you build streaks, set countdowns, and achieve your personal goals. Track daily habits, visualize progress, and stay motivated with personalized insights.`,
    imgSrc: '/static/images/app-logo.png',
    href: 'https://dayonelife.com',
  },
  {
    title: 'DayOneLife Blog',
    description: `Practical insights on habits, streaks, countdowns & self-improvement`,
    imgSrc: '/static/images/blog-logo.png',
    href: '/blog',
  },
]

export default projectsData
