import { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import AISidebar from './components/AISidebar';
import './App.css'

function App() {
  const [updateStatus, setUpdateStatus] = useState(null); // 'available', 'downloaded', or null

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onUpdateAvailable(() => {
        setUpdateStatus('available');
      });
      window.electronAPI.onUpdateDownloaded(() => {
        setUpdateStatus('downloaded');
      });
    }
  }, []);

  const handleRestart = () => {
    if (window.electronAPI) {
      window.electronAPI.restartApp();
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0f172a] text-white overflow-hidden font-sans relative">
      {/* HEADER */}
      <header className="h-14 border-b border-white/5 bg-[#1e293b]/50 backdrop-blur-xl flex items-center px-4 justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg">
            i
          </div>
          <span className="font-semibold tracking-wide text-sm text-slate-200">Draw Design</span>
        </div>

        <nav className="flex items-center gap-1 bg-[#0f172a]/50 p-1 rounded-lg border border-white/5">
          <button className="px-3 py-1.5 text-xs font-medium bg-white/10 rounded text-white">Select</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">Rectangle</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">Circle</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">Text</button>
        </nav>

        <div className="w-8"></div>
      </header>

      {/* UPDATE NOTIFICATION */}
      {updateStatus && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-blue-600/90 backdrop-blur text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-3 border border-blue-400/30">
          <span>
            {updateStatus === 'available' ? 'Downloading update...' : 'Update downloaded.'}
          </span>
          {updateStatus === 'downloaded' && (
            <button
              onClick={handleRestart}
              className="bg-white text-blue-900 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors"
            >
              Restart to Install
            </button>
          )}
        </div>
      )}

      {/* WORKSPACE */}
      <div className="flex flex-1 overflow-hidden">
        <Canvas />
        <AISidebar />
      </div>
    </div>
  )
}

export default App
