'use client';

import { createContext, useContext, useState } from 'react';

interface UserContextType {
  userId: number;
  username: string | null;
  setUsername: (userName: string | null) => void;
  setUserId: (id: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function CurrentUser({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<number>(1);
  const [username, setUsername] = useState<string | null>(null);
  return (
    <UserContext.Provider value={{ userId, username, setUserId, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);

  if (context == undefined) {
    throw new Error('User must be in the user provider');
  }
  return context;
};
