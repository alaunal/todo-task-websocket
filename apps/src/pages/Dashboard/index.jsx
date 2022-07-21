import React, { useEffect, useState, useRef } from "react";

import socketIOClient from "socket.io-client";

import { v4 as uuidv4 } from 'uuid';

import {isEqual } from "lodash";

import TaskItem from "../../components/TaskItem";

import { useAuth } from "../../hooks/useAuth";
import { useTodo } from "../../hooks/useTodo";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "http://localhost:3001";

const ROOM_ID = "todoListRoom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const {
    todos,
    error,
    setRecoveryToken,
    getTodo,
    addTodo,
    removeTodo,
    updateTodo,
    setError,
  } = useTodo();

  const newTaskTextRef = useRef();
  const socketRef = useRef();

  const [flag, setFlag] = useState([]);

  const [tempTodos, setTempTodos] = useState([]);

  useEffect(() => {
    let url = window.location.hash;
    let query = url.slice(1);
    let result = {};

    query.split("&").forEach((part) => {
      const item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });

    if (result.type === "recovery") {
      setRecoveryToken(result.access_token);
    }

    getTodo();
  }, []);

  const addTask = () => {
    let taskText = newTaskTextRef.current.value;
    let task = taskText.trim();

    if (task.length <= 3) {
      setError("Task length should be more than 3!");
    } else {
      addTodo(task);
      newTaskTextRef.current.value = "";
    }
  };

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { ROOM_ID },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (flag) => {
      if(flag.senderId !== socketRef.current.id) {
        // console.log("masuk sini:", flag);
        setFlag((flags) => [...flags, flag]);
      }
      
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [ROOM_ID]);

  useEffect(() => {
    if(!isEqual(todos, tempTodos)) {
      // console.log("todos tidak sama");

      (async () => {
        await socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
          uuid: uuidv4(),
          senderId: socketRef.current.id,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        });
      })();

      setTempTodos(todos);
    }
  }, [todos]);

  useEffect(() => {
    // console.log("todos:", todos);
    getTodo();
  }, [flag]);

  return (
    <div className="w-screen fixed flex flex-col min-h-screen bg-gray-100">
      <div className="container mx-auto">
        <header className="flex justify-between items-center px-4 h-24 ">
          <span className="text-2xl text-gray-700 font-mono">Todo List.</span>
          <button onClick={logout} className={"btn btn-outline"}>
            Logout
          </button>
        </header>
        <main className="pt-8 pb-10 flex flex-row justify-center">
          <div className="flex flex-col w-3/5 mb-8">
            <section className="mb-8 flex">
              <p className="text-2xl font-light">
                Hi,{" "}
                <span className="text-medium text-blue-700">{user.email}</span>
              </p>
            </section>
            <section className="mb-10 flex flex-row">
              <div className="pr-3 w-full">
                <input
                  ref={newTaskTextRef}
                  type="text"
                  onKeyUp={(e) => e.key === "Enter" && addTask()}
                  className={"input input-bordered w-full"}
                />
              </div>
              <div>
                <button
                  onClick={() => addTask()}
                  className={"flex btn btn-primary px-8"}
                >
                  Add
                </button>
              </div>
            </section>
            <section>
              {!!error && (
                <div
                  className={
                    "border max-w-sm self-center px-4 py-2 mt-4 text-center text-sm bg-red-100 border-red-300 text-red-400"
                  }
                >
                  {error}
                </div>
              )}
            </section>
            <section
              className={`p-2 border rounded flex-grow grid gap-2 bg-white shadow ${
                todos.length ? "auto-rows-min" : ""
              } grid-cols-1 h-2/3 overflow-y-scroll first:mt-8`}
            >
              {todos.length ? (
                todos.map((todo) => (
                  <TaskItem
                    key={todo.id}
                    todo={todo}
                    onDelete={() => removeTodo(todo.id)}
                    onStatus={() => updateTodo(todo.id, todo.is_complete)}
                  />
                ))
              ) : (
                <span className={"h-full flex justify-center items-center"}>
                  You do have any tasks yet!
                </span>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
