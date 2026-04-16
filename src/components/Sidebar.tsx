import { Heart, Brain, Thermometer, Activity, Leaf, Moon, Wind, Droplets } from 'lucide-react';
import { HealthTopic } from '../types';

const healthTopics: HealthTopic[] = [
  {
    id: 'flu',
    title: 'Flu & Influenza',
    icon: 'Thermometer',
    description: 'Symptoms, prevention & treatment',
    prompt: 'Tell me about the flu (influenza): symptoms, prevention, and treatment.',
  },
  {
    id: 'diabetes',
    title: 'Diabetes',
    icon: 'Droplets',
    description: 'Type 1, Type 2 & management',
    prompt: 'Tell me about diabetes: types, symptoms, and management.',
  },
  {
    id: 'mental-health',
    title: 'Mental Health',
    icon: 'Brain',
    description: 'Anxiety, depression & wellness',
    prompt: 'Tell me about mental health conditions like anxiety and depression.',
  },
  {
    id: 'heart',
    title: 'Heart Disease',
    icon: 'Heart',
    description: 'Cardiovascular health & prevention',
    prompt: 'Tell me about heart disease: symptoms, risk factors, and prevention.',
  },
  {
    id: 'covid',
    title: 'COVID-19',
    icon: 'Activity',
    description: 'Symptoms, variants & vaccines',
    prompt: 'Tell me about COVID-19: current symptoms, prevention, and treatment.',
  },
  {
    id: 'nutrition',
    title: 'Nutrition & Diet',
    icon: 'Leaf',
    description: 'Healthy eating guidelines',
    prompt: 'Give me information about healthy nutrition and diet.',
  },
  {
    id: 'allergies',
    title: 'Allergies',
    icon: 'Wind',
    description: 'Types, triggers & management',
    prompt: 'Tell me about allergies: common types, symptoms, and treatment.',
  },
  {
    id: 'sleep',
    title: 'Sleep Health',
    icon: 'Moon',
    description: 'Insomnia, sleep apnea & tips',
    prompt: 'Tell me about sleep health: how much sleep do I need and how to improve it?',
  },
];

const iconMap: Record<string, React.ReactNode> = {
  Thermometer: <Thermometer size={16} />,
  Droplets: <Droplets size={16} />,
  Brain: <Brain size={16} />,
  Heart: <Heart size={16} />,
  Activity: <Activity size={16} />,
  Leaf: <Leaf size={16} />,
  Wind: <Wind size={16} />,
  Moon: <Moon size={16} />,
};

interface Props {
  onTopicSelect: (prompt: string, topicId: string) => void;
  activeTopic: string | null;
}

export default function Sidebar({ onTopicSelect, activeTopic }: Props) {
  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-5 pb-3 border-b border-slate-100">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Common Health Topics</h2>
        <p className="text-xs text-slate-400 mt-1">Click a topic to start a conversation</p>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2">
        {healthTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicSelect(topic.prompt, topic.id)}
            className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all duration-150 group flex items-start gap-3 ${
              activeTopic === topic.id
                ? 'bg-teal-50 border border-teal-200'
                : 'hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              activeTopic === topic.id
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-600'
            }`}>
              {iconMap[topic.icon]}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-medium leading-tight ${activeTopic === topic.id ? 'text-teal-800' : 'text-slate-700'}`}>
                {topic.title}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 leading-tight">{topic.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="bg-teal-600 rounded-xl p-3 text-white">
          <p className="text-xs font-semibold mb-1">Emergency?</p>
          <p className="text-xs text-teal-100 leading-relaxed">
            For medical emergencies, call <span className="font-bold text-white">911</span> immediately.
          </p>
          <p className="text-xs text-teal-100 mt-1">
            Crisis Lifeline: <span className="font-bold text-white">988</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
