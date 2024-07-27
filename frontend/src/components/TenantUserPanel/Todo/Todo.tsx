"use client";
import { ThemeState } from '@/features/theme/themeSlice';
import React, { useState, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRightIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createTodo, fetchTodo, updateProject, updateTodo } from '@/api/projectService/project';
import { logout } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';

interface RootState {
    theme: ThemeState;
}

const Todo: React.FC = () => {
    const [task, setTask] = useState<string>('');
    const [todos, setTodos] = useState<{ task: string, status: string, _id: string }[]>([]);
    const [toogle, setToogle] = useState(false)
    const { background, text, main, dark } = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        fetchTodo().then((result) => {
            setTodos(result.data)
        })
    }, [toogle])

    const handleAddTask = (e: FormEvent) => {
        e.preventDefault();
        if (task.trim() === '') return;
        createTodo(task).then(() => {
            setToogle(!toogle)
            setTask('');
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        })
        

    };

    const moveToInProgress = (id: string) => {
        // const taskToMove = todos[taskIndex];
        // setTodos(todos.filter((_, index) => index !== taskIndex));
        // setInProgress([...inProgress, taskToMove]);
        updateTodo({ status: "progress" }, id).then(() => {
            setToogle(!toogle)
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        })
    };

    const moveToCompleted = (id: string) => {
        updateTodo({ status: "completed" }, id).then(() => {
            setToogle(!toogle)
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        })
    };

    const removeTask = (id: string) => {
        updateTodo({ is_deleted: true }, id).then(() => {
            setToogle(!toogle)
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        })
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className={`w-full max-w-6xl h-full ${background} shadow-lg rounded-lg p-6 mt-10`}>
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-100">To-Do List</h1>

                <form onSubmit={handleAddTask} className="mb-6 flex items-center space-x-4 text-gray-950">
                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Add a new task..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Add
                    </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* To-Do Section */}
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">To-Do</h2>
                        <ul className="space-y-4">
                            {todos.map((item, index) => {
                                if (item.status === 'todo') {
                                    return (
                                        <li key={index} className="bg-white p-3 border border-gray-200 rounded-lg text-gray-950 flex items-center justify-between">
                                            <span>{item.task}</span>
                                            <div className="space-x-2">
                                                <button
                                                    className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                                                    onClick={() => moveToInProgress(item._id)}
                                                >
                                                    <ChevronRightIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-600 focus:outline-none"
                                                    onClick={() => removeTask(item._id)}
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </li>
                                    )
                                } else {
                                    return null
                                }
                            })}
                        </ul>
                    </div>

                    {/* In Progress Section */}
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">In Progress</h2>
                        <ul className="space-y-4">


                            {todos.map((item, index) => {
                                if (item.status === 'progress') {
                                    return (
                                        <li key={index} className="bg-white p-3 border border-gray-200 rounded-lg text-gray-950 flex items-center justify-between">
                                            <span>{item.task}</span>
                                            <div className="space-x-2">
                                                <button
                                                    className="text-green-500 hover:text-green-600 focus:outline-none"
                                                    onClick={() => moveToCompleted(item._id)}
                                                >
                                                    <CheckIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-600 focus:outline-none"
                                                    onClick={() => removeTask(item._id)}
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </li>
                                    )
                                } else {
                                    return null
                                }
                            })}
                        </ul>
                    </div>

                    {/* Completed Section */}
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Completed</h2>
                        <ul className="space-y-4">


                            {todos.map((item, index) => {
                                if (item.status === 'completed') {
                                    return (
                                        <li key={index} className="bg-white p-3 border border-gray-200 rounded-lg text-gray-950 flex items-center justify-between">
                                            <span>{item.task}</span>
                                            <div className="space-x-2">
                                                <button
                                                    className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                                                    onClick={() => moveToInProgress(item._id)}
                                                >
                                                    <ChevronRightIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-600 focus:outline-none"
                                                    onClick={() => removeTask(item._id)}
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </li>
                                    )
                                } else {
                                    return null
                                }
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Todo;
