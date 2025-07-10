import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const [pingTime, setPingTime] = useState(200);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [completedTime, setCompletedTime] = useState(0);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const handleSimulate = () => {
    // Reset all states immediately
    setIsSimulating(true);
    setProgress(0);
    setShowResult(false);
    
    // Store the current ping time for the completion message
    setCompletedTime(pingTime);
    
    // Use setTimeout to ensure state updates are processed before starting timer
    setTimeout(() => {
      const startTime = Date.now();
      const interval = 10; 
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / pingTime) * 100, 100);
        setProgress(newProgress);
        
        if (elapsed >= pingTime) {
          clearInterval(timer);
          setIsSimulating(false);
          setShowResult(true);
          setTimerRef(null);
        }
      }, interval);
      
      setTimerRef(timer);
    }, 0);
  };

  const handleStop = () => {
    if (timerRef) {
      clearInterval(timerRef);
      setTimerRef(null);
    }
    setIsSimulating(false);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <ThemeToggle />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        <div className="rounded-lg shadow-md p-6 sm:p-12 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
            Ping Simulator
          </h2>
          
          <div className="space-y-6 sm:space-y-8">
            {/* Input Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <label htmlFor="pingTime" className="text-base sm:text-lg font-medium transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                Ping Time (ms):
              </label>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <input
                  id="pingTime"
                  type="number"
                  value={pingTime}
                  onChange={(e) => setPingTime(parseInt(e.target.value, 10) || 0)}
                  className="border rounded-md px-3 sm:px-4 py-2 sm:py-3 w-full sm:w-32 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  min="1"
                  max="10000"
                  disabled={isSimulating}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-base sm:text-lg font-medium flex-1 sm:flex-none"
                  >
                    {isSimulating ? 'Simulating...' : 'Simulate'}
                  </button>
                  {isSimulating && (
                    <button
                      onClick={handleStop}
                      className="bg-red-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-red-700 transition-colors text-base sm:text-lg font-medium flex-1 sm:flex-none"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-sm sm:text-base transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                <span>0ms</span>
                <span>{pingTime}ms</span>
              </div>
              <div className="w-full rounded-full h-4 sm:h-6 overflow-hidden transition-colors duration-200" style={{ backgroundColor: 'var(--border-color)' }}>
                <div
                  className="bg-blue-600 h-4 sm:h-6 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Result */}
            {showResult && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md p-4 sm:p-6 transition-colors duration-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base font-medium transition-colors duration-200" style={{ color: 'var(--success-text)' }}>
                      Ping completed! {completedTime}ms has elapsed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Time Reference */}
            <div className="rounded-md p-4 sm:p-6 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>Time Reference:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                <div>• 100ms = Very fast response</div>
                <div>• 200ms = Good response time</div>
                <div>• 500ms = Noticeable delay</div>
                <div>• 1000ms = 1 second delay</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
