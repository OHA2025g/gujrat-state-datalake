import React, { useEffect, useRef, useState } from 'react';
import * as Icons from 'lucide-react';
import api from '../../lib/api';
import { COPILOT } from '../../constants/testIds';

export const CopilotDrawer = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste 🙏 I am the GCSR AI Copilot. Ask me about districts, families, welfare leakage, scheme saturation, or data quality across Gujarat.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open) {
      api.get('/copilot/suggestions').then((r) => setSuggestions(r.data.suggestions || [])).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text) => {
    const prompt = (text ?? input).trim();
    if (!prompt || loading) return;
    setInput('');
    const nextHistory = [...messages, { role: 'user', content: prompt }];
    setMessages(nextHistory);
    setLoading(true);
    try {
      const history = nextHistory
        .filter((m, i) => i > 0)
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));
      const r = await api.post('/copilot/chat', { prompt, history: history.slice(0, -1) });
      setMessages((prev) => [...prev, { role: 'assistant', content: r.data.answer }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ Copilot request failed. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" data-testid={COPILOT.panel}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md">
            <Icons.Sparkles size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-heading font-semibold text-slate-900 text-[15px] leading-tight">GCSR AI Copilot</div>
            <div className="text-[11px] text-slate-500">Powered by Mistral · Advisory only</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500">
            <Icons.X size={16} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} data-testid={COPILOT.msg(i)} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-slate-900 text-white rounded-br-sm'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm inline-flex items-center gap-1.5 text-slate-500 text-[13px]">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                <span className="ml-1 text-[11.5px]">Analyzing 6.4Cr records…</span>
              </div>
            </div>
          )}
        </div>

        {suggestions.length > 0 && messages.length < 3 && (
          <div className="px-4 py-2 border-t border-slate-100 flex flex-wrap gap-1.5 bg-white">
            {suggestions.slice(0, 4).map((s, i) => (
              <button
                key={i}
                data-testid={COPILOT.suggest(i)}
                onClick={() => send(s)}
                className="text-[11.5px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="p-3 border-t border-slate-100 bg-white flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            rows={2}
            placeholder="Ask about DBT leakage, family duplicates, scheme saturation…"
            data-testid={COPILOT.input}
            className="flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            data-testid={COPILOT.send}
            className="h-10 px-3.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
          >
            <Icons.Send size={14} />
          </button>
        </div>
      </aside>
    </div>
  );
};

export default CopilotDrawer;
