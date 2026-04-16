import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import DisclaimerBanner from './components/DisclaimerBanner';

export default function App() {
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  function handleTopicSelect(prompt: string, topicId: string) {
    setActiveTopic(topicId);
    setPendingPrompt(prompt);
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Header />
      <DisclaimerBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onTopicSelect={handleTopicSelect}
          activeTopic={activeTopic}
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
