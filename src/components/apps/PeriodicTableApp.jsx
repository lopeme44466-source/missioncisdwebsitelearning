import React, { useState } from 'react';
import {
  Search,
  Calculator,
  Sparkles,
  Info,
  Layers,
  FlaskConical,
  CheckCircle,
} from 'lucide-react';
import { openAboutBlankCloak } from '../../utils/cloak';

// Key Elements dataset for fast chemistry exam solving
const ELEMENTS = [
  { num: 1, sym: 'H', name: 'Hydrogen', mass: 1.008, cat: 'nonmetal', period: 1, group: 1, val: 1 },
  { num: 2, sym: 'He', name: 'Helium', mass: 4.003, cat: 'noble', period: 1, group: 18, val: 0 },
  { num: 3, sym: 'Li', name: 'Lithium', mass: 6.94, cat: 'alkali', period: 2, group: 1, val: 1 },
  { num: 4, sym: 'Be', name: 'Beryllium', mass: 9.012, cat: 'alkaline', period: 2, group: 2, val: 2 },
  { num: 5, sym: 'B', name: 'Boron', mass: 10.81, cat: 'metalloid', period: 2, group: 13, val: 3 },
  { num: 6, sym: 'C', name: 'Carbon', mass: 12.011, cat: 'nonmetal', period: 2, group: 14, val: 4 },
  { num: 7, sym: 'N', name: 'Nitrogen', mass: 14.007, cat: 'nonmetal', period: 2, group: 15, val: 5 },
  { num: 8, sym: 'O', name: 'Oxygen', mass: 15.999, cat: 'nonmetal', period: 2, group: 16, val: 6 },
  { num: 9, sym: 'F', name: 'Fluorine', mass: 18.998, cat: 'halogen', period: 2, group: 17, val: 7 },
  { num: 10, sym: 'Ne', name: 'Neon', mass: 20.180, cat: 'noble', period: 2, group: 18, val: 8 },
  { num: 11, sym: 'Na', name: 'Sodium', mass: 22.990, cat: 'alkali', period: 3, group: 1, val: 1 },
  { num: 12, sym: 'Mg', name: 'Magnesium', mass: 24.305, cat: 'alkaline', period: 3, group: 2, val: 2 },
  { num: 13, sym: 'Al', name: 'Aluminum', mass: 26.982, cat: 'post-transition', period: 3, group: 13, val: 3 },
  { num: 14, sym: 'Si', name: 'Silicon', mass: 28.085, cat: 'metalloid', period: 3, group: 14, val: 4 },
  { num: 15, sym: 'P', name: 'Phosphorus', mass: 30.974, cat: 'nonmetal', period: 3, group: 15, val: 5 },
  { num: 16, sym: 'S', name: 'Sulfur', mass: 32.06, cat: 'nonmetal', period: 3, group: 16, val: 6 },
  { num: 17, sym: 'Cl', name: 'Chlorine', mass: 35.45, cat: 'halogen', period: 3, group: 17, val: 7 },
  { num: 18, sym: 'Ar', name: 'Argon', mass: 39.948, cat: 'noble', period: 3, group: 18, val: 8 },
  { num: 19, sym: 'K', name: 'Potassium', mass: 39.098, cat: 'alkali', period: 4, group: 1, val: 1 },
  { num: 20, sym: 'Ca', name: 'Calcium', mass: 40.078, cat: 'alkaline', period: 4, group: 2, val: 2 },
  { num: 26, sym: 'Fe', name: 'Iron', mass: 55.845, cat: 'transition', period: 4, group: 8, val: 2 },
  { num: 29, sym: 'Cu', name: 'Copper', mass: 63.546, cat: 'transition', period: 4, group: 11, val: 2 },
  { num: 30, sym: 'Zn', name: 'Zinc', mass: 65.38, cat: 'transition', period: 4, group: 12, val: 2 },
  { num: 35, sym: 'Br', name: 'Bromine', mass: 79.904, cat: 'halogen', period: 4, group: 17, val: 7 },
  { num: 47, sym: 'Ag', name: 'Silver', mass: 107.87, cat: 'transition', period: 5, group: 11, val: 1 },
  { num: 53, sym: 'I', name: 'Iodine', mass: 126.90, cat: 'halogen', period: 5, group: 17, val: 7 },
  { num: 79, sym: 'Au', name: 'Gold', mass: 196.97, cat: 'transition', period: 6, group: 11, val: 3 },
  { num: 80, sym: 'Hg', name: 'Mercury', mass: 200.59, cat: 'transition', period: 6, group: 12, val: 2 },
  { num: 82, sym: 'Pb', name: 'Lead', mass: 207.2, cat: 'post-transition', period: 6, group: 14, val: 4 },
  { num: 92, sym: 'U', name: 'Uranium', mass: 238.03, cat: 'actinide', period: 7, group: 3, val: 6 },
];

const CATEGORY_COLORS = {
  alkali: 'bg-red-500/20 text-red-300 border-red-500/40',
  alkaline: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  transition: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  'post-transition': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  metalloid: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  nonmetal: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  halogen: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  noble: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  actinide: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
};

// Common compound solver formulas
const POPULAR_COMPOUNDS = [
  'H2O',
  'NaCl',
  'CO2',
  'C6H12O6',
  'CaCO3',
  'H2SO4',
  'CH4',
  'NH3',
  'Fe2O3',
];

