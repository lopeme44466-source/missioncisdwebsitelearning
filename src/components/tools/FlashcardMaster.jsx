import React, { useState } from 'react';
import { Layers, RotateCcw, ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';

const DEFAULT_DECKS = {
  'sat-vocab': [
    { front: 'Anomalous', back: 'Deviating from what is standard, normal, or expected; irregular.' },
    { front: 'Equivocal', back: 'Open to more than one interpretation; ambiguous; uncertain.' },
    { front: 'Erudite', back: 'Having or showing great knowledge or learning; scholarly.' },
    { front: 'Laconic', back: 'Using very few words; concise to the point of seeming rude.' },
  ],
  'ap-bio': [
    { front: 'ATP Synthase', back: 'Mitochondrial enzyme that uses proton gradient to generate ATP from ADP and Pi.' },
    { front: 'Endosymbiotic Theory', back: 'Mitochondria and chloroplasts originated as symbiotic prokaryotes engulfed by ancestral cells.' },
    { front: 'Epistasis', back: 'Interaction between genes where one gene alters the phenotypic effect of another independent gene.' },
  ],
};

export default function FlashcardMaster() {
  const [deckKey, setDeckKey] = useState('sat-vocab');
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = DEFAULT_DECKS[deckKey];
  const card = cards[cardIdx];

  const nextCard = () => {
    setFlipped(false);
    setCardIdx((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setCardIdx((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 max-w-lg mx-auto shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm text-white">Flashcard Master (Active Recall)</h3>
        </div>
        <select
          value={deckKey}
          onChange={(e) => {
            setDeckKey(e.target.value);
            setCardIdx(0);
            setFlipped(false);
          }}
          className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2 py-1 outline-none"
        >
          <option value="sat-vocab">SAT High-Frequency Vocab</option>
          <option value="ap-bio">AP Biology Essential Terms</option>
        </select>
      </div>

      {/* Card Flapper */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="w-full h-56 rounded-2xl bg-gradient-to-tr from-slate-950 to-indigo-950/40 border border-slate-800 p-6 flex flex-col justify-between cursor-pointer shadow-lg hover:border-indigo-500/40 transition select-none"
      >
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
          {flipped ? 'Definition (Answer)' : 'Term (Prompt)'} • Click to Flip
        </span>

        <div className="my-auto text-center">
          <p className="text-xl font-bold text-white leading-relaxed">
            {flipped ? card.back : card.front}
          </p>
        </div>

        <span className="text-[11px] text-right text-slate-500 font-mono">
          Card {cardIdx + 1} of {cards.length}
        </span>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={prevCard}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={() => setFlipped(!flipped)}
          className="px-4 py-2 bg-indigo-600/30 text-indigo-300 rounded-xl text-xs font-bold border border-indigo-500/30"
        >
          Flip Card
        </button>

        <button
          onClick={nextCard}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
