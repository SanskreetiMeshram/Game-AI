import React, { useState } from 'react';
import { X, Wand2, Sparkles, Download, RefreshCw } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'character' | '3d-model' | 'environment' | 'sound' | 'music' | 'animation' | 'texture' | 'effect';
  preview: string;
  category: string;
  behaviors?: string[];
}

interface AIGeneratorModalProps {
  onClose: () => void;
  onGenerate: (asset: Asset) => void;
}

export default function AIGeneratorModal({ onClose, onGenerate }: AIGeneratorModalProps) {
  const [prompt, setPrompt] = useState('');
  const [assetType, setAssetType] = useState<Asset['type']>('character');
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<Asset[]>([]);

  const assetTypes = [
    { id: 'character', label: 'Character', icon: '👤' },
    { id: '3d-model', label: '3D Model', icon: '📦' },
    { id: 'environment', label: 'Environment', icon: '🌍' },
    { id: 'texture', label: 'Texture', icon: '🎨' },
    { id: 'sound', label: 'Sound', icon: '🔊' },
    { id: 'effect', label: 'Effect', icon: '✨' },
  ];

  const styles = [
    { id: 'realistic', label: 'Realistic' },
    { id: 'cartoon', label: 'Cartoon' },
    { id: 'pixel', label: 'Pixel Art' },
    { id: 'low-poly', label: 'Low Poly' },
    { id: 'anime', label: 'Anime' },
    { id: 'cyberpunk', label: 'Cyberpunk' },
  ];

  const examplePrompts = {
    character: [
      'A brave knight with golden armor',
      'Cute robot companion with blue lights',
      'Mystical wizard with flowing robes',
      'Ninja warrior in black outfit',
    ],
    '3d-model': [
      'Medieval castle with tall towers',
      'Futuristic spaceship with glowing engines',
      'Ancient tree with twisted branches',
      'Modern sports car with sleek design',
    ],
    environment: [
      'Enchanted forest with magical creatures',
      'Cyberpunk city with neon lights',
      'Underwater coral reef world',
      'Desert oasis with palm trees',
    ],
    texture: [
      'Weathered stone wall texture',
      'Glowing crystal surface',
      'Rusty metal with scratches',
      'Soft grass field pattern',
    ],
    sound: [
      'Epic sword clash sound effect',
      'Magical spell casting audio',
      'Futuristic laser beam sound',
      'Nature ambience with birds',
    ],
    effect: [
      'Fire particle explosion',
      'Lightning energy bolt',
      'Healing magic sparkles',
      'Smoke trail effect',
    ],
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate multiple asset variations
    const newAssets: Asset[] = Array.from({ length: 4 }, (_, i) => ({
      id: `ai-${Date.now()}-${i}`,
      name: `${prompt} (Variant ${i + 1})`,
      type: assetType,
      preview: getPreviewEmoji(assetType),
      category: 'ai-generated',
      behaviors: assetType === 'character' ? ['move', 'interact'] : undefined,
    }));

    setGeneratedAssets(newAssets);
    setIsGenerating(false);

    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = `Generated ${newAssets.length} ${assetType} variations!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const getPreviewEmoji = (type: Asset['type']): string => {
    const emojiMap = {
      character: '🤖',
      '3d-model': '📦',
      environment: '🌍',
      texture: '🎨',
      sound: '🔊',
      effect: '✨',
      animation: '🎬',
      music: '🎵',
    };
    return emojiMap[type] || '🎯';
  };

  const useExamplePrompt = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-xl">AI Asset Generator</h2>
              <p className="text-gray-400 text-sm">Create custom game assets with AI</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Generation Controls */}
          <div className="w-1/2 p-6 border-r border-gray-800 overflow-y-auto">
            {/* Asset Type Selection */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">Asset Type</label>
              <div className="grid grid-cols-2 gap-2">
                {assetTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setAssetType(type.id as Asset['type'])}
                    className={`p-3 rounded-lg border transition-colors ${
                      assetType === type.id
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                        : 'border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">Style</label>
              <div className="grid grid-cols-3 gap-2">
                {styles.map((styleOption) => (
                  <button
                    key={styleOption.id}
                    onClick={() => setStyle(styleOption.id)}
                    className={`p-2 rounded-lg border text-sm transition-colors ${
                      style === styleOption.id
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                        : 'border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {styleOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">Describe your asset</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe the ${assetType} you want to create...`}
                className="w-full h-24 p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            {/* Example Prompts */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">Example Prompts</label>
              <div className="space-y-2">
                {examplePrompts[assetType]?.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => useExamplePrompt(example)}
                    className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-colors ${
                !prompt.trim() || isGenerating
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Assets</span>
                </>
              )}
            </button>
          </div>

          {/* Right Panel - Generated Results */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <h3 className="text-white font-medium mb-4">Generated Assets</h3>
            
            {isGenerating && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Creating your {assetType}...</p>
                </div>
              </div>
            )}

            {generatedAssets.length > 0 && !isGenerating && (
              <div className="grid grid-cols-2 gap-4">
                {generatedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-cyan-400 transition-colors"
                  >
                    <div className="text-4xl text-center mb-3">{asset.preview}</div>
                    <h4 className="text-white font-medium text-sm mb-2 text-center">
                      {asset.name}
                    </h4>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onGenerate(asset)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        Use Asset
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {generatedAssets.length === 0 && !isGenerating && (
              <div className="text-center py-12">
                <Wand2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No assets generated yet</p>
                <p className="text-gray-500 text-sm">Enter a prompt and click generate to create assets</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}