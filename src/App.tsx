import React, { useState } from 'react';
import Header from './components/Header';
import GameEditor from './components/GameEditor';
import AssetPanel from './components/AssetPanel';
import PropertiesPanel from './components/PropertiesPanel';
import AnimationTimeline from './components/AnimationTimeline';
import GameTemplates from './components/GameTemplates';
import TemplateGamePlayer from './components/TemplateGamePlayer';
import { Monitor, Layers, Gamepad2, Palette } from 'lucide-react';

interface GameObject {
  id: string;
  type: string;
  x: number;
  y: number;
  z?: number;
  rotation: number;
  scale: number;
  color: string;
  behaviors: string[];
  physics: {
    mass: number;
    friction: number;
    gravity: boolean;
    collision: boolean;
  };
}

interface GameTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  playable: boolean;
  gameType: 'shooting' | 'running' | 'flying' | 'puzzle' | 'action' | 'casual' | 'platformer';
}

function App() {
  const [currentView, setCurrentView] = useState<'editor' | 'templates' | 'playing'>('templates');
  const [isPlayMode, setIsPlayMode] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<GameTemplate | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  const [gameObjects, setGameObjects] = useState<GameObject[]>([
    {
      id: '1',
      type: 'player',
      x: 200,
      y: 300,
      z: 0,
      rotation: 0,
      scale: 1,
      color: '#00D4FF',
      behaviors: ['jump', 'run'],
      physics: {
        mass: 1,
        friction: 0.5,
        gravity: true,
        collision: true,
      }
    },
    {
      id: '2',
      type: 'platform',
      x: 400,
      y: 400,
      z: 0,
      rotation: 0,
      scale: 1,
      color: '#00FF88',
      behaviors: [],
      physics: {
        mass: 10,
        friction: 0.8,
        gravity: false,
        collision: true,
      }
    }
  ]);

  const handlePlaytest = () => {
    setIsPlayMode(!isPlayMode);
    if (!isPlayMode) {
      console.log('Starting playtest with objects:', gameObjects);
      
      // Show playtest notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Playtest mode activated! Use WASD or arrow keys to move.';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 4000);
    }
  };

  const handleSave = () => {
    const saveData = {
      gameObjects,
      is3D,
      currentTemplate: currentTemplate?.id,
      timestamp: new Date().toISOString(),
      version: '2.0',
      user: currentUser,
    };
    
    // Simulate cloud save
    localStorage.setItem('epicenders_project', JSON.stringify(saveData));
    console.log('Game saved to cloud:', saveData);
    
    // Show save confirmation
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Project saved to cloud successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const handleExport = () => {
    const exportData = {
      name: currentTemplate?.name || 'My Epic Game',
      gameObjects,
      is3D,
      settings: {
        resolution: '1920x1080',
        platform: 'web',
        format: 'html5',
        physics: 'enabled',
        audio: 'enabled',
      },
      metadata: {
        created: new Date().toISOString(),
        author: currentUser || 'Anonymous',
        version: '2.0',
        engine: 'EpicEnders',
      },
      assets: {
        textures: [],
        sounds: [],
        models: [],
        animations: [],
      }
    };
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportData.name.replace(/\s+/g, '_')}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show export confirmation
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Game exported successfully! Ready to share with friends.';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const handleAssetDrag = (asset: any) => {
    const newObject: GameObject = {
      id: Date.now().toString(),
      type: asset.type,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      z: is3D ? Math.random() * 200 - 100 : 0,
      rotation: 0,
      scale: 1,
      color: '#00D4FF',
      behaviors: asset.behaviors || [],
      physics: {
        mass: 1,
        friction: 0.5,
        gravity: asset.type !== 'environment',
        collision: true,
      }
    };
    setGameObjects([...gameObjects, newObject]);

    // Show asset added notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = `${asset.name} added to scene!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 2000);
  };

  const handleTemplateSelect = (template: GameTemplate) => {
    setCurrentTemplate(template);
    setCurrentView('editor');
    
    // Load template-specific objects based on game type
    const templateObjects: GameObject[] = [];
    
    switch (template.gameType) {
      case 'shooting':
        templateObjects.push(
          {
            id: 'player-ship',
            type: 'player',
            x: 150,
            y: 400,
            z: 0,
            rotation: 0,
            scale: 1,
            color: '#00D4FF',
            behaviors: ['shoot', 'move'],
            physics: { mass: 1, friction: 0.1, gravity: false, collision: true }
          },
          {
            id: 'enemy-1',
            type: 'enemy',
            x: 300,
            y: 100,
            z: 0,
            rotation: 180,
            scale: 1,
            color: '#FF4444',
            behaviors: ['patrol', 'shoot'],
            physics: { mass: 1, friction: 0.1, gravity: false, collision: true }
          }
        );
        break;
        
      case 'running':
        templateObjects.push(
          {
            id: 'runner',
            type: 'player',
            x: 100,
            y: 350,
            z: 0,
            rotation: 0,
            scale: 1,
            color: '#00FF88',
            behaviors: ['run', 'jump'],
            physics: { mass: 1, friction: 0.7, gravity: true, collision: true }
          },
          {
            id: 'ground',
            type: 'platform',
            x: 400,
            y: 450,
            z: 0,
            rotation: 0,
            scale: 3,
            color: '#8B4513',
            behaviors: [],
            physics: { mass: 100, friction: 1, gravity: false, collision: true }
          }
        );
        break;
        
      case 'flying':
        templateObjects.push(
          {
            id: 'aircraft',
            type: 'player',
            x: 200,
            y: 300,
            z: 0,
            rotation: 0,
            scale: 1,
            color: '#FFD700',
            behaviors: ['fly', 'boost'],
            physics: { mass: 0.5, friction: 0.05, gravity: false, collision: true }
          }
        );
        break;
        
      default:
        templateObjects.push(
          {
            id: 'template-player',
            type: 'player',
            x: 150,
            y: 300,
            z: 0,
            rotation: 0,
            scale: 1,
            color: '#00D4FF',
            behaviors: ['move'],
            physics: { mass: 1, friction: 0.5, gravity: true, collision: true }
          }
        );
    }
    
    setGameObjects(templateObjects);
    
    // Show template loaded notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = `${template.name} template loaded! Start customizing your game.`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const handlePlayTemplate = (template: GameTemplate) => {
    setCurrentTemplate(template);
    setCurrentView('playing');
  };

  const handleBackToTemplates = () => {
    setCurrentView('templates');
    setCurrentTemplate(null);
    setIsPlayMode(false);
  };

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    
    // Load user's saved project if exists
    const savedProject = localStorage.getItem('epicenders_project');
    if (savedProject) {
      try {
        const projectData = JSON.parse(savedProject);
        if (projectData.user === username) {
          setGameObjects(projectData.gameObjects || []);
          setIs3D(projectData.is3D || false);
          
          // Show welcome back notification
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          notification.textContent = 'Welcome back! Your project has been restored.';
          document.body.appendChild(notification);
          
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 3000);
        }
      } catch (error) {
        console.error('Error loading saved project:', error);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    
    // Show logout notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = 'Logged out successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 2000);
  };

  const navigationTabs = [
    { id: 'templates', label: 'Templates', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'editor', label: 'Editor', icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      <Header 
        onPlaytest={handlePlaytest}
        onSave={handleSave}
        onExport={handleExport}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Navigation Tabs */}
      {currentView !== 'playing' && (
        <div className="bg-gray-900 border-b border-gray-800 px-6">
          <div className="flex space-x-1">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as 'editor' | 'templates')}
                className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all ${
                  currentView === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-800 shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {currentView === 'templates' && (
          <GameTemplates
            onTemplateSelect={handleTemplateSelect}
            onPlayTemplate={handlePlayTemplate}
          />
        )}

        {currentView === 'editor' && (
          <>
            <AssetPanel onAssetDrag={handleAssetDrag} />
            
            <div className="flex-1 flex flex-col">
              <GameEditor
                isPlayMode={isPlayMode}
                gameObjects={gameObjects}
                onObjectsChange={setGameObjects}
                is3D={is3D}
                onModeChange={setIs3D}
              />
              <AnimationTimeline />
            </div>
            
            <PropertiesPanel />
          </>
        )}

        {currentView === 'playing' && currentTemplate && (
          <TemplateGamePlayer
            template={currentTemplate}
            onBack={handleBackToTemplates}
          />
        )}
      </div>
    </div>
  );
}

export default App;