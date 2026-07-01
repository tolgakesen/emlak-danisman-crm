import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { fetchOwnProfile } from "../services/profiles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function applySession(session) {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setProfile(nextUser ? await fetchOwnProfile(nextUser.id).catch(() => null) : null);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data: { session } }) => applySession(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => applySession(session));

    return () => subscription.unsubscribe();
  }, []);

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  const logout = () => supabase.auth.signOut();

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
