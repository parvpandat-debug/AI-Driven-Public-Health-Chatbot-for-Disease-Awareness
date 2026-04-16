import { useRef, useEffect, useState } from 'react';
import { Send, Stethoscope, RotateCcw, ShieldPlus } from 'lucide-react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SymptomCheckerGuide from './SymptomCheckerGuide';
import { getAIResponse } from '../services/aiService';
import { greetingResponses } from '../data/knowledgeBase';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  content: greetingResponses[0],
  timestamp: new Date(),
};

interface Props {
  pendingPrompt: string | null;
  onPromptConsumed: () => void;
}

export default function ChatWindow({ pendingPrompt, onPromptConsumed }: Props) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSymptomChecker, setShowSymptomChecker] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (pendingPrompt) {
      sendMessage(pendingPrompt);
      onPromptConsumed();
    }
  }, [pendingPrompt]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowSymptomChecker(false);

    try {
      const response = await getAIResponse(trimmed);
      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'I encountered an issue retrieving that information. Please try again or rephrase your question.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleReset() {
    setMessages([{ ...INITIAL_MESSAGE, timestamp: new Date() }]);
    setShowSymptomChecker(true);
    setInput('');
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-slate-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center">
              <ShieldPlus size={18} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Health Shield AI</p>
            <p className="text-xs text-emerald-600 font-medium">Online &bull; Responds instantly</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSymptomChecker(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-100"
          >
            <Stethoscope size={13} />
            Symptom Checker
          </button>
          <button
            onClick={handleReset}
            title="New conversation"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-2">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}

        {showSymptomChecker && !isTyping && messages.length <= 1 && (
          <SymptomCheckerGuide
            onSelect={sendMessage}
            onDismiss={() => setShowSymptomChecker(false)}
          />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-100 px-4 py-3 shrink-0">
        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 focus-within:border-teal-400 focus-within:bg-white transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about symptoms, conditions, or health topics..."
            rows={1}
            disabled={isTyping}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-800 placeholder:text-slate-400 max-h-28 leading-relaxed disabled:opacity-50"
            style={{ minHeight: '24px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 112)}px`;
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors shrink-0 mb-0.5"
          >
            <Send size={14} className={input.trim() && !isTyping ? 'text-white' : 'text-slate-400'} />
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
          Press <span className="font-medium">Enter</span> to send &bull; <span className="font-medium">Shift+Enter</span> for new line
        </p>
      </div>
    </div>
  );
}
