import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import DisclaimerBanner from './components/DisclaimerBanner';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  function handleTopicSelect(prompt: string, topicId: string) {
    setActiveTopic(topicId);
    setPendingPrompt(prompt);
    setSidebarOpen(false);
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Header onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <DisclaimerBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onTopicSelect={handleTopicSelect}
          activeTopic={activeTopic}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-hidden">
          <ChatWindow
            pendingPrompt={pendingPrompt}
            onPromptConsumed={() => setPendingPrompt(null)}
          />
        </main>
      </div>
    </div>
  );
}
