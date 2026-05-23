// User
export interface User {
  id: string;
  email: string;
  name: string;
  orgId: string;
  roles: string[];
}

// Project
export interface Project {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  description?: string;
  businessBackground?: string;
  coreGoals?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  projectManager?: User;
  teams?: ProjectTeam[];
  milestones?: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTeam {
  id: string;
  userId: string;
  role: string;
  user: User;
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  dueDate: string;
  status: string;
  deliverables?: string[];
}

// Login Response
export interface LoginResponse {
  token: string;
  user: User;
}