export interface PublicRole {
  id: number;
  role: string;
}

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  role?: PublicRole;
}
