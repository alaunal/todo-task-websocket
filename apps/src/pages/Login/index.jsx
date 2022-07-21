import React, { useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../libs/api";

const Login = () => {

  const { helperText, setHelperText, hasRegister, isLoading, login, register } = useAuth();

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleLogin = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    login({ email, password });
  };

  const handleRegister = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    register({ email, password });
  };

  const forgotPassword = async (e) => {
    e.preventDefault();
    const email = prompt("Please enter your email:");

    if (email === null || email === "") {
      setHelperText({ error: true, text: "You must enter your email." });
    } else {
      let { error } = await supabase.auth.api.resetPasswordForEmail(email);
      if (error) {
        console.error("Error: ", error.message);
      } else {
        setHelperText({
          error: false,
          text: "Password recovery email has been sent.",
        });
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <div className="card w-2/5 shadow-lg border border-gray-200 bg-white relative">
            <div className="card-body">
              <h2 className="text-3xl mb-4 font-bold">Sign In</h2>

              {!!helperText.text && (
                <div
                  className={`border rounded px-1 py-3 my-2 text-center text-sm ${
                    helperText.error
                      ? "bg-red-100 border-red-300 text-red-400"
                      : "bg-green-100 border-green-300 text-green-500"
                  }`}
                >
                  {helperText.text}
                </div>
              )}

              {!hasRegister && (
                <>
                  <div className="form-control w-full">
                    <label className="label" htmlFor={"email"}>
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className="input input-bordered w-full"
                      ref={emailRef}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label" htmlFor={"password"}>
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter Password"
                      className="input input-bordered w-full"
                      ref={passwordRef}
                      disabled={isLoading}
                    />
                  </div>

                  <span
                    className={
                      "text-info mt-2 cursor-pointer self-end text-sm font-medium"
                    }
                    onClick={forgotPassword}
                  >
                    Forgot Password?
                  </span>

                  <div className="mt-6 flex">
                    <span className="block mx-1.5 w-full rounded-md shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleRegister()}
                        className={"w-full flex btn btn-outline"}
                        disabled={isLoading}
                      >
                        Sign Up
                      </button>
                    </span>
                    <span className="block w-full mx-1.5 rounded-md shadow-sm">
                      <button
                        onClick={() => handleLogin()}
                        type="submit"
                        className="flex w-full btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? "Loading..." : "Sign In"}
                      </button>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