export default function PeriodicTableApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState(ELEMENTS[0]);
  const [compoundInput, setCompoundInput] = useState('C6H12O6');
  const [compoundResult, setCompoundResult] = useState(null);
  const [compoundGrams, setCompoundGrams] = useState('100');

  // Simple parser for chemical formula e.g. C6H12O6 or NaCl
  const calculateCompound = (formula) => {
    try {
      const regex = /([A-Z][a-z]*)(\d*)/g;
      let match;
      let totalMass = 0;
      const breakdown = [];

      while ((match = regex.exec(formula)) !== null) {
        if (!match[1]) continue;
        const sym = match[1];
        const count = match[2] ? parseInt(match[2], 10) : 1;
        const elem = ELEMENTS.find((e) => e.sym === sym);
        if (!elem) {
          throw new Error(`Element ${sym} not found in database`);
        }
        const mass = elem.mass * count;
        totalMass += mass;
        breakdown.push({
          element: elem.name,
          symbol: elem.sym,
          count,
          unitMass: elem.mass,
          totalMass: mass,
        });
      }

      if (totalMass === 0) return null;

      // Add percentage
      const finalBreakdown = breakdown.map((b) => ({
        ...b,
        percentage: ((b.totalMass / totalMass) * 100).toFixed(2),
      }));

      return {
        formula,
        molarMass: totalMass.toFixed(3),
        elements: finalBreakdown,
      };
    } catch (err) {
      return null;
    }
  };

  const handleCalculateMolarMass = (e) => {
    if (e) e.preventDefault();
    const res = calculateCompound(compoundInput.trim());
    setCompoundResult(res);
  };

  const filteredElements = ELEMENTS.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.sym.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Interactive Periodic Table & Molar Mass Solver</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold uppercase">
                Chemistry Exam Suite
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Instant atomic mass lookup, electron counts, and automated compound stoichiometry solver
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAboutBlankCloak(window.location.href, 'mission-cisd')}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open in about:blank</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Periodic Table Grid & Search (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search element by name or symbol (e.g. C, Gold, Iron)..."
                className="w-full bg-slate-900 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Elements Tiles Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {filteredElements.map((el) => {
              const isSelected = selectedElement.num === el.num;
              const colorClass = CATEGORY_COLORS[el.cat] || 'bg-slate-800 text-slate-200 border-slate-700';
              return (
                <button
                  key={el.num}
                  onClick={() => setSelectedElement(el)}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between aspect-square group ${
                    isSelected ? 'ring-2 ring-white scale-105 shadow-md' : 'hover:scale-102'
                  } ${colorClass}`}
                >
                  <div className="flex justify-between items-start text-[10px] opacity-75">
                    <span>{el.num}</span>
                    <span className="font-mono text-[9px]">{el.mass.toFixed(1)}</span>
                  </div>
                  <div className="text-center my-auto">
                    <span className="text-xl font-black block leading-none">{el.sym}</span>
                    <span className="text-[10px] font-medium truncate block mt-0.5">{el.name}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Element Detailed Card */}
          {selectedElement && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center font-bold ${
                  CATEGORY_COLORS[selectedElement.cat]
                }`}>
                  <span className="text-xs">{selectedElement.num}</span>
                  <span className="text-xl leading-none font-black">{selectedElement.sym}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedElement.name}</h3>
                  <p className="text-xs text-slate-400">
                    Category: <span className="capitalize text-indigo-400 font-semibold">{selectedElement.cat}</span> • Period {selectedElement.period}, Group {selectedElement.group}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <p className="text-slate-400">Atomic Mass:</p>
                <p className="text-sm font-mono font-bold text-white">{selectedElement.mass} g/mol</p>
                <p className="text-[11px] text-emerald-400 font-medium">Valence: {selectedElement.val} e⁻</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Automated Chemical Molar Mass Solver (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-bold text-sm text-white">Molar Mass Compound Solver</h3>
                <p className="text-xs text-slate-400">Essential for AP Chem stoichiometry exams</p>
              </div>
            </div>

            <form onSubmit={handleCalculateMolarMass} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Chemical Formula
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={compoundInput}
                    onChange={(e) => setCompoundInput(e.target.value)}
                    placeholder="e.g. C6H12O6, H2O, CaCO3, NaCl..."
                    className="flex-1 bg-slate-950 font-mono text-xs px-3 py-2 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Calculate
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_COMPOUNDS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCompoundInput(c);
                      const res = calculateCompound(c);
                      setCompoundResult(res);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-mono transition cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </form>

            {/* Compound Calculation Breakdown */}
            {compoundResult ? (
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Total Molar Mass:</span>
                  <span className="text-base font-mono font-black text-emerald-400">
                    {compoundResult.molarMass} g/mol
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Mass Percent Breakdown:
                  </span>
                  {compoundResult.elements.map((el, i) => (
                    <div key={i} className="text-xs bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">{el.symbol}</span>
                        <span className="text-slate-400 text-[11px]"> ({el.element} × {el.count})</span>
                      </div>
                      <div className="text-right font-mono text-[11px]">
                        <span className="text-slate-300 mr-2">{el.totalMass.toFixed(2)} g</span>
                        <span className="text-indigo-400 font-bold">{el.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gram to Mole quick calculator */}
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Convert Grams to Moles:</span>
                    <input
                      type="number"
                      value={compoundGrams}
                      onChange={(e) => setCompoundGrams(e.target.value)}
                      className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-white text-xs"
                    />
                    <span className="text-slate-400">g</span>
                  </div>
                  <div className="pt-1 text-right font-mono text-emerald-400 font-bold">
                    = {(parseFloat(compoundGrams || 0) / parseFloat(compoundResult.molarMass)).toFixed(4)} moles
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-4 text-xs text-slate-500">
                Click "Calculate" or select a common compound above to inspect stoichiometry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
