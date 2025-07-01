import React, { useState } from 'react';
import { X, Monitor, Palette, Volume2, Keyboard, Cloud, Shield } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    theme: 'dark',
    autoSave: true,
    gridSnap: true,
    soundEnabled: true,
    volume: 80,
    keyboardShortcuts: true,
    cloudSync: true,
    quality: 'high',
    fps: 60,
    antiAliasing: true,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: <Monitor className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'audio', label: 'Audio', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'controls', label: 'Controls', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'cloud', label: 'Cloud', icon: <Cloud className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
  ];

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl h-[80vh] flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-950 border-r border-gray-800 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-lg">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-white text-xl font-semibold">General Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Auto Save</label>
                    <p className="text-gray-400 text-sm">Automatically save your project every 30 seconds</p>
                  </div>
                  <button
                    onClick={() => updateSetting('autoSave', !settings.autoSave)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      settings.autoSave ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Grid Snap</label>
                    <p className="text-gray-400 text-sm">Snap objects to grid when moving</p>
                  </div>
                  <button
                    onClick={() => updateSetting('gridSnap', !settings.gridSnap)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      settings.gridSnap ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        settings.gridSnap ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="text-white font-medium block mb-2">Rendering Quality</label>
                  <select
                    value={settings.quality}
                    onChange={(e) => updateSetting('quality', e.target.value)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>

                <div>
                  <label className="text-white font-medium block mb-2">Target FPS</label>
                  <select
                    value={settings.fps}
                    onChange={(e) => updateSetting('fps', parseInt(e.target.value))}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value={30}>30 FPS</option>
                    <option value={60}>60 FPS</option>
                    <option value={120}>120 FPS</option>
                    <option value={144}>144 FPS</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-white text-xl font-semibold">Appearance</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white font-medium block mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['dark', 'darker', 'midnight'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updateSetting('theme', theme)}
                        className={`p-4 rounded-lg border-2 transition-colors capitalize ${
                          settings.theme === theme
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-full h-8 rounded mb-2 ${
                          theme === 'dark' ? 'bg-gray-800' :
                          theme === 'darker' ? 'bg-gray-900' : 'bg-black'
                        }`} />
                        <span className="text-white text-sm">{theme}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Anti-Aliasing</label>
                    <p className="text-gray-400 text-sm">Smooth edges in 3D rendering</p>
                  </div>
                  <button
                    onClick={() => updateSetting('antiAliasing', !settings.antiAliasing)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      settings.antiAliasing ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        settings.antiAliasing ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-6">
              <h3 className="text-white text-xl font-semibold">Audio Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Sound Enabled</label>
                    <p className="text-gray-400 text-sm">Enable sound effects and music</p>
                  </div>
                  <button
                    onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      settings.soundEnabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="text-white font-medium block mb-2">Master Volume: {settings.volume}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.volume}
                    onChange={(e) => updateSetting('volume', parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="space-y-6">
              <h3 className="text-white text-xl font-semibold">Controls</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Keyboard Shortcuts</label>
                    <p className="text-gray-400 text-sm">Enable keyboard shortcuts for faster workflow</p>
                  </div>
                  <button
                    onClick={() => updateSetting('keyboardShortcuts', !settings.keyboardShortcuts)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      settings.keyboardShortcuts ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        settings.keyboardShortcuts ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-3">Keyboard Shortcuts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Play/Pause</span>
                      <span className="text-cyan-400">Space</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Save</span>
                      <span className="text-cyan-400">Ctrl + S</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Undo</span>
                      <span className="text-cyan-400">Ctrl + Z</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Redo</span>
                      <span className="text-cyan-400">Ctrl + Y</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="space-y-6">
              <h3 className="text-white text-xl font-semibold">Cloud Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Cloud Sync</label>
                    <p className="text-gray-400 text-sm">Automatically sync projects to cloud</p>
                  </div>
                  <button
                    onClick={() => updateSetting('cloudSync', !settings.cloudSync)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      settings.cloudSync ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        settings.cloudSync ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Storage Usage</h4>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                  <p className="text-gray-400 text-sm">4.5 GB of 10 GB used</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-white text-xl font-semibold">Privacy & Security</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Data Collection</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    We collect minimal data to improve your experience. All game projects remain private.
                  </p>
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm">
                    View Privacy Policy
                  </button>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Account Security</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Your account is protected with industry-standard encryption.
                  </p>
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}