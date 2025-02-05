import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface PromptStageProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
}

function PromptStage({ onSubmit, loading }: PromptStageProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Build Your Dream Website with AI
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Describe your website and let ZOA bring your vision to life with modern, 
          responsive code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your website (e.g., 'Create a modern landing page for a coffee shop with a hero section, menu, and contact form')"
            className="w-full h-40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 resize-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="absolute bottom-4 right-4 bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Modern Tech Stack',
              description: 'Uses latest frameworks and libraries for optimal performance'
            },
            {
              title: 'Instant Preview',
              description: 'See your website come to life in real-time'
            },
            {
              title: 'Code Export',
              description: 'Download production-ready code for your website'
            }
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PromptStage;