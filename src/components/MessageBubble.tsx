import { ShieldPlus, User } from 'lucide-react';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  message: Message;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex items-start gap-3 px-4 py-2 justify-end">
        <div className="max-w-[78%] flex flex-col items-end gap-1">
          <div className="bg-teal-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <span className="text-xs text-slate-400">{formatTime(message.timestamp)}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 shadow-sm">
          <User size={15} className="text-slate-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 px-4 py-2">
      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
        <ShieldPlus size={16} className="text-white" />
      </div>
      <div className="max-w-[82%] flex flex-col gap-1">
        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <MarkdownRenderer content={message.content} />
        </div>
        <span className="text-xs text-slate-400 ml-1">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}
