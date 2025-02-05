import React, { useState } from 'react';
import { ArrowLeft, Code, Eye } from 'lucide-react';

interface PreviewStageProps {
  code: string;
  onBack: () => void;
}

function PreviewStage({ code, onBack }: PreviewStageProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Prompt</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('preview')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              view === 'preview'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setView('code')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              view === 'code'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Code</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {view === 'preview' ? (
          <div className="p-4">
            <div dangerouslySetInnerHTML={{ __html: code }} />
          </div>
        ) : (
          <pre className="p-4 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
            <code className="text-gray-800 dark:text-gray-200">{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

export default PreviewStage;