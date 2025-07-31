// Mock API for PyTracker

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  avatar?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'IN_REVIEW';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignee?: User;
  reporter: User;
  projectId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@pytracker.com', avatar: 'SC' },
  { id: '2', name: 'Alex Rodriguez', email: 'alex@pytracker.com', avatar: 'AR' },
  { id: '3', name: 'Maya Patel', email: 'maya@pytracker.com', avatar: 'MP' },
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'PyTracker Platform',
    key: 'PT',
    description: 'Main project management platform',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Mobile App',
    key: 'MA',
    description: 'iOS and Android mobile application',
    createdAt: '2024-02-01',
  },
];

const mockTickets: Ticket[] = [
  {
    id: 'PT-1',
    title: 'Create User Authentication System',
    description: 'Implement login, logout, and user session management',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee: mockUsers[0],
    reporter: mockUsers[1],
    projectId: '1',
    tags: ['AUTHENTICATION', 'BACKEND'],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22',
  },
  {
    id: 'PT-2',
    title: 'Design Dashboard UI',
    description: 'Create modern and intuitive dashboard interface',
    status: 'TODO',
    priority: 'MEDIUM',
    assignee: mockUsers[2],
    reporter: mockUsers[0],
    projectId: '1',
    tags: ['UI/UX', 'FRONTEND'],
    createdAt: '2024-01-21',
    updatedAt: '2024-01-21',
  },
  {
    id: 'PT-3',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure automated testing and deployment',
    status: 'DONE',
    priority: 'HIGH',
    assignee: mockUsers[1],
    reporter: mockUsers[0],
    projectId: '1',
    tags: ['DEVOPS', 'AUTOMATION'],
    createdAt: '2024-01-18',
    updatedAt: '2024-01-25',
  },
  {
    id: 'PT-4',
    title: 'Email Verification Process',
    description: 'Add email verification for new user registrations',
    status: 'IN_REVIEW',
    priority: 'MEDIUM',
    assignee: mockUsers[0],
    reporter: mockUsers[2],
    projectId: '1',
    tags: ['AUTHENTICATION', 'EMAIL'],
    createdAt: '2024-01-19',
    updatedAt: '2024-01-24',
  },
  {
    id: 'MA-1',
    title: 'Mobile App Wireframes',
    description: 'Create initial wireframes for mobile application',
    status: 'TODO',
    priority: 'LOW',
    assignee: mockUsers[2],
    reporter: mockUsers[1],
    projectId: '2',
    tags: ['MOBILE', 'DESIGN'],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
];

// Simulated API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    await delay(1000);
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password') {
      throw new Error('Invalid credentials');
    }
    return user;
  },

  async register(name: string, email: string, password: string): Promise<User> {
    await delay(1000);
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    await delay(500);
    return mockProjects;
  },

  async createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    await delay(800);
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    mockProjects.push(newProject);
    return newProject;
  },

  // Tickets
  async getTickets(projectId?: string): Promise<Ticket[]> {
    await delay(600);
    return projectId 
      ? mockTickets.filter(ticket => ticket.projectId === projectId)
      : mockTickets;
  },

  async createTicket(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    await delay(800);
    const project = mockProjects.find(p => p.id === ticket.projectId);
    const ticketCount = mockTickets.filter(t => t.projectId === ticket.projectId).length + 1;
    
    const newTicket: Ticket = {
      ...ticket,
      id: `${project?.key}-${ticketCount}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTickets.push(newTicket);
    return newTicket;
  },

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    await delay(500);
    const ticketIndex = mockTickets.findIndex(t => t.id === id);
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }
    
    mockTickets[ticketIndex] = {
      ...mockTickets[ticketIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return mockTickets[ticketIndex];
  },

  async deleteTicket(id: string): Promise<void> {
    await delay(500);
    const ticketIndex = mockTickets.findIndex(t => t.id === id);
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }
    mockTickets.splice(ticketIndex, 1);
  },

  // Users
  async getUsers(): Promise<User[]> {
    await delay(400);
    return mockUsers;
  },
};