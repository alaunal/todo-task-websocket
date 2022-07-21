import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import RecoveryPassword from "./pages/RecoveryPassword";

import BaseContainer from "./container/BaseContainer";
import PrivateContainer from "./container/PrivateContainer";

// -- provider context
import { TodoProvider } from "./hooks/useTodo";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<BaseContainer />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route path="/dashboard" element={<PrivateContainer />}>
          <Route
            path="home"
            element={
              <TodoProvider>
                <Dashboard />
              </TodoProvider>
            }
          />
          <Route
            path="recovery-password"
            element={
              <TodoProvider>
                <RecoveryPassword />
              </TodoProvider>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
