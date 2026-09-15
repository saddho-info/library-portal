export type LibraryProfile = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { users: number };
};

export type StaffUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  libraryId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};
