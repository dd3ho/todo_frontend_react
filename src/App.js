import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ title: "", description: "" });
    const [searchQuery, setSearchQuery] = useState(""); // สำหรับเก็บคำค้นหา

    useEffect(() => {
        // ถ้าคำค้นหาเป็นค่าว่าง ก็จะดึงข้อมูลทั้งหมด
        if (searchQuery === "") {
            axios
                .get("http://localhost:8000/api/todos")
                .then((response) => setTodos(response.data))
                .catch((error) => console.error(error));
        } else {
            // ถ้ามีคำค้นหา ให้ส่งคำค้นหาไปที่ API
            axios
                .get(`http://localhost:8000/todos/search?search=${searchQuery}`)
                .then((response) => setTodos(response.data))
                .catch((error) => console.error(error));
        }
    }, [searchQuery]); // จะทำงานทุกครั้งที่คำค้นหาหรือ searchQuery เปลี่ยน

    const createTodo = () => {
      axios
          .post("http://localhost:8000/api/todos", newTodo)
          .then((response) => {
              setTodos([...todos, response.data]);
              // รีเซ็ตค่าหลังจากเพิ่ม todo ใหม่
              setNewTodo({ title: "", description: "" });
          })
          .catch((error) => console.error(error));
  };
  

    const deleteTodo = (id) => {
        if (id) {
            axios
                .delete(`http://localhost:8000/api/todos/${id}`)
                .then((response) => {
                    // Filter out the deleted todo from the state
                    setTodos(todos.filter(todo => todo.id !== id));
                })
                .catch((error) => console.error(error));
        } else {
            console.error("Todo ID is missing");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-3xl font-semibold text-center mb-6 text-indigo-600">To-Do List</h1>

                {/* ช่องกรอกข้อมูลสำหรับค้นหา */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search Todos"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newTodo.title}
                        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Description"
                        value={newTodo.description}
                        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    onClick={createTodo}
                    className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Add Todo
                </button>

                <ul className="mt-6">
                    {todos && todos.length > 0 ? (
                        todos.map((todo) => (
                            <li key={todo.id} className="flex justify-between items-center p-3 mb-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">{todo.title}</h3>
                                    <p className="text-sm text-gray-500">{todo.description}</p>
                                </div>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="text-red-600 hover:text-red-800 focus:outline-none"
                                >
                                    Delete
                                </button>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No todos available</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default App;
