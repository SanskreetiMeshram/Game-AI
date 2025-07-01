import React, { useState } from 'react';
import { Play, Save, Upload, Settings, User, Zap, FolderOpen, Download, Cloud, LogOut } from 'lucide-react';
import SettingsModal from './SettingsModal';
import ProjectManager from './ProjectManager';
import LoginModal from './LoginModal';

interface HeaderProps {
  onPlaytest: () => void;
  onSave: () => void;
  onExport: () => void;
  currentUser: string | null;
  onLogin: (username: string) => void;
  onLogout: () => void;
}

export default function Header({ onPlaytest, onSave, onExport, currentUser, onLogin, onLogout }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleFileMenu = () => {
    // File operations
    console.log('File menu clicked');
  };

  const handleEditMenu = () => {
    // Edit operations
    console.log('Edit menu clicked');
  };

  const handleViewMenu = () => {
    // View operations
    console.log('View menu clicked');
  };

  const handleHelpMenu = () => {
    // Help operations
    window.open('https://epicenders.com/help', '_blank');
  };

  return (
    <>
      <header className="bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between relative z-50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                EpicEnders
              </h1>
              <p className="text-xs text-gray-400">Professional Game Studio</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1">
            <button 
              onClick={handleFileMenu}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              File
            </button>
            <button 
              onClick={handleEditMenu}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={handleViewMenu}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              View
            </button>
            <button 
              onClick={handleHelpMenu}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Help
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowProjects(true)}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Projects</span>
          </button>

          <button
            onClick={onPlaytest}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg transition-all shadow-lg shadow-green-600/30"
          >
            <Play className="w-4 h-4" />
            <span>Playtest</span>
          </button>
          
          <button
            onClick={onSave}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-600/30"
          >
            <Cloud className="w-4 h-4" />
            <span>Save</span>
          </button>
          
          <button
            onClick={onExport}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-purple-600/30"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="text-white text-sm">{currentUser}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowLogin(true)}
              className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {showProjects && (
        <ProjectManager onClose={() => setShowProjects(false)} />
      )}

      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onLogin={onLogin}
        />
      )}
    </>
  );
}