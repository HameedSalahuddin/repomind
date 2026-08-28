'use client';

import { useState } from 'react';
import { QnaResponse } from '@/types';

interface QnaViewProps {
  initialData: QnaResponse;
}

export default function QnaView({ initialData }: QnaViewProps) {
  const [userQuery, setUserQuery] = useState('');
  const [history, setHistory] = useState<Array<{
    question: string;
    answer: string;
    citations: QnaResponse['citations'];
  }>>([]);

  const handleSend = (queryToSend?: string) => {
    const query = queryToSend || userQuery;
    if (!query.trim()) return;

    setHistory((prev) => [
      ...prev,
      {
        question: query,
        answer: initialData.answer,
        citations: initialData.citations,
      }
    ]);
    setUserQuery('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-bold text-[#E6E8EC] tracking-tight">Ask AI</h1>
        <p className="text-xs text-[#8B929E]">Query architecture, implementation details, and code flow.</p>
      </div>

      {/* Primary Element: Question Input */}
      <div className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-1.5 rounded-lg bg-[#0E1014] border border-[#1E222A] focus-within:border-[#8B5CF6] transition-colors"
        >
          <span className="material-symbols-outlined text-[#8B929E] text-[18px] ml-2">search</span>
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ask a question about this repository..."
            className="flex-1 bg-transparent text-xs text-[#E6E8EC] placeholder-[#5A606C] focus:outline-none px-2 py-1.5"
          />
          <button
            type="submit"
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded text-xs font-semibold transition-colors"
          >
            Ask
          </button>
        </form>

        {/* Suggested Questions */}
        {history.length === 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#5A606C]">Suggested Questions</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSend('How does authentication work in this repository?')}
                className="text-xs text-[#8B929E] hover:text-[#E6E8EC] bg-[#0E1014] hover:bg-[#14171D] px-3 py-1.5 rounded border border-[#1E222A] transition-colors"
              >
                How does authentication work?
              </button>
              <button
                onClick={() => handleSend('Where are the database models and schemas located?')}
                className="text-xs text-[#8B929E] hover:text-[#E6E8EC] bg-[#0E1014] hover:bg-[#14171D] px-3 py-1.5 rounded border border-[#1E222A] transition-colors"
              >
                Where are the database schemas located?
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Answer Thread with Evidence / Sources */}
      <div className="space-y-6">
        {history.map((item, idx) => (
          <div key={idx} className="p-6 rounded-lg bg-[#0E1014] border border-[#1E222A] space-y-4">
            <div className="text-xs font-semibold text-[#8B5CF6]">Q: {item.question}</div>

            <p className="text-xs text-[#8B929E] leading-relaxed">
              {item.answer}
            </p>

            {/* Evidence & Sources */}
            {item.citations && item.citations.length > 0 && (
              <div className="pt-3 border-t border-[#1E222A] space-y-2">
                <span className="text-[10px] font-mono text-[#5A606C] uppercase">Evidence & Sources</span>
                <div className="space-y-1 font-mono text-xs text-[#8B929E]">
                  {item.citations.map((cite, cIdx) => (
                    <div key={cIdx} className="p-2 rounded bg-[#14171D] border border-[#1E222A] flex justify-between">
                      <span>{cite.path || cite.sha} {cite.lines && `(Lines ${cite.lines.join('-')})`}</span>
                      <span className="text-[10px] text-[#5A606C]">{cite.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
