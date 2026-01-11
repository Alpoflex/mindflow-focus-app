'use client';

import Timer from "@/components/Timer";
import TaskList from "@/components/TaskList";
import AmbientPlayer from "@/components/AmbientPlayer";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col items-center py-20 px-4 relative overflow-hidden">
      <LanguageToggle />

      {/* Background Ambience Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 mb-2 drop-shadow-sm">
            {t.title}
          </h1>
          <p className="text-white/40 text-sm tracking-widest uppercase">
            {t.subtitle}
          </p>
        </header>

        <Timer />
        <TaskList />
      </div>

      <AmbientPlayer />
    </main>
  );
}
