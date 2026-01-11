'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

export default function TaskList() {
    const { t } = useLanguage();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [inputValue, setInputValue] = useState("");

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

        const newTask: Task = {
            id: crypto.randomUUID(), // Unique id lazim
            text: inputValue,
            completed: false,
        };

        setTasks([newTask, ...tasks]);
        setInputValue("");
    };

    const toggleTask = (id: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    return (
        <div className="w-full max-w-md mx-auto mt-8 p-6 glass rounded-2xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {t.tasks.title}
            </h2>

            <form onSubmit={addTask} className="relative mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t.tasks.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                    disabled={!inputValue.trim()}
                >
                    <Plus size={18} />
                </button>
            </form>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/5 transition-all"
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={cn(
                                    "flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                                    task.completed
                                        ? "bg-primary border-primary text-white"
                                        : "border-white/30 text-transparent hover:border-primary/50"
                                )}
                            >
                                <Check size={12} strokeWidth={4} />
                            </button>

                            <span
                                className={cn(
                                    "flex-grow text-sm transition-all truncate",
                                    task.completed ? "text-white/30 line-through" : "text-white/90"
                                )}
                            >
                                {task.text}
                            </span>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                    {tasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-white/20 text-sm py-8 italic"
                        >
                            {t.tasks.empty}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
