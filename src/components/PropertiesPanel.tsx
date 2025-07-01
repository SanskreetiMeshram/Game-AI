import React, { useState } from 'react';
import { Settings, Sliders, Layers, Zap, Play, Square, RotateCw, Palette, Eye, EyeOff } from 'lucide-react';

interface Behavior {
  id: string;
  name: string;
  icon: React.ReactNode;
  active: boolean;
  description: string;
}

interface PropertiesPanelProps {
  selectedObject?: any;
  onObjectUpdate?: (updates: any) => void;
}

export default function PropertiesPanel({ selectedObject, onObjectUpdate }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('properties');
  const [showPanel, setShowPanel] = useState(true);
  const [behaviors, setBehaviors] = useState<Behavior[]>([
    { id: 'jump', name: 'Jump', icon: <Play className="w-4 h-4" />, active: true, description: 'Allows character to jump' },
    { id: 'run', name: 'Run', icon: <Zap className="w-4 h-4" />, active: true, description: 'Character can run faster' },
    { id: 'attack', name: 'Attack', icon: <Square className="w-4 h-4" />, active: false, description: 'Combat abilities' },
    { id: 'fly', name: 'Fly', icon: <Play className="w-4 h-4" />, active: false, description: 'Aerial movement' },
    { id: 'swim', name: 'Swim', icon: <Play className="w-4 h-4" />, active: false, description: 'Water movement' },
    { id: 'climb', name: 'Climb', icon: <Play className="w-4 h-4" />, active: false, description: 'Wall climbing' },
    { id: 'stealth', name: 'Stealth', icon: <Eye className="w-4 h-4" />, active: false, description: 'Invisibility mode' },
    { id: 'teleport', name: 'Teleport', icon: <Zap className="w-4 h-4" />, active: false, description: 'Instant movement' },
    { id: 'heal', name: 'Heal', icon: <Play className="w-4 h-4" />, active: false, description: 'Health regeneration' },
    { id: 'shield', name: 'Shield', icon: <Square className="w-4 h-4" />, active: false, description: 'Defensive barrier' },
    { id: 'eat', name: 'Eat', icon: <Play className="w-4 h-4" />, active: false, description: 'Consume food items' },
    { id: 'sleep', name: 'Sleep', icon: <Play className="w-4 h-4" />, active: false, description: 'Rest and recover' },
    { id: 'drive', name: 'Drive', icon: <Play className="w-4 h-4" />, active: false, description: 'Vehicle operation' },
    { id: 'dance', name: 'Dance', icon: <Play className="w-4 h-4" />, active: false, description: 'Rhythmic movement' },
    { id: 'sing', name: 'Sing', icon: <Play className="w-4 h-4" />, active: false, description: 'Musical expression' },
  ]);

  const [physicsSettings, setPhysicsSettings] = useState({
    gravity: 9.8,
    mass: 1,
    friction: 0.5,
    bounce: 0.3,
    drag: 0.1,
    collision: true,
    trigger: false,
    kinematic: false,
  });

  const [layers, setLayers] = useState([
    { id: 'background', name: 'Background', visible: true, locked: false, opacity: 1 },
    { id: 'midground', name: 'Midground', visible: true, locked: false, opacity: 1 },
    { id: 'foreground', name: 'Foreground', visible: true, locked: false, opacity: 1 },
    { id: 'ui', name: 'UI Layer', visible: true, locked: false, opacity: 1 },
    { id: 'effects', name: 'Effects', visible: true, locked: false, opacity: 1 },
  ]);

  const tabs = [
    { id: 'properties', label: 'Properties', icon: <Settings className="w-4 h-4" /> },
    { id: 'behaviors', label: 'Behaviors', icon: <Zap className="w-4 h-4" /> },
    { id: 'physics', label: 'Physics', icon: <Sliders className="w-4 h-4" /> },
    { id: 'layers', label: 'Layers', icon: <Layers className="w-4 h-4" /> },
    { id: 'materials', label: 'Materials', icon: <Palette className="w-4 h-4" /> },
  ];

  const toggleBehavior = (behaviorId: string) => {
    setBehaviors(behaviors.map(b => 
      b.id === behaviorId ? { ...b, active: !b.active } : b
    ));
  };

  const updatePhysics = (key: string, value: any) => {
    setPhysicsSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(layers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleLayerLock = (layerId: string) => {
    setLayers(layers.map(layer =>
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-l-lg border border-gray-700 hover:bg-gray-700 transition-colors z-10"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="w-80 bg-gray-950 border-l border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-white font-semibold">Properties Panel</h2>
        <button
          onClick={() => setShowPanel(false)}
          className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-3 py-3 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              {tab.icon}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-medium mb-4">Transform</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="X"
                      className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Y"
                      className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Z"
                      className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rotation</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="X"
                      className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Y"
                      className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Z"
                      className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Scale</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="X"
                      defaultValue="1"
                      className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Y"
                      defaultValue="1"
                      className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Z"
                      defaultValue="1"
                      className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Appearance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                  <input
                    type="color"
                    defaultValue="#00D4FF"
                    className="w-full h-10 bg-gray-800 border border-gray-700 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="1"
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'behaviors' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-white font-medium mb-2">Available Behaviors</h3>
              <p className="text-gray-400 text-sm">Enable realistic behaviors for your objects</p>
            </div>
            
            {behaviors.map((behavior) => (
              <div key={behavior.id} className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-cyan-400">{behavior.icon}</div>
                    <span className="text-white font-medium">{behavior.name}</span>
                  </div>
                  <button
                    onClick={() => toggleBehavior(behavior.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      behavior.active ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        behavior.active ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-gray-400 text-xs">{behavior.description}</p>
              </div>
            ))}

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-700/30">
              <h4 className="text-white font-medium mb-2">Advanced Behaviors</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div>• Realistic human movements and emotions</div>
                <div>• Vehicle controls (cars, planes, boats)</div>
                <div>• Natural phenomena (water, fire, wind)</div>
                <div>• AI-driven interactions and responses</div>
                <div>• Complex animation sequences</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'physics' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-medium mb-4">Physics Properties</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gravity: {physicsSettings.gravity}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={physicsSettings.gravity}
                    onChange={(e) => updatePhysics('gravity', parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mass: {physicsSettings.mass}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={physicsSettings.mass}
                    onChange={(e) => updatePhysics('mass', parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Friction: {physicsSettings.friction}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={physicsSettings.friction}
                    onChange={(e) => updatePhysics('friction', parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bounce: {physicsSettings.bounce}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={physicsSettings.bounce}
                    onChange={(e) => updatePhysics('bounce', parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Air Drag: {physicsSettings.drag}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={physicsSettings.drag}
                    onChange={(e) => updatePhysics('drag', parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Collision Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white">Collision Detection</span>
                  <button
                    onClick={() => updatePhysics('collision', !physicsSettings.collision)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      physicsSettings.collision ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        physicsSettings.collision ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white">Is Trigger</span>
                  <button
                    onClick={() => updatePhysics('trigger', !physicsSettings.trigger)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      physicsSettings.trigger ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        physicsSettings.trigger ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white">Kinematic</span>
                  <button
                    onClick={() => updatePhysics('kinematic', !physicsSettings.kinematic)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      physicsSettings.kinematic ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        physicsSettings.kinematic ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-white font-medium mb-2">Scene Layers</h3>
              <p className="text-gray-400 text-sm">Organize objects in layers for better control</p>
            </div>

            {layers.map((layer) => (
              <div key={layer.id} className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{layer.name}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleLayerVisibility(layer.id)}
                      className={`p-1 rounded transition-colors ${
                        layer.visible ? 'text-green-400' : 'text-gray-500'
                      }`}
                    >
                      {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => toggleLayerLock(layer.id)}
                      className={`p-1 rounded transition-colors ${
                        layer.locked ? 'text-red-400' : 'text-gray-400'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Opacity: {Math.round(layer.opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={layer.opacity}
                    onChange={(e) => {
                      const newOpacity = parseFloat(e.target.value);
                      setLayers(layers.map(l =>
                        l.id === layer.id ? { ...l, opacity: newOpacity } : l
                      ));
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-medium mb-4">Material Properties</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Base Color</label>
                  <input
                    type="color"
                    defaultValue="#00D4FF"
                    className="w-full h-10 bg-gray-800 border border-gray-700 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Metallic</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0"
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Roughness</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.5"
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Emission</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    defaultValue="0"
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Texture Maps</h3>
              <div className="space-y-3">
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors text-left">
                  + Add Diffuse Map
                </button>
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors text-left">
                  + Add Normal Map
                </button>
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors text-left">
                  + Add Roughness Map
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}