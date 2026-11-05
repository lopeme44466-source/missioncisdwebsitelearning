import React, { useState } from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';

export default function GpaCalculator() {
  const [courses, setCourses] = useState([
    { id: 1, name: 'AP Biology', grade: 'A', level: 'AP' },
    { id: 2, name: 'Pre-Calculus', grade: 'A', level: 'Honors' },
    { id: 3, name: 'AP US History', grade: 'B', level: 'AP' },
    { id: 4, name: 'English III', grade: 'A', level: 'Regular' },
  ]);

  const GRADE_POINTS = {
    A: 4.0,
    B: 3.0,
    C: 2.0,
    D: 1.0,
    F: 0.0,
  };

  const getWeightedPoints = (grade, level) => {
    const base = GRADE_POINTS[grade] ?? 0;
    if (level === 'AP') return base + 1.0;
    if (level === 'Honors') return base + 0.5;
    return base;
  };

  const unweightedGpa = (
    courses.reduce((sum, c) => sum + (GRADE_POINTS[c.grade] || 0), 0) /
    (courses.length || 1)
  ).toFixed(2);

  const weightedGpa = (
    courses.reduce((sum, c) => sum + getWeightedPoints(c.grade, c.level), 0) /
    (courses.length || 1)
  ).toFixed(2);

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: Date.now(), name: 'New Course', grade: 'A', level: 'Regular' },
    ]);
  };

  const removeCourse = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 max-w-lg mx-auto shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm text-white">High School GPA Calculator</h3>
        </div>
        <button
          onClick={addCourse}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Course
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
        <div>
          <span className="text-[11px] text-slate-400 uppercase">Unweighted GPA</span>
          <p className="text-2xl font-black text-white font-mono">{unweightedGpa}</p>
        </div>
        <div>
          <span className="text-[11px] text-amber-400 uppercase">Weighted GPA</span>
          <p className="text-2xl font-black text-amber-400 font-mono">{weightedGpa}</p>
        </div>
      </div>

      <div className="space-y-2">
        {courses.map((c) => (
          <div key={c.id} className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
            <input
              type="text"
              value={c.name}
              onChange={(e) => {
                const val = e.target.value;
                setCourses((list) => list.map((item) => (item.id === c.id ? { ...item, name: val } : item)));
              }}
              className="flex-1 bg-transparent text-white outline-none font-medium"
            />
            <select
              value={c.grade}
              onChange={(e) => {
                const val = e.target.value;
                setCourses((list) => list.map((item) => (item.id === c.id ? { ...item, grade: val } : item)));
              }}
              className="bg-slate-800 text-white rounded px-2 py-1"
            >
              <option value="A">A (4.0)</option>
              <option value="B">B (3.0)</option>
              <option value="C">C (2.0)</option>
              <option value="D">D (1.0)</option>
              <option value="F">F (0.0)</option>
            </select>
            <select
              value={c.level}
              onChange={(e) => {
                const val = e.target.value;
                setCourses((list) => list.map((item) => (item.id === c.id ? { ...item, level: val } : item)));
              }}
              className="bg-slate-800 text-indigo-300 rounded px-2 py-1"
            >
              <option value="Regular">Regular (+0.0)</option>
              <option value="Honors">Honors (+0.5)</option>
              <option value="AP">AP (+1.0)</option>
            </select>
            <button onClick={() => removeCourse(c.id)} className="text-slate-500 hover:text-red-400 p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
