"use client";
import { ThemeState } from '@/features/theme/themeSlice';
import React, { useState, FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { ChevronRightIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface RootState {
    theme: ThemeState;
}

const Todo: React.FC = () => {
    const [task, setTask] = useState<string>('');
    const [todos, setTodos] = useState<string[]>([]);
    const [inProgress, setInProgress] = useState<string[]>([]);
    const [completed, setCompleted] = useState<string[]>([]);
    const { background, text, main, dark } = useSelector((state: RootState) => state.theme);

    const handleAddTask = (e: FormEvent) => {
        e.preventDefault();
        if (task.trim() === '') return;
        setTodos([...todos, task]);
        setTask('');
    };

    const moveToInProgress = (taskIndex: number) => {
        const taskToMove = todos[taskIndex];
        setTodos(todos.filter((_, index) => index !== taskIndex));
        setInProgress([...inProgress, taskToMove]);
    };

    const moveToCompleted = (taskIndex: number) => {
        const taskToMove = inProgress[taskIndex];
        setInProgress(inProgress.filter((_, index) => index !== taskIndex));
        setCompleted([...completed, taskToMove]);
    };

    const removeTask = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        setList(list.filter((_, i) => i !== index));
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
                            {todos.map((item, index) => (
                                <li key={index} className="bg-white p-3 border border-gray-200 rounded-lg text-gray-950 flex items-center justify-between">
                                    <span>{item}</span>
                                    <div className="space-x-2">
                                        <button
                                            className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                                            onClick={() => moveToInProgress(index)}
                                        >
                                            <ChevronRightIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-600 focus:outline-none"
                                            onClick={() => removeTask(todos, setTodos, index)}
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* In Progress Section */}
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">In Progress</h2>
                        <ul className="space-y-4">
                            {inProgress.map((item, index) => (
                                <li key={index} className="bg-white p-3 border border-gray-200 rounded-lg text-gray-950 flex items-center justify-between">
                                    <span>{item}</span>
                                    <div className="space-x-2">
                                        <button
                                            className="text-green-500 hover:text-green-600 focus:outline-none"
                                            onClick={() => moveToCompleted(index)}
                                        >
                                            <CheckIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-600 focus:outline-none"
                                            onClick={() => removeTask(inProgress, setInProgress, index)}
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Completed Section */}
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Completed</h2>
                        <ul className="space-y-4">
                            {completed.map((item, index) => (
                                <li key={index} className="bg-white p-3 border border-gray-200 rounded-lg text-gray-950 flex items-center justify-between">
                                    <span>{item}</span>
                                    <button
                                        className="text-red-500 hover:text-red-600 focus:outline-none"
                                        onClick={() => removeTask(completed, setCompleted, index)}
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Todo;
