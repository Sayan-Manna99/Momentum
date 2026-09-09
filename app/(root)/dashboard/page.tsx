"use client";

import {
  Layers,
  Play,
  FileText,
  Award,
  FolderOpen,
  Clock,
  CalendarDays,
  Plus,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  CheckCircle,
  BarChart3,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Animated Background (same as Analytics page)
   ───────────────────────────────────────────── */
const AnimatedBackground = () => {
  const items = [
    { id: 1, text: "+", left: "10%", top: "20%", animationDuration: "15s", animationDelay: "0s", fontSize: "3rem", color: "#60a5fa", textShadow: "0 0 20px rgba(96, 165, 250, 0.8)" },
    { id: 2, text: "×", left: "80%", top: "15%", animationDuration: "25s", animationDelay: "2s", fontSize: "4rem", color: "#a78bfa", textShadow: "0 0 20px rgba(167, 139, 250, 0.8)" },
    { id: 3, text: "÷", left: "40%", top: "60%", animationDuration: "20s", animationDelay: "5s", fontSize: "2.5rem", color: "#22d3ee", textShadow: "0 0 20px rgba(34, 211, 238, 0.8)" },
    { id: 4, text: "=", left: "70%", top: "80%", animationDuration: "18s", animationDelay: "1s", fontSize: "3.5rem", color: "#f472b6", textShadow: "0 0 20px rgba(244, 114, 182, 0.8)" },
    { id: 5, text: "%", left: "20%", top: "75%", animationDuration: "22s", animationDelay: "3s", fontSize: "5rem", color: "#60a5fa", textShadow: "0 0 20px rgba(96, 165, 250, 0.8)" },
    { id: 6, text: "[]", left: "50%", top: "30%", animationDuration: "30s", animationDelay: "0s", fontSize: "3rem", color: "#a78bfa", textShadow: "0 0 20px rgba(167, 139, 250, 0.8)" },
    { id: 7, text: "{}", left: "90%", top: "50%", animationDuration: "24s", animationDelay: "4s", fontSize: "3.5rem", color: "#22d3ee", textShadow: "0 0 20px rgba(34, 211, 238, 0.8)" },
    { id: 8, text: "<>", left: "15%", top: "45%", animationDuration: "28s", animationDelay: "1s", fontSize: "2.5rem", color: "#f472b6", textShadow: "0 0 20px rgba(244, 114, 182, 0.8)" },
    { id: 9, text: "0", left: "60%", top: "10%", animationDuration: "19s", animationDelay: "2s", fontSize: "2.8rem", color: "#60a5fa", textShadow: "0 0 20px rgba(96, 165, 250, 0.8)" },
    { id: 10, text: "1", left: "85%", top: "85%", animationDuration: "26s", animationDelay: "6s", fontSize: "3.2rem", color: "#a78bfa", textShadow: "0 0 20px rgba(167, 139, 250, 0.8)" },
    { id: 11, text: "■", left: "5%", top: "85%", animationDuration: "35s", animationDelay: "0s", fontSize: "2rem", color: "#22d3ee", textShadow: "0 0 20px rgba(34, 211, 238, 0.8)" },
    { id: 12, text: "▲", left: "30%", top: "10%", animationDuration: "21s", animationDelay: "5s", fontSize: "2rem", color: "#f472b6", textShadow: "0 0 20px rgba(244, 114, 182, 0.8)" },
    { id: 13, text: "●", left: "55%", top: "90%", animationDuration: "27s", animationDelay: "2s", fontSize: "2.5rem", color: "#60a5fa", textShadow: "0 0 20px rgba(96, 165, 250, 0.8)" },
    { id: 14, text: "◆", left: "35%", top: "40%", animationDuration: "23s", animationDelay: "7s", fontSize: "3rem", color: "#a78bfa", textShadow: "0 0 20px rgba(167, 139, 250, 0.8)" },
    { id: 15, text: "⬢", left: "75%", top: "40%", animationDuration: "32s", animationDelay: "1s", fontSize: "4rem", color: "#22d3ee", textShadow: "0 0 20px rgba(34, 211, 238, 0.8)" },
    { id: 16, text: "≈", left: "25%", top: "55%", animationDuration: "17s", animationDelay: "4s", fontSize: "3.5rem", color: "#f472b6", textShadow: "0 0 20px rgba(244, 114, 182, 0.8)" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-rotate {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.7; }
          100% { transform: translateY(0) rotate(360deg); opacity: 0.2; }
        }
      `}} />

      {/* Dark grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-cyan-500/10 blur-[100px]" />

      {/* Floating shapes */}
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute select-none font-mono flex items-center justify-center"
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.fontSize,
            color: item.color,
            textShadow: item.textShadow,
            animation: `float-rotate ${item.animationDuration} infinite ease-in-out ${item.animationDelay}`,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Glass Card wrapper (reusable inline pattern)
   ───────────────────────────────────────────── */
const glassCard =
  "rounded-2xl border border-white/10 bg-neutral-400/20 backdrop-blur-lg p-6 transition-all duration-300";

/* ─────────────────────────────────────────────
   Dashboard Page
   ───────────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full h-full p-6 space-y-8">
        {/* ══════════════════════════════════════
           1. DASHBOARD HEADER
           ══════════════════════════════════════ */}
        <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Left — Welcome */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Welcome back, Learner 👋
            </h1>
            <p className="text-white/50 mt-1 text-sm md:text-base">
              Here&apos;s an overview of your learning journey.
            </p>
          </div>

          {/* Right — Motivational Quote */}
          <div className={`${glassCard} max-w-md`}>
            <p className="text-white/70 text-sm italic leading-relaxed">
              &ldquo;The only way to do great work is to love what you learn.&rdquo;
            </p>
            <p className="text-white/40 text-xs mt-2 text-right">
              — Daily Motivation
            </p>
          </div>
        </header>

        {/* ══════════════════════════════════════
           2. STATISTICS SECTION
           ══════════════════════════════════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Projects */}
          <div className={`${glassCard} group min-h-[140px] flex flex-col justify-between hover:bg-neutral-400/40 hover:border-white/20`}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-blue-400/60 group-hover:text-blue-400 transition-colors duration-300">
                Active Projects
              </p>
              <FolderOpen size={22} className="text-blue-400/60 group-hover:text-blue-400 transition-colors duration-300" />
            </div>
            <h2 className="mt-4 text-4xl md:text-[2.7rem] font-semibold tracking-tight text-blue-400">
              12
            </h2>
          </div>

          {/* Videos Watched */}
          <div className={`${glassCard} group min-h-[140px] flex flex-col justify-between hover:bg-neutral-400/40 hover:border-white/20`}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-purple-400/60 group-hover:text-purple-400 transition-colors duration-300">
                Videos Watched
              </p>
              <Play size={22} className="text-purple-400/60 group-hover:text-purple-400 transition-colors duration-300" />
            </div>
            <h2 className="mt-4 text-4xl md:text-[2.7rem] font-semibold tracking-tight text-purple-400">
              48
            </h2>
          </div>

          {/* PDFs Completed */}
          <div className={`${glassCard} group min-h-[140px] flex flex-col justify-between hover:bg-neutral-400/40 hover:border-white/20`}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-cyan-400/60 group-hover:text-cyan-400 transition-colors duration-300">
                PDFs Completed
              </p>
              <FileText size={22} className="text-cyan-400/60 group-hover:text-cyan-400 transition-colors duration-300" />
            </div>
            <h2 className="mt-4 text-4xl md:text-[2.7rem] font-semibold tracking-tight text-cyan-400">
              23
            </h2>
          </div>

          {/* Avg Quiz Score */}
          <div className={`${glassCard} group min-h-[140px] flex flex-col justify-between hover:bg-neutral-400/40 hover:border-white/20`}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-green-400/60 group-hover:text-green-400 transition-colors duration-300">
                Avg Quiz Score
              </p>
              <Award size={22} className="text-green-400/60 group-hover:text-green-400 transition-colors duration-300" />
            </div>
            <h2 className="mt-4 text-4xl md:text-[2.7rem] font-semibold tracking-tight text-green-400">
              87%
            </h2>
          </div>
        </section>

        {/* ══════════════════════════════════════
           3. MAIN LEARNING SECTION
           ══════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Continue Learning */}
          <div className={glassCard}>
            <div className="flex items-center gap-2 mb-5">
              <BookOpen size={20} className="text-blue-400" />
              <h3 className="font-semibold text-white/90 text-lg">Continue Learning</h3>
            </div>

            {/* Placeholder resource */}
            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white/80 font-medium text-sm">React Advanced Patterns</p>
                    <p className="text-white/40 text-xs mt-1">Video • 12 of 24 completed</p>
                  </div>
                  <Play size={16} className="text-blue-400 mt-1" />
                </div>
                {/* Progress bar placeholder */}
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[50%] rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/40 text-xs">50% complete</span>
                  <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                    Continue <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white/80 font-medium text-sm">System Design Fundamentals</p>
                    <p className="text-white/40 text-xs mt-1">PDF • 8 of 15 pages read</p>
                  </div>
                  <FileText size={16} className="text-cyan-400 mt-1" />
                </div>
                {/* Progress bar placeholder */}
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[53%] rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400" />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/40 text-xs">53% complete</span>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                    Continue <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Project Completion */}
          <div className={glassCard}>
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={20} className="text-purple-400" />
              <h3 className="font-semibold text-white/90 text-lg">Project Completion</h3>
            </div>

            {/* Chart placeholder */}
            <div className="w-full aspect-[4/3] rounded-xl border border-white/5 bg-white/[0.03] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={48} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/30 text-sm">Completion chart placeholder</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
           4. ACTIVE PROJECTS SECTION
           ══════════════════════════════════════ */}
        <section className={glassCard}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Layers size={20} className="text-yellow-400" />
              <h3 className="font-semibold text-white/90 text-lg">Active Projects</h3>
            </div>
            <button className="text-xs text-white/50 hover:text-white/80 transition-colors flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>

          {/* Project rows */}
          <div className="space-y-3">
            {/* Row 1 */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white/80 font-medium text-sm truncate">Full-Stack Development Bootcamp</p>
                <p className="text-white/40 text-xs mt-1">18 resources • Updated 2 hours ago</p>
              </div>
              <div className="flex items-center gap-4 sm:w-[200px]">
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-green-500 to-green-400" />
                </div>
                <span className="text-green-400 text-xs font-medium w-10 text-right">72%</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white/80 font-medium text-sm truncate">Machine Learning Foundations</p>
                <p className="text-white/40 text-xs mt-1">24 resources • Updated 1 day ago</p>
              </div>
              <div className="flex items-center gap-4 sm:w-[200px]">
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[45%] rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400" />
                </div>
                <span className="text-yellow-400 text-xs font-medium w-10 text-right">45%</span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white/80 font-medium text-sm truncate">UI/UX Design Principles</p>
                <p className="text-white/40 text-xs mt-1">9 resources • Updated 3 days ago</p>
              </div>
              <div className="flex items-center gap-4 sm:w-[200px]">
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
                </div>
                <span className="text-blue-400 text-xs font-medium w-10 text-right">88%</span>
              </div>
            </div>

            {/* Row 4 */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white/80 font-medium text-sm truncate">Data Structures & Algorithms</p>
                <p className="text-white/40 text-xs mt-1">32 resources • Updated 5 days ago</p>
              </div>
              <div className="flex items-center gap-4 sm:w-[200px]">
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[30%] rounded-full bg-gradient-to-r from-red-500 to-orange-400" />
                </div>
                <span className="text-orange-400 text-xs font-medium w-10 text-right">30%</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
           5. LOWER SECTIONS — Activity & Deadlines
           ══════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Recent Activity */}
          <div className={glassCard}>
            <div className="flex items-center gap-2 mb-5">
              <Clock size={20} className="text-cyan-400" />
              <h3 className="font-semibold text-white/90 text-lg">Recent Activity</h3>
            </div>

            <div className="space-y-4">
              {[
                { action: "Completed video", detail: "React Hooks Deep Dive — Lesson 7", time: "2 hours ago", icon: <CheckCircle size={16} className="text-green-400" /> },
                { action: "Started reading", detail: "System Design PDF — Chapter 3", time: "5 hours ago", icon: <FileText size={16} className="text-cyan-400" /> },
                { action: "Quiz submitted", detail: "JavaScript Fundamentals — Score: 92%", time: "1 day ago", icon: <Award size={16} className="text-yellow-400" /> },
                { action: "New project created", detail: "Cloud Computing Essentials", time: "2 days ago", icon: <FolderOpen size={16} className="text-purple-400" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <div className="mt-0.5">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-sm font-medium">{item.action}</p>
                    <p className="text-white/40 text-xs mt-0.5 truncate">{item.detail}</p>
                  </div>
                  <span className="text-white/30 text-xs whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Upcoming Deadlines */}
          <div className={glassCard}>
            <div className="flex items-center gap-2 mb-5">
              <CalendarDays size={20} className="text-pink-400" />
              <h3 className="font-semibold text-white/90 text-lg">Upcoming Deadlines</h3>
            </div>

            <div className="space-y-4">
              {[
                { title: "ML Foundations — Module 3 Quiz", date: "Sep 12, 2026", urgency: "text-red-400", badge: "2 days left" },
                { title: "React Project — Final Submission", date: "Sep 15, 2026", urgency: "text-yellow-400", badge: "5 days left" },
                { title: "DSA Practice Set — Week 4", date: "Sep 18, 2026", urgency: "text-white/50", badge: "8 days left" },
                { title: "Design Review — Portfolio Project", date: "Sep 22, 2026", urgency: "text-white/50", badge: "12 days left" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <CalendarDays size={16} className={item.urgency} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-sm font-medium truncate">{item.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{item.date}</p>
                  </div>
                  <span className={`text-xs font-medium ${item.urgency} whitespace-nowrap`}>
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
           6. CREATE PROJECT CTA
           ══════════════════════════════════════ */}
        <section className={`${glassCard} flex flex-col sm:flex-row items-center gap-6`}>
          {/* Left icon */}
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
            <Sparkles size={28} className="text-blue-400" />
          </div>

          {/* Center text */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white/90 font-semibold text-lg">
              Start a New Project
            </h3>
            <p className="text-white/40 text-sm mt-1">
              Organize your resources, track your progress, and achieve your learning goals faster.
            </p>
          </div>

          {/* Right button */}
          <button className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-medium text-sm shadow-lg transition-all duration-300 cursor-pointer">
            <Plus size={16} />
            Create Project
          </button>
        </section>

        {/* ══════════════════════════════════════
           7. FOOTER
           ══════════════════════════════════════ */}
        <footer className="text-center py-6 border-t border-white/5">
          <p className="text-white/30 text-sm font-medium tracking-wide">
            Momentum — Your Learning, Accelerated.
          </p>
          <p className="text-white/20 text-xs mt-1">
            Keep pushing forward. Every step counts.
          </p>
        </footer>
      </div>
    </div>
  );
}