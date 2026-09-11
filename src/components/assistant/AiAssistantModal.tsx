import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Building2, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../lib/api.js';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  suggestedActions?: { label: string; tab: string }[];
  timestamp: string;
}

const SUGGESTED_QUERIES = [
  'What approvals do I need to start a manufacturing unit?',
  'Why do I need a Fire NOC for my factory?',
  'What documents are currently missing or expiring?',
  'When is my next statutory renewal due?',
  'Which government schemes and capital subsidies am I eligible for?',
  'How does the Risk Scoring Engine calculate my score?',
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { business } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Hello! I am your Intelligent Regulatory AI Advisor. I have context on your registered entity **${
        business?.name || 'NovaTech Manufacturing'
      }** (${business?.sector || 'Automotive & Electric Vehicle'}, ${business?.location?.state || 'Tamil Nadu'}). How can I assist your compliance journey today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSend) setInputQuery('');
    setLoading(true);

    try {
      const response = await api.assistant.chat(query, business?.id);
      const assistantMsg: Message = {
        sender: 'assistant',
        text: response.answer || response.text || 'Information retrieved.',
        suggestedActions: response.suggestedActions || [
          { label: 'View Checklist', tab: 'checklist' },
          { label: 'Check Documents', tab: 'documents' },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `Regulatory Engine query: ${err.message}. Please verify your network connection.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="flex flex-col w-full max-w-2xl h-[640px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">Regulatory AI Advisor</h3>
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-400 text-emerald-950 uppercase tracking-wider">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-blue-100 font-medium">
                Grounded in State & Central Compliance Laws
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Query Suggestion Pills */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Frequently Asked:
            </span>
          </div>
          <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
            {SUGGESTED_QUERIES.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(sq)}
                className="shrink-0 px-2.5 py-1 text-[11px] font-medium rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Message Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-900/40">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line prose prose-sm dark:prose-invert">
                  {m.text}
                </div>

                {/* Suggested Action Links */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-2">
                    {m.suggestedActions.map((action, ai) => (
                      <button
                        key={ai}
                        onClick={() => {
                          onNavigateTab(action.tab);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                      >
                        {action.label}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 text-xs text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Synthesizing statutory regulatory guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask any statutory question (e.g. 'What is CTE vs CTO?', 'Renewals')..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
