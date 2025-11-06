// Demo tasks for testing and onboarding
export const demoTasks = [
  {
    title: "Complete project proposal",
    description: "Draft and submit the project proposal to management",
    category: "Work",
    priority: "high" as const,
    status: "pending" as const,
    dueDateOffset: 1, // days from now
  },
  {
    title: "Team standup meeting",
    description: "Daily standup with the development team",
    category: "Work",
    priority: "medium" as const,
    status: "completed" as const,
    dueDateOffset: 0, // today
  },
  {
    title: "Review pull requests",
    description: "Review and merge pending pull requests from team members",
    category: "Work",
    priority: "medium" as const,
    status: "pending" as const,
    dueDateOffset: 0, // today
  },
  {
    title: "Grocery shopping",
    description: "Buy groceries for the week",
    category: "Personal",
    priority: "medium" as const,
    status: "pending" as const,
    dueDateOffset: 1, // tomorrow
  },
  {
    title: "Call dentist",
    description: "Schedule a dental checkup appointment",
    category: "Health",
    priority: "low" as const,
    status: "pending" as const,
    dueDateOffset: 7, // next week
  },
  {
    title: "Morning workout",
    description: "30-minute cardio session",
    category: "Health",
    priority: "high" as const,
    status: "completed" as const,
    dueDateOffset: 0, // today
  },
  {
    title: "Read Chapter 5",
    description: "Read Chapter 5 of the book",
    category: "Study",
    priority: "medium" as const,
    status: "pending" as const,
    dueDateOffset: 7, // next week
  },
  {
    title: "Complete online course",
    description: "Finish the coding course",
    category: "Study",
    priority: "low" as const,
    status: "pending" as const,
    dueDateOffset: 7, // next week
  },
  {
    title: "Update resume",
    description: "Update resume, add recent projects and skills",
    category: "Work",
    priority: "low" as const,
    status: "overdue" as const,
    dueDateOffset: -1, // yesterday (overdue)
  },
  {
    title: "Prepare presentation",
    description: "Create slides for client meeting next Monday",
    category: "Work",
    priority: "high" as const,
    status: "pending" as const,
    dueDateOffset: 7, // next week
  },
  {
    title: "Fix broken faucet",
    description: "Call plumber for the broken faucet",
    category: "Personal",
    priority: "high" as const,
    status: "pending" as const,
    dueDateOffset: 2, // 2 days from now
  },
  {
    title: "Meditation practice",
    description: "10 minutes of mindfulness meditation",
    category: "Health",
    priority: "medium" as const,
    status: "completed" as const,
    dueDateOffset: 0, // today
  },
  {
    title: "Deploy staging environment",
    description: "Deploy latest build to staging for QA testing",
    category: "Work",
    priority: "high" as const,
    status: "pending" as const,
    dueDateOffset: 1, // tomorrow
  },
  {
    title: "Client feedback review",
    description: "Review and prioritize feedback from last sprint review",
    category: "Work",
    priority: "high" as const,
    status: "pending" as const,
    dueDateOffset: 0, // today
  },
  {
    title: "Database optimization",
    description: "Optimize slow queries in user analytics module",
    category: "Work",
    priority: "medium" as const,
    status: "pending" as const,
    dueDateOffset: 3,
  },
  {
    title: "Plan weekend trip",
    description: "Research destinations and book flights for family vacation",
    category: "Personal",
    priority: "high" as const,
    status: "pending" as const,
    dueDateOffset: 2,
  },
  {
    title: "Water plants",
    description: "Water all indoor and outdoor plants",
    category: "Personal",
    priority: "low" as const,
    status: "pending" as const,
    dueDateOffset: 0, // today
  },
  {
    title: "Pay electricity bill",
    description: "Pay monthly electricity bill online",
    category: "Personal",
    priority: "high" as const,
    status: "overdue" as const,
    dueDateOffset: -3, // 3 days overdue
  },
  {
    title: "Clean home office",
    description: "Deep clean desk, shelves, and organize files",
    category: "Personal",
    priority: "low" as const,
    status: "pending" as const,
    dueDateOffset: 4,
  },
  {
    title: "Annual physical checkup",
    description: "Schedule and attend annual health screening",
    category: "Health",
    priority: "high" as const,
    status: "pending" as const,
    dueDateOffset: 14, // 2 weeks
  },
  {
    title: "Meal prep for week",
    description: "Prepare healthy meals for the week",
    category: "Health",
    priority: "medium" as const,
    status: "completed" as const,
    dueDateOffset: -1,
  },
  {
    title: "Eye doctor appointment",
    description: "Get new glasses prescription and order frames",
    category: "Health",
    priority: "medium" as const,
    status: "pending" as const,
    dueDateOffset: 5,
  },
  {
    title: "Yoga class",
    description: "Evening yoga session for flexibility and relaxation",
    category: "Health",
    priority: "low" as const,
    status: "pending" as const,
    dueDateOffset: 0,
  },
  {
    title: "ML algorithms course",
    description: "Complete Module 4 on machine learning algorithms",
    category: "Study",
    priority: "high" as const,
    status: "pending" as const,
    dueDateOffset: 3,
  },
  {
    title: "Practice coding interview",
    description: "Solve some coding interview problems",
    category: "Study",
    priority: "medium" as const,
    status: "pending" as const,
    dueDateOffset: 2,
  },
  {
    title: "React hooks deep dive",
    description: "Study and document custom React hooks patterns",
    category: "Study",
    priority: "medium" as const,
    status: "pending" as const,
    dueDateOffset: 6,
  },
  {
    title: "Web security seminar",
    description: "Attend online seminar on web security",
    category: "Study",
    priority: "low" as const,
    status: "pending" as const,
    dueDateOffset: 10,
  },
  {
    title: "Write blog post",
    description: "Write article about NextJS 16 features",
    category: "Work",
    priority: "medium" as const,
    status: "pending" as const,
    dueDateOffset: 4,
  },
  {
    title: "Code review with mentor",
    description: "Schedule and conduct code review session",
    category: "Work",
    priority: "high" as const,
    status: "pending" as const,
    dueDateOffset: 1,
  },
  {
    title: "Backup important files",
    description: "Back up projects and documents to cloud storage",
    category: "Personal",
    priority: "high" as const,
    status: "pending" as const,
    dueDateOffset: 2,
  },
  {
    title: "Birthday gift shopping",
    description: "Buy gift for friend's birthday next month",
    category: "Personal",
    priority: "low" as const,
    status: "pending" as const,
    dueDateOffset: 7,
  },
];

// Helper to calculate due dates
export function getDueDate(offset: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date;
}

