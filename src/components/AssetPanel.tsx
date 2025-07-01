import React, { useState } from 'react';
import { Plus, Search, Folder, Image, Music, Video, Palette, Wand2, Upload, Download, Globe } from 'lucide-react';
import AIGeneratorModal from './AIGeneratorModal';

interface Asset {
  id: string;
  name: string;
  type: 'character' | '3d-model' | 'environment' | 'sound' | 'music' | 'animation' | 'texture' | 'effect';
  preview: string;
  category: string;
  behaviors?: string[];
}

interface AssetPanelProps {
  onAssetDrag: (asset: Asset) => void;
}

export default function AssetPanel({ onAssetDrag }: AssetPanelProps) {
  const [activeTab, setActiveTab] = useState('characters');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const assets: Record<string, Asset[]> = {
    characters: [
      { id: 'char1', name: 'Hero Knight', type: 'character', preview: '🗡️', category: 'fantasy', behaviors: ['jump', 'run', 'attack'] },
      { id: 'char2', name: 'Fire Mage', type: 'character', preview: '🔥', category: 'fantasy', behaviors: ['fly', 'cast', 'teleport'] },
      { id: 'char3', name: 'Space Pilot', type: 'character', preview: '🚀', category: 'sci-fi', behaviors: ['fly', 'shoot', 'boost'] },
      { id: 'char4', name: 'Ninja', type: 'character', preview: '🥷', category: 'action', behaviors: ['stealth', 'jump', 'throw'] },
      { id: 'char5', name: 'Robot', type: 'character', preview: '🤖', category: 'sci-fi', behaviors: ['walk', 'scan', 'laser'] },
      { id: 'char6', name: 'Wizard', type: 'character', preview: '🧙', category: 'fantasy', behaviors: ['magic', 'fly', 'heal'] },
      { id: 'char7', name: 'Alien', type: 'character', preview: '👽', category: 'sci-fi', behaviors: ['float', 'beam', 'phase'] },
      { id: 'char8', name: 'Warrior', type: 'character', preview: '⚔️', category: 'fantasy', behaviors: ['charge', 'block', 'rage'] },
    ],
    models: [
      { id: 'model1', name: 'Medieval Castle', type: '3d-model', preview: '🏰', category: 'buildings' },
      { id: 'model2', name: 'Spaceship', type: '3d-model', preview: '🛸', category: 'vehicles' },
      { id: 'model3', name: 'Ancient Tree', type: '3d-model', preview: '🌳', category: 'nature' },
      { id: 'model4', name: 'Sports Car', type: '3d-model', preview: '🚗', category: 'vehicles' },
      { id: 'model5', name: 'Mountain', type: '3d-model', preview: '⛰️', category: 'terrain' },
      { id: 'model6', name: 'House', type: '3d-model', preview: '🏠', category: 'buildings' },
      { id: 'model7', name: 'Bridge', type: '3d-model', preview: '🌉', category: 'structures' },
      { id: 'model8', name: 'Airplane', type: '3d-model', preview: '✈️', category: 'vehicles' },
    ],
    environments: [
      { id: 'env1', name: 'Enchanted Forest', type: 'environment', preview: '🌲', category: 'nature' },
      { id: 'env2', name: 'Desert Oasis', type: 'environment', preview: '🏜️', category: 'nature' },
      { id: 'env3', name: 'Cyberpunk City', type: 'environment', preview: '🏙️', category: 'urban' },
      { id: 'env4', name: 'Space Station', type: 'environment', preview: '🌌', category: 'sci-fi' },
      { id: 'env5', name: 'Underwater World', type: 'environment', preview: '🌊', category: 'nature' },
      { id: 'env6', name: 'Volcanic Island', type: 'environment', preview: '🌋', category: 'nature' },
      { id: 'env7', name: 'Ice Cave', type: 'environment', preview: '❄️', category: 'nature' },
      { id: 'env8', name: 'Floating Islands', type: 'environment', preview: '☁️', category: 'fantasy' },
    ],
    sounds: [
      { id: 'sound1', name: 'Jump Sound', type: 'sound', preview: '🔊', category: 'actions' },
      { id: 'sound2', name: 'Explosion', type: 'sound', preview: '💥', category: 'effects' },
      { id: 'sound3', name: 'Coin Collect', type: 'sound', preview: '🪙', category: 'pickups' },
      { id: 'sound4', name: 'Footsteps', type: 'sound', preview: '👣', category: 'movement' },
      { id: 'sound5', name: 'Sword Clash', type: 'sound', preview: '⚔️', category: 'combat' },
      { id: 'sound6', name: 'Magic Spell', type: 'sound', preview: '✨', category: 'magic' },
      { id: 'sound7', name: 'Engine Roar', type: 'sound', preview: '🏎️', category: 'vehicles' },
      { id: 'sound8', name: 'Water Splash', type: 'sound', preview: '💧', category: 'nature' },
    ],
    textures: [
      { id: 'tex1', name: 'Stone Wall', type: 'texture', preview: '🧱', category: 'materials' },
      { id: 'tex2', name: 'Wood Planks', type: 'texture', preview: '🪵', category: 'materials' },
      { id: 'tex3', name: 'Metal Grid', type: 'texture', preview: '⚙️', category: 'materials' },
      { id: 'tex4', name: 'Grass Field', type: 'texture', preview: '🌱', category: 'nature' },
      { id: 'tex5', name: 'Sand Dunes', type: 'texture', preview: '🏖️', category: 'nature' },
      { id: 'tex6', name: 'Lava Flow', type: 'texture', preview: '🌋', category: 'effects' },
      { id: 'tex7', name: 'Ice Crystal', type: 'texture', preview: '❄️', category: 'effects' },
      { id: 'tex8', name: 'Circuit Board', type: 'texture', preview: '💾', category: 'tech' },
    ],
    effects: [
      { id: 'fx1', name: 'Fire Particles', type: 'effect', preview: '🔥', category: 'particles' },
      { id: 'fx2', name: 'Lightning Bolt', type: 'effect', preview: '⚡', category: 'energy' },
      { id: 'fx3', name: 'Smoke Cloud', type: 'effect', preview: '💨', category: 'particles' },
      { id: 'fx4', name: 'Sparkles', type: 'effect', preview: '✨', category: 'magic' },
      { id: 'fx5', name: 'Rain Drops', type: 'effect', preview: '🌧️', category: 'weather' },
      { id: 'fx6', name: 'Snow Fall', type: 'effect', preview: '❄️', category: 'weather' },
      { id: 'fx7', name: 'Energy Shield', type: 'effect', preview: '🛡️', category: 'energy' },
      { id: 'fx8', name: 'Portal Vortex', type: 'effect', preview: '🌀', category: 'magic' },
    ],
  };

  const tabs = [
    { id: 'characters', label: 'Characters', icon: <Palette className="w-4 h-4" /> },
    { id: 'models', label: '3D Models', icon: <Folder className="w-4 h-4" /> },
    { id: 'environments', label: 'Environments', icon: <Image className="w-4 h-4" /> },
    { id: 'sounds', label: 'Audio', icon: <Music className="w-4 h-4" /> },
    { id: 'textures', label: 'Textures', icon: <Video className="w-4 h-4" /> },
    { id: 'effects', label: 'Effects', icon: <Wand2 className="w-4 h-4" /> },
  ];

  const filteredAssets = assets[activeTab]?.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAssetDragStart = (asset: Asset) => {
    onAssetDrag(asset);
  };

  const handleImportAsset = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png,.jpg,.jpeg,.gif,.mp3,.wav,.obj,.fbx,.gltf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simulate asset import
        const newAsset: Asset = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: file.type.startsWith('image/') ? '3d-model' : 'sound',
          preview: '📁',
          category: 'imported'
        };
        
        // Add to current tab's assets
        assets[activeTab] = [...(assets[activeTab] || []), newAsset];
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = `Asset "${newAsset.name}" imported successfully!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    };
    input.click();
  };

  const handleImportFromURL = () => {
    const url = prompt('Enter asset URL:');
    if (url) {
      // Simulate URL import
      const newAsset: Asset = {
        id: Date.now().toString(),
        name: 'Web Asset',
        type: '3d-model',
        preview: '🌐',
        category: 'web'
      };
      
      assets[activeTab] = [...(assets[activeTab] || []), newAsset];
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Asset imported from URL successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  return (
    <>
      <div className="w-80 bg-gray-950 border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Asset Library</h2>
            <div className="flex space-x-2">
              <button 
                onClick={handleImportAsset}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                title="Import Asset"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button 
                onClick={handleImportFromURL}
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                title="Import from URL"
              >
                <Globe className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowAIGenerator(true)}
                className="p-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white rounded-lg transition-colors"
                title="Generate with AI"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                {tab.icon}
                <span className="hidden lg:inline">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* AI Generation Section */}
        <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <button 
            onClick={() => setShowAIGenerator(true)}
            className="w-full flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate with AI</span>
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Create custom assets using AI prompts
          </p>
        </div>

        {/* Asset Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                draggable
                onDragStart={() => handleAssetDragStart(asset)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-cyan-400 hover:bg-gray-750 transition-colors cursor-grab active:cursor-grabbing group"
              >
                <div className="text-3xl mb-2 text-center group-hover:scale-110 transition-transform">
                  {asset.preview}
                </div>
                <div className="text-white text-sm font-medium text-center mb-1">{asset.name}</div>
                <div className="text-gray-400 text-xs text-center capitalize mb-2">{asset.category}</div>
                
                {/* Behavior Tags */}
                {asset.behaviors && asset.behaviors.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {asset.behaviors.slice(0, 2).map((behavior) => (
                      <span
                        key={behavior}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                      >
                        {behavior}
                      </span>
                    ))}
                    {asset.behaviors.length > 2 && (
                      <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">
                        +{asset.behaviors.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">No assets found</div>
              <button 
                onClick={() => setShowAIGenerator(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Generate New Asset
              </button>
            </div>
          )}
        </div>
      </div>

      {showAIGenerator && (
        <AIGeneratorModal 
          onClose={() => setShowAIGenerator(false)}
          onGenerate={(asset) => {
            assets[activeTab] = [...(assets[activeTab] || []), asset];
            setShowAIGenerator(false);
          }}
        />
      )}
    </>
  );
}