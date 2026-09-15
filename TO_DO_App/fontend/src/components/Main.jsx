import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const Main = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      const res = await fetch("http://localhost:5000/todos");
      const data = await res.json();
      setTodos(data);
    };
    getTodos();
  }, []);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const addTodo = async () => {
    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title, desc: desc }),
    });
    const newTodo = await res.json();
    setTodos((prev) => [...prev, newTodo]);
    setTitle("");
    setDesc("");
  };

  const toggleTodo = async (id, currentStatus) => {
    if (!id) {
      console.error("Cannot update: Todo ID is undefined!");
      return;
    }
    const res = await fetch(`http://localhost:5000/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !currentStatus }),
    });
    const updatedTodo = await res.json();

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? updatedTodo : todo)),
    );
  };

  const deleteTodo = async (id) => {
    const res = await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const editTodo = async (id, currentTitle, currentDesc) => {
    const newTitle = prompt("Enter new task:", currentTitle);
    const newDesc = prompt("Enter new desc:", currentDesc);
     if (!newTitle || !newTitle.trim()) return;
    if (!newDesc || !newDesc.trim()) return;

    const res = await fetch(`http://localhost:5000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle, desc: newDesc }),
    });
    const updatedTodo = await res.json();

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? updatedTodo.todo : todo)),
    );

  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTodo();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Task Manager</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title..."
            className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            type="text"
            placeholder="Description..."
            className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
          >
            Add
          </button>
        </form>
      </div>

      {/* Todo List */}
      {todos.length > 0 ? (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 rounded-xl border transition-all ${
                todo.completed
                  ? "bg-slate-100 border-slate-200 opacity-75"
                  : "bg-white border-slate-200 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <h2
                      className={`text-base font-semibold leading-snug break-words ${
                        todo.completed
                          ? "line-through text-slate-400"
                          : "text-slate-800"
                      }`}
                    >
                      {todo.title}
                    </h2>
                    {todo.desc && (
                      <p
                        className={`text-sm mt-1 break-words ${
                          todo.completed
                            ? "text-slate-400"
                            : "text-slate-600"
                        }`}
                      >
                        {todo.desc}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => editTodo(todo.id, todo.title, todo.desc)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 font-medium">No tasks added yet</p>
        </div>
      )}
    </div>
  );
}
  

export default Main;
