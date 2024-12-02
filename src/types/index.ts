export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'user';
  avatar_url?: string;
  groups?: {
    group: {
      id: string;
      name: string;
      permissions: string[];
    };
  }[];
  created_at: string;
  updated_at: string;
}

// Rest of the types remain the same...