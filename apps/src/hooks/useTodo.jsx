import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "../libs/api";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const { user } = useAuth();
  const [recoveryToken, setRecoveryToken] = useState(null);
  const [error, setError] = useState("");

  const getTodo = async () => {
    let { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .order("id", { ascending: false });
    if (error) setError(error.message);
    else setTodos(todos);
  };

  const addTodo = async (task) => {
    const newTodo = {
      task,
      user_id: user.id,
    };

    let { data: todo, error } = await supabase
      .from("todos")
      .insert(newTodo)
      .single();

    if (error) setError(error.message);
    else {
      setTodos([todo, ...todos]);
      setError(null);
    }
  };

  const removeTodo = async (id) => {
    try {
      await supabase.from("todos").delete().eq("id", id);
      setTodos(todos.filter((x) => x.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const updateTodo = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ is_complete: !isCompleted })
      .eq("id", id)
      .single();
      
    if (error) {
      setError(error.message);
    } else {
      getTodo();
    }
  };

  const value = useMemo(
    () => ({
      todos,
      recoveryToken,
      setRecoveryToken,
      addTodo,
      getTodo,
      updateTodo,
      removeTodo,
      error,
      setError,
    }),
    [todos, error, recoveryToken]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodo = () => {
  return useContext(TodoContext);
};
