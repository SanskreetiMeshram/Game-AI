import React, { useState } from 'react';
import { Play, Edit, Download, Star, Gamepad2, Trophy, Zap, Target } from 'lucide-react';

interface GameTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  playable: boolean;
  features: string[];
  gameType: 'shooting' | 'running' | 'flying' | 'puzzle' | 'action' | 'casual' | 'platformer';
}

interface GameTemplatesProps {
  onTemplateSelect: (template: GameTemplate) => void;
  onPlayTemplate: (template: GameTemplate) => void;
}

export default function GameTemplates({ onTemplateSelect, onPlayTemplate }: GameTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: GameTemplate[] = [
    {
      id: 'space-shooter',
      name: 'Space Shooter',
      description: 'Classic arcade-style space shooting game with enemies, power-ups, and boss battles',
      preview: '🚀',
      category: 'action',
      difficulty: 'Medium',
      playable: true,
      gameType: 'shooting',
      features: ['Shooting mechanics', 'Enemy AI', 'Power-ups', 'Boss battles', 'Score system'],
    },
    {
      id: 'endless-runner',
      name: 'Endless Runner',
      description: 'Fast-paced infinite running game with obstacles, collectibles, and dynamic environments',
      preview: '🏃',
      category: 'action',
      difficulty: 'Easy',
      playable: true,
      gameType: 'running',
      features: ['Infinite scrolling', 'Obstacle avoidance', 'Collectibles', 'Speed progression'],
    },
    {
      id: 'flappy-bird',
      name: 'Flappy Bird',
      description: 'Navigate through pipes in this challenging one-button flying game',
      preview: '🐦',
      category: 'casual',
      difficulty: 'Hard',
      playable: true,
      gameType: 'flying',
      features: ['One-button control', 'Physics-based flight', 'Pipe obstacles', 'High score'],
    },
    {
      id: 'sky-adventure',
      name: 'Sky Adventure',
      description: '3D flying game with beautiful landscapes, missions, and aerial combat',
      preview: '✈️',
      category: 'adventure',
      difficulty: 'Medium',
      playable: true,
      gameType: 'flying',
      features: ['3D flight', 'Open world', 'Mission system', 'Aerial combat', 'Exploration'],
    },
    {
      id: 'speed-runner',
      name: 'Speed Runner',
      description: 'Race against time through challenging platformer levels with precision controls',
      preview: '⚡',
      category: 'platformer',
      difficulty: 'Hard',
      playable: true,
      gameType: 'running',
      features: ['Precision platforming', 'Time trials', 'Speed mechanics', 'Level editor'],
    },
    {
      id: 'whack-mole',
      name: 'Whack-the-Mole',
      description: 'Classic arcade game with modern 3D graphics and power-ups',
      preview: '🔨',
      category: 'casual',
      difficulty: 'Easy',
      playable: true,
      gameType: 'action',
      features: ['Reaction-based gameplay', '3D graphics', 'Power-ups', 'Multiplayer'],
    },
    {
      id: 'match3-puzzle',
      name: 'Match-3 Puzzle',
      description: 'Colorful gem-matching puzzle game with special effects and combos',
      preview: '💎',
      category: 'puzzle',
      difficulty: 'Easy',
      playable: true,
      gameType: 'puzzle',
      features: ['Match-3 mechanics', 'Special gems', 'Combo system', 'Level progression'],
    },
    {
      id: 'crossy-road',
      name: 'Crossy Road',
      description: 'Navigate through traffic and obstacles in 3D voxel style',
      preview: '🐸',
      category: 'casual',
      difficulty: 'Medium',
      playable: true,
      gameType: 'action',
      features: ['Voxel graphics', 'Procedural generation', 'Character collection', 'Endless gameplay'],
    },
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'action', name: 'Action', icon: <Zap className="w-4 h-4" /> },
    { id: 'casual', name: 'Casual', icon: <Target className="w-4 h-4" /> },
    { id: 'puzzle', name: 'Puzzle', icon: <Trophy className="w-4 h-4" /> },
    { id: 'platformer', name: 'Platformer', icon: <Play className="w-4 h-4" /> },
    { id: 'adventure', name: 'Adventure', icon: <Star className="w-4 h-4" /> },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getGameTypeDescription = (gameType: string) => {
    const descriptions = {
      shooting: 'Aim and shoot at targets and enemies',
      running: 'Run, jump, and navigate through levels',
      flying: 'Soar through the skies with flight controls',
      puzzle: 'Solve challenging brain teasers',
      action: 'Fast-paced gameplay with quick reactions',
      casual: 'Easy to learn, fun to play',
      platformer: 'Jump between platforms and obstacles',
    };
    return descriptions[gameType as keyof typeof descriptions] || 'Unique gameplay experience';
  };

  return (
    <div className="flex-1 bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Game Templates
          </h2>
          <p className="text-gray-400 text-lg">Choose from professional game templates - all fully playable and customizable</p>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-400/20 transition-all duration-300 group"
            >
              {/* Preview */}
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-6xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                  {template.preview}
                </span>
                
                {/* Game Type Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                  {template.gameType}
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onPlayTemplate(template)}
                    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full transform hover:scale-110 transition-all shadow-lg"
                  >
                    <Play className="w-8 h-8" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-bold text-lg">{template.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-400 text-sm">4.8</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{template.description}</p>

                {/* Game Type Description */}
                <p className="text-cyan-400 text-xs mb-4 italic">
                  {getGameTypeDescription(template.gameType)}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="text-xs bg-gray-600 text-gray-400 px-2 py-1 rounded">
                        +{template.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                  <span className="text-gray-500 text-sm capitalize bg-gray-700 px-3 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => onPlayTemplate(template)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Play</span>
                  </button>
                  
                  <button
                    onClick={() => onTemplateSelect(template)}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-white text-xl font-medium mb-2">No templates found</h3>
            <p className="text-gray-400 mb-6">Try selecting a different category</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Show All Templates
            </button>
          </div>
        )}
      </div>
    </div>
  );
}