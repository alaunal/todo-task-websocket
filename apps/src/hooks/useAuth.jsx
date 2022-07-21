import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../libs/api";

// import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //   const [user, setUser] = useLocalStorage("user", null);
  const [user, setUser] = useState(null);
  const [helperText, setHelperText] = useState({ error: null, text: null });
  const [hasRegister, setHasRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (data) => {
    setIsLoading(true);

    const { user, error } = await supabase.auth.signIn(data);

    if (error) {
      setHelperText({ error: true, text: error.message });
      setIsLoading(false);
    } else {
      setUser(user);
      navigate("/dashboard/home", { replace: true });
    }
  };

  const register = async (data) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signUp(data);

    if (error) {
      setHelperText({ error: true, text: error.message });
      setIsLoading(false);
    } else {
      setHasRegister(true);
      setHelperText({
        error: false,
        text: "An email has been sent to you for verification!",
      });
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut().catch(console.error);
    setIsLoading(false);
    setUser(null);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (e, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      register,
      helperText,
      setHelperText,
      isLoading,
      setIsLoading,
      hasRegister,
    }),
    [user, helperText, isLoading, hasRegister]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
