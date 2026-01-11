'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// Timer state logic
// Default 25dk ile basliyoruz (Pomodoro standarti)
const [timeLeft, setTimeLeft] = useState(25 * 60);
const [isActive, setIsActive] = useState(false);
const [mode, setMode] = useState<"focus" | "short" | "long">("focus");

useEffect(() => {
    let interval: NodeJS.Timeout;

    // Timer aktifse her saniye update ediyoruz
    if (isActive && timeLeft > 0) {
        interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
    } else if (timeLeft === 0) {
        // Sure bitti!
        // TODO: Buraya belki bir ses efekti eklenebilir
        setIsActive(false);
    }

    return () => clearInterval(interval);
}, [isActive, timeLeft]);

const toggleTimer = () => setIsActive(!isActive);

const resetTimer = () => {
    setIsActive(false);
    if (mode === "focus") setTimeLeft(25 * 60);
    if (mode === "short") setTimeLeft(5 * 60);
    if (mode === "long") setTimeLeft(15 * 60);
};

const setTimerMode = (newMode: "focus" | "short" | "long") => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === "focus") setTimeLeft(25 * 60);
    if (newMode === "short") setTimeLeft(5 * 60);
    if (newMode === "long") setTimeLeft(15 * 60);
};

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const progress =
    mode === "focus"
        ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
        : mode === "short"
            ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
            : ((15 * 60 - timeLeft) / (15 * 60)) * 100;

return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto">
        <div className="flex gap-4 mb-8 p-1 glass rounded-full">
            {(["focus", "short", "long"] as const).map((m) => (
                <button
                    key={m}
                    onClick={() => setTimerMode(m)}
                    className={cn(
                        "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                        mode === m
                            ? "bg-white/10 text-white shadow-lg"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                >
                    {m === "focus" ? "Focus" : m === "short" ? "Short Break" : "Long Break"}
                </button>
            ))}
        </div>

        <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Outer Ring */}
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-white/5"
                />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 - progress / 100 }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    style={{
                        strokeDasharray: "283",
                        strokeDashoffset: (progress / 100) * 283
                    }}
                />
            </svg>

            {/* Time Display */}
            <div className="text-6xl font-bold tracking-tighter text-white drop-shadow-2xl">
                {formatTime(timeLeft)}
            </div>
        </div>

        <div className="flex items-center gap-6 mt-12">
            <button
                onClick={toggleTimer}
                className="p-4 rounded-full bg-white text-black hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button
                onClick={resetTimer}
                className="p-4 rounded-full glass hover:bg-white/10 transition-colors text-white"
            >
                <RotateCcw size={24} />
            </button>
        </div>
    </div>
);
}
