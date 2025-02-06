import { useEffect, useState } from 'react';
import { ArrowLeft, Code, Eye, Loader2 } from 'lucide-react';

interface PreviewStageProps {
  ws: WebSocket | null;
  onBack: () => void;
}

function PreviewStage({ ws, onBack }: PreviewStageProps) {
  const [view, setView] = useState<'preview' | 'code'>('code');
  const [generatedCode, setGeneratedCode] = useState('');
  const [generationCompleted, setGenerationCompleted] = useState(false);

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.html) {
        setGeneratedCode((prev) => data.html);
      }
      if (data.completed) {
        setGenerationCompleted(true);
        setView('preview');
      }
    };

    return () => {
      ws.onmessage = null;
    };
  }, [ws]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Prompt</span>
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('code')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              view === 'code'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Code</span>
          </button>
          <button
            onClick={() => setView('preview')}
            disabled={!generationCompleted}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              view === 'preview'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            } ${!generationCompleted && 'opacity-50 cursor-not-allowed'}`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        {!generationCompleted && (
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating code...</span>
            <br /><br />
          </div>
        )}
        {view === 'preview' ? (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: generatedCode }}
          />
        ) : (
          <pre className="language-html overflow-auto max-h-[600px] p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <code>{generatedCode}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

export default PreviewStage;