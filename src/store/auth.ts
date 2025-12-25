import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'ADVOCATE' | 'STAFF' | 'CLIENT';
  phone?: string;
  avatar?: string;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  subscription: string;
  logo?: string;
}

interface AuthStore {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTenant: (tenant: Tenant | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        tenant: null,
        token: null,
        isLoading: true,
        setUser: (user) => set({ user }),
        setTenant: (tenant) => set({ tenant }),
        setToken: (token) => set({ token }),
        setLoading: (isLoading) => set({ isLoading }),
        logout: () => set({ user: null, tenant: null, token: null }),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          tenant: state.tenant,
          token: state.token,
        }),
      }
    )
  )
);
