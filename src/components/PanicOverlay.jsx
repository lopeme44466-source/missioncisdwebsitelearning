import React from 'react';
import { ShieldAlert, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

export default function PanicOverlay({ onRestore, onSwitchToMission }) {
  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-800 flex flex-col font-sans select-none">
      {/* Google Docs simulation toolbar */}
      <header className="border-b border-slate-200 px-4 py-2 flex items-center justify-between bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            ≡
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm text-slate-800">Mission CISD - AP Biology Notes (Cellular Respiration)</span>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Saved to Drive</span>
            </div>
            <div className="flex space-x-3 text-xs text-slate-500 mt-0.5">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Insert</span>
              <span>Format</span>
              <span>Tools</span>
              <span>Help</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSwitchToMission}
            className="text-xs px-3 py-1.5 bg-blue-900 text-white rounded font-medium hover:bg-blue-800 transition cursor-pointer"
          >
            Go to Mission CISD Portal
          </button>
          <button
            onClick={onRestore}
            className="text-xs px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium transition cursor-pointer"
          >
            Resume Learning
          </button>
        </div>
      </header>

      {/* Google Doc Page body */}
      <main className="flex-1 overflow-y-auto bg-slate-100 p-6 flex justify-center">
        <div className="w-full max-w-3xl bg-white min-h-[900px] shadow-md border border-slate-200 p-12 text-slate-800 space-y-4">
          <h1 className="text-2xl font-serif font-bold border-b pb-2 text-slate-900">
            AP Biology: Unit 3 - Cellular Energetics & Respiration
          </h1>
          <p className="text-xs text-slate-500">Author: Mateo • Mission CISD High School • Period 2</p>
          
          <h2 className="text-base font-serif font-bold text-slate-800 pt-2">I. Overview of Cellular Respiration</h2>
          <p className="text-sm font-serif leading-relaxed text-slate-700">
            Cellular respiration is the catabolic pathway of ATP production in which glucose is oxidized into carbon dioxide and oxygen is reduced into water. The general balanced formula is:
            <br />
            <code className="text-xs font-mono bg-slate-50 px-2 py-1 rounded block my-1">
              C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + ~30-32 ATP + heat
            </code>
          </p>

          <h2 className="text-base font-serif font-bold text-slate-800 pt-2">II. Key Stages of Respiration</h2>
          <ul className="text-sm font-serif list-disc pl-6 space-y-1 text-slate-700">
            <li><strong>Glycolysis</strong>: Occurs in cytoplasm; anaerobic. Produces 2 net ATP and 2 NADH.</li>
            <li><strong>Pyruvate Oxidation</strong>: Moves into mitochondrial matrix; converts pyruvate to Acetyl-CoA.</li>
            <li><strong>Citric Acid (Krebs) Cycle</strong>: Matrix; yields 2 ATP, 6 NADH, 2 FADH₂, and 4 CO₂.</li>
            <li><strong>Oxidative Phosphorylation & ETC</strong>: Inner mitochondrial membrane; chemiosmotic gradient powers ATP synthase.</li>
          </ul>

          <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
            <span>Page 1 of 4 • Normal text • Times New Roman 12pt</span>
            <button
              onClick={onRestore}
              className="text-blue-600 hover:underline flex items-center space-x-1 cursor-pointer font-medium"
            >
              <span>Back to Mateo's Applet (Click or press Esc)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
