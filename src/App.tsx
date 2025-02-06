import { useState, useEffect, useRef } from 'react';
import { Bot, Code2, Moon, Sun } from 'lucide-react';
import PromptStage from './components/PromptStage';
import PreviewStage from './components/PreviewStage';
import { generateWebsite, getCsrfToken, getBaseSocketUrl } from './utils/api';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<'prompt' | 'preview'>('prompt');
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    async function initializeConnection() {
      if (initialized.current) return;
      initialized.current = true;

      try {
        const token = await getCsrfToken();
        setCsrfToken(token);

        const socket = new WebSocket(`${getBaseSocketUrl()}?csrfToken=${token}`);
        
        socket.onopen = () => {
          console.log('✅ WebSocket bağlantısı açıldı');
          setWs(socket);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.error) {
              setError(data.error);
              setStage('prompt');
            }
          } catch (error) {
            console.error('WebSocket message parse error:', error);
          }
        };

        socket.onerror = (error) => {
          console.error('⚠️ WebSocket Hatası:', error);
          setError('WebSocket connection error occurred');
        };

        socket.onclose = () => {
          console.log('❌ WebSocket bağlantısı kapandı');
          setWs(null);
        };

      } catch (error) {
        console.error('Connection initialization failed:', error);
        setError('Failed to initialize connection. Please refresh the page.');
      }
    }
    
    initializeConnection();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handlePromptSubmit = async (prompt: string) => {
    if (!csrfToken || !ws || ws.readyState !== WebSocket.OPEN) {
      setError('❌ Connection not available. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError(null);
    setStage('preview');

    try {
      await generateWebsite(prompt, csrfToken);
      ws.send(JSON.stringify(prompt));
    } catch (error) {
      console.error('Error generating code:', error);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      setStage('prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-200">
        <nav className="border-b bg-white/50 dark:bg-gray-900/50 dark:border-gray-800 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                ZOA
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <Code2 className="w-4 h-4" />
                <span>Web Builder</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}
            {stage === 'prompt' ? (
            <PromptStage onSubmit={handlePromptSubmit} loading={loading} />
            ) : (
            <PreviewStage ws={ws} onBack={() => window.location.reload()} />
            // PreviewStage ws={ws} onBack={() => setStage('prompt')} />
            )}
        </main>

        <footer className="border-t bg-white/50 dark:bg-gray-900/50 dark:border-gray-800 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              &copy; 2025 <span className="font-bold hover:underline">ZOA</span>
              . All rights reserved. Developed by{' '}
              <a
                href="https://osmankoc.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:underline"
              >
                Osman Koç
              </a>
              .
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;