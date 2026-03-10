'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { CurrentUser, useUser } from '../lib/userContext';

export default function Login() {
  const [registerUser, setregisterUser] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();
  const { setUserId, setUsername } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    //just for dev i add a really usafe login without any password chechking etc change!!!
    //TODO ADD the native function for security big sec issue!!
    const { data } = await supabase
      .from('user_collection')
      .select('id , username')
      .eq('email', email)
      .single();
    if (data == null) {
      console.log('Error the emaill is not registered');
      return;
    }
    setUserId(data.id);
    setUsername(data.username);

    router.push('/');
  };

  return (
    <div>
      <h1>Enter credentials</h1>
      <form onSubmit={handleLogin}>
        <p />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email....."
          type="email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password....."
          type="password"
        />
        <p />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
