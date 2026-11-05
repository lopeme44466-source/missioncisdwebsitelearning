import React, { useState } from 'react';
import { BookOpen, Calendar, CheckSquare, Bell, User, ExternalLink, ShieldCheck, Search, Sparkles, GraduationCap } from 'lucide-react';

export default function MissionCisdView({ onExitDisguise }) {
  const [activeTab, setActiveTab] = useState('courses');

  const assignments = [
    { id: 1, course: 'AP Biology (Period 2)', title: 'Unit 4 Cellular Respiration Lab Report', due: 'Tomorrow, 11:59 PM', status: 'In Progress' },
    { id: 2, course: 'Pre-Calculus (Period 3)', title: 'Trigonometric Identities Problem Set 5', due: 'Friday, 3:30 PM', status: 'Assigned' },
    { id: 3, course: 'US History (Period 5)', title: 'Cold War Primary Source DBQ Analysis', due: 'Monday, 8:00 AM', status: 'Pending' },
    { id: 4, course: 'English III (Period 1)', title: 'The Great Gatsby Essay Draft 2', due: 'Next Wednesday', status: 'Assigned' },
  ];

  const announcements = [
    { id: 1, date: 'Today, 8:15 AM', author: 'Principal Office', text: 'Reminder: End of 3rd Six Weeks exams begin next week. Check the schedule in Skyward.' },
    { id: 2, date: 'Yesterday', author: 'Guidance Counseling', text: 'FAFSA and SAT prep workshop available in the library after school on Thursdays.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none">
      {/* Top Banner Header */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white text-blue-900 font-black flex items-center justify-center text-lg shadow-sm border border-blue-200">
              M
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-tight">Mission Consolidated Independent School District</h1>
              <p className="text-xs text-blue-200">Student Portal & Learning Management Suite • MCISD Secure</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs text-blue-200 bg-blue-950/40 px-3 py-1.5 rounded-md border border-blue-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Skyward SSO Connected</span>
            </div>

            {/* Discrete stealth return switch */}
            <button
              onClick={onExitDisguise}
              title="Return to Mateo's Learning Hub (or press Esc)"
              className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 active:scale-95 text-white rounded text-xs font-semibold flex items-center space-x-1.5 border border-blue-600 transition shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Switch Portal</span>
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-blue-950/60 border-t border-blue-800">
          <div className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-4 text-xs font-medium text-blue-100">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-3 border-b-2 transition ${activeTab === 'courses' ? 'border-amber-400 text-white font-bold' : 'border-transparent hover:text-white'}`}
            >
              My Courses & Skyward
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-2 px-3 border-b-2 transition ${activeTab === 'assignments' ? 'border-amber-400 text-white font-bold' : 'border-transparent hover:text-white'}`}
            >
              Assignments & Due Dates
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-2 px-3 border-b-2 transition ${activeTab === 'resources' ? 'border-amber-400 text-white font-bold' : 'border-transparent hover:text-white'}`}
            >
              District Resources
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Courses & Assignments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Welcome, Mateo</h2>
              <p className="text-xs text-slate-500 mt-1">Student ID: #9842103 • Mission High School • Grade 11</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                Attendance: 100%
              </span>
            </div>
          </div>

          {/* Current Classes */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center space-x-2 text-sm">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <span>Enrolled Courses (Fall Term)</span>
              </h3>
              <span className="text-xs text-slate-500">Updated today</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'AP Biology', teacher: 'Dr. Martinez', grade: '96% (A)', room: 'Lab 204' },
                { name: 'Pre-Calculus Honors', teacher: 'Mrs. Hernandez', grade: '94% (A)', room: 'Room 112' },
                { name: 'AP United States History', teacher: 'Mr. Davis', grade: '92% (A)', room: 'Room 305' },
                { name: 'English Language III', teacher: 'Ms. Garcia', grade: '95% (A)', room: 'Room 210' },
                { name: 'Chemistry Prep', teacher: 'Mr. Vance', grade: '98% (A+)', room: 'Lab 108' },
                { name: 'Physics Mechanics', teacher: 'Dr. Chen', grade: '93% (A)', room: 'Room 414' },
              ].map((c, i) => (
                <div key={i} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-xs">{c.name}</h4>
                    <p className="text-[11px] text-slate-500">{c.teacher} • {c.room}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                    {c.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-blue-700" />
              <span>Upcoming Schoolwork & Tests</span>
            </h3>
            <div className="divide-y divide-slate-100">
              {assignments.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-slate-800">{item.title}</p>
                    <p className="text-slate-400 text-[11px]">{item.course} • Due {item.due}</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skyward Quick Links & Announcements */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 mb-3 text-sm">Official MCISD Portals</h3>
            <div className="space-y-2 text-xs">
              <a href="https://www.mcisd.net" target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 rounded bg-slate-50 hover:bg-blue-50 text-blue-900 font-medium border border-slate-200">
                <span>District Home (mcisd.net)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 text-slate-700 font-medium border border-slate-200">
                <span>Skyward Family & Student Access</span>
                <span className="text-[10px] text-emerald-600 font-bold">Authorized</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 text-slate-700 font-medium border border-slate-200">
                <span>Google Classroom Sync</span>
                <span className="text-[10px] text-emerald-600 font-bold">Connected</span>
              </div>
            </div>
          </div>

          {/* District Bulletin */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center space-x-2">
              <Bell className="w-4 h-4 text-blue-700" />
              <span>District Announcements</span>
            </h3>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="text-xs border-l-2 border-blue-700 pl-3 py-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                    <span className="font-semibold text-slate-600">{a.author}</span>
                    <span>{a.date}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{a.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stealth Switcher Helper */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
            <p className="font-bold mb-1">Stealth Disguise Active</p>
            <p className="text-blue-700 text-[11px] leading-relaxed mb-3">
              This screen looks 100% like your official school portal. When you want to return to your games, camera exam solver, and apps, click below or press the <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded font-mono text-[10px] shadow-2xs">Esc</kbd> key.
            </p>
            <button
              onClick={onExitDisguise}
              className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 cursor-pointer shadow-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Back to Mateo's Learning & Games</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-[11px] text-slate-500">
        © {new Date().getFullYear()} Mission Consolidated Independent School District • All Rights Reserved
      </footer>
    </div>
  );
}
