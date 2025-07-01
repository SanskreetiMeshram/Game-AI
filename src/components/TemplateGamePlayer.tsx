import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Pause, Play, Volume2, VolumeX, Settings } from 'lucide-react';

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

interface TemplateGamePlayerProps {
  template: GameTemplate;
  onBack: () => void;
}

interface GameObject {
  id: number;
  x: number;
  y: number;
  type: 'enemy' | 'collectible' | 'obstacle' | 'projectile';
  speed?: number;
}

export default function TemplateGamePlayer({ template, onBack }: TemplateGamePlayerProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameOver'>('playing');
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameSpeed, setGameSpeed] = useState(1);

  // Game-specific state based on template type
  const [gameSpecificState, setGameSpecificState] = useState(() => {
    switch (template.gameType) {
      case 'shooting':
        return { ammo: 100, powerUps: 0, level: 1 };
      case 'running':
        return { distance: 0, speed: 5, obstacles: [] };
      case 'flying':
        return { altitude: 50, fuel: 100, wind: 0 };
      case 'puzzle':
        return { moves: 0, matches: 0, combo: 0 };
      default:
        return {};
    }
  });

  // Game loop with different mechanics based on template type
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Update game objects based on game type
      setGameObjects(prev => {
        let newObjects = [...prev];

        switch (template.gameType) {
          case 'shooting':
            // Move enemies down, projectiles up
            newObjects = newObjects.map(obj => {
              if (obj.type === 'enemy') {
                return { ...obj, y: obj.y + (obj.speed || 2) * gameSpeed };
              }
              if (obj.type === 'projectile') {
                return { ...obj, y: obj.y - (obj.speed || 5) * gameSpeed };
              }
              return obj;
            }).filter(obj => obj.y > -10 && obj.y < 110);
            break;

          case 'running':
            // Move obstacles left
            newObjects = newObjects.map(obj => ({
              ...obj,
              x: obj.x - (obj.speed || 3) * gameSpeed
            })).filter(obj => obj.x > -10);
            break;

          case 'flying':
            // Move obstacles and collectibles
            newObjects = newObjects.map(obj => ({
              ...obj,
              x: obj.x - (obj.speed || 2) * gameSpeed,
              y: obj.type === 'obstacle' ? obj.y + Math.sin(Date.now() * 0.01) * 0.5 : obj.y
            })).filter(obj => obj.x > -10);
            break;

          default:
            // Default movement
            newObjects = newObjects.map(obj => ({
              ...obj,
              y: obj.y + (obj.speed || 1) * gameSpeed
            })).filter(obj => obj.y < 110);
        }

        return newObjects;
      });

      // Spawn new objects based on game type
      const spawnChance = Math.random();
      if (spawnChance < 0.02 * gameSpeed) {
        const newObject: GameObject = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: template.gameType === 'running' ? Math.random() * 60 + 20 : -5,
          type: Math.random() < 0.7 ? 'enemy' : 'collectible',
          speed: Math.random() * 2 + 1,
        };

        if (template.gameType === 'running') {
          newObject.x = 100;
          newObject.type = Math.random() < 0.8 ? 'obstacle' : 'collectible';
        }

        setGameObjects(prev => [...prev, newObject]);
      }

      // Update game-specific state
      setGameSpecificState(prev => {
        switch (template.gameType) {
          case 'running':
            return { ...prev, distance: (prev.distance || 0) + gameSpeed };
          case 'flying':
            return { 
              ...prev, 
              fuel: Math.max(0, (prev.fuel || 100) - 0.1 * gameSpeed),
              wind: Math.sin(Date.now() * 0.001) * 2
            };
          default:
            return prev;
        }
      });

      // Increase game speed over time
      setGameSpeed(prev => Math.min(3, prev + 0.001));
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameState, template.gameType, gameSpeed]);

  // Collision detection with game-specific logic
  useEffect(() => {
    gameObjects.forEach(obj => {
      const distance = Math.sqrt(
        Math.pow(obj.x - playerPosition.x, 2) + 
        Math.pow(obj.y - playerPosition.y, 2)
      );

      if (distance < 5) {
        if (obj.type === 'enemy' || obj.type === 'obstacle') {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('gameOver');
            }
            return newLives;
          });
          
          // Play damage sound
          if (soundEnabled) {
            // Simulate sound effect
            console.log('Damage sound');
          }
        } else if (obj.type === 'collectible') {
          const points = template.gameType === 'puzzle' ? 50 : 10;
          setScore(prev => prev + points);
          
          // Update game-specific rewards
          setGameSpecificState(prev => {
            switch (template.gameType) {
              case 'shooting':
                return { ...prev, ammo: (prev.ammo || 0) + 10 };
              case 'flying':
                return { ...prev, fuel: Math.min(100, (prev.fuel || 0) + 20) };
              default:
                return prev;
            }
          });

          // Play collect sound
          if (soundEnabled) {
            console.log('Collect sound');
          }
        }

        // Remove the object
        setGameObjects(prev => prev.filter(o => o.id !== obj.id));
      }
    });
  }, [playerPosition, gameObjects, template.gameType, soundEnabled]);

  // Keyboard controls with game-specific mechanics
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState !== 'playing') return;

    setPlayerPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;

      const moveSpeed = template.gameType === 'flying' ? 2 : 3;

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
          newX = Math.max(5, prev.x - moveSpeed);
          break;
        case 'ArrowRight':
        case 'd':
          newX = Math.min(95, prev.x + moveSpeed);
          break;
        case 'ArrowUp':
        case 'w':
          if (template.gameType === 'flying' || template.gameType === 'shooting') {
            newY = Math.max(5, prev.y - moveSpeed);
          }
          break;
        case 'ArrowDown':
        case 's':
          if (template.gameType === 'flying' || template.gameType === 'shooting') {
            newY = Math.min(95, prev.y + moveSpeed);
          }
          break;
        case ' ':
          event.preventDefault();
          if (template.gameType === 'running') {
            // Jump
            newY = Math.max(20, prev.y - 15);
            setTimeout(() => {
              setPlayerPosition(p => ({ ...p, y: Math.min(80, p.y + 15) }));
            }, 200);
          } else if (template.gameType === 'shooting') {
            // Shoot
            const projectile: GameObject = {
              id: Date.now(),
              x: prev.x,
              y: prev.y - 5,
              type: 'projectile',
              speed: 8,
            };
            setGameObjects(objs => [...objs, projectile]);
            
            setGameSpecificState(s => ({
              ...s,
              ammo: Math.max(0, (s.ammo || 0) - 1)
            }));
          }
          break;
      }

      return { x: newX, y: newY };
    });
  }, [gameState, template.gameType]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameState('playing');
    setPlayerPosition({ x: 50, y: template.gameType === 'running' ? 80 : 50 });
    setGameObjects([]);
    setGameSpeed(1);
    setGameSpecificState(() => {
      switch (template.gameType) {
        case 'shooting':
          return { ammo: 100, powerUps: 0, level: 1 };
        case 'running':
          return { distance: 0, speed: 5, obstacles: [] };
        case 'flying':
          return { altitude: 50, fuel: 100, wind: 0 };
        case 'puzzle':
          return { moves: 0, matches: 0, combo: 0 };
        default:
          return {};
      }
    });
  };

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  const getPlayerIcon = () => {
    switch (template.gameType) {
      case 'shooting': return '🚀';
      case 'running': return '🏃';
      case 'flying': return '✈️';
      case 'puzzle': return '🧩';
      default: return '🎮';
    }
  };

  const getBackgroundGradient = () => {
    switch (template.gameType) {
      case 'shooting': return 'from-purple-900 via-blue-900 to-black';
      case 'running': return 'from-green-800 via-blue-800 to-gray-900';
      case 'flying': return 'from-blue-400 via-cyan-500 to-blue-900';
      case 'puzzle': return 'from-pink-800 via-purple-800 to-indigo-900';
      default: return 'from-gray-800 via-gray-900 to-black';
    }
  };

  return (
    <div className="flex-1 bg-gray-900 flex flex-col">
      {/* Game Header */}
      <div className="bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Templates</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{template.preview}</span>
            <div>
              <h2 className="text-white text-xl font-semibold">{template.name}</h2>
              <p className="text-gray-400 text-sm capitalize">{template.gameType} Game</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Game-specific stats */}
          <div className="flex items-center space-x-4 text-white font-mono">
            <div>Score: {score}</div>
            <div>Lives: {lives}</div>
            {template.gameType === 'shooting' && (
              <div>Ammo: {gameSpecificState.ammo}</div>
            )}
            {template.gameType === 'running' && (
              <div>Distance: {Math.floor((gameSpecificState.distance || 0) / 10)}m</div>
            )}
            {template.gameType === 'flying' && (
              <div>Fuel: {Math.floor(gameSpecificState.fuel || 0)}%</div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            
            <button
              onClick={togglePause}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            
            <button
              onClick={resetGame}
              className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className={`flex-1 relative bg-gradient-to-b ${getBackgroundGradient()} overflow-hidden`}>
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          {template.gameType === 'shooting' && (
            // Stars for space shooter
            Array.from({ length: 100 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))
          )}
          
          {template.gameType === 'running' && (
            // Ground and clouds for runner
            <>
              <div className="absolute bottom-0 w-full h-20 bg-green-800" />
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-16 h-8 bg-white rounded-full opacity-70"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${10 + Math.sin(i) * 10}%`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Player */}
        <div
          className="absolute text-4xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 z-10"
          style={{
            left: `${playerPosition.x}%`,
            top: `${playerPosition.y}%`,
          }}
        >
          {getPlayerIcon()}
        </div>

        {/* Game Objects */}
        {gameObjects.map(obj => (
          <div
            key={obj.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl"
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
            }}
          >
            {obj.type === 'enemy' && '👾'}
            {obj.type === 'obstacle' && '🚧'}
            {obj.type === 'collectible' && '⭐'}
            {obj.type === 'projectile' && '💥'}
          </div>
        ))}

        {/* Game State Overlays */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <h3 className="text-white text-2xl font-bold mb-4">Game Paused</h3>
              <button
                onClick={togglePause}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Resume Game
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md">
              <h3 className="text-white text-3xl font-bold mb-4">Game Over!</h3>
              <div className="text-gray-300 mb-6 space-y-2">
                <p>Final Score: <span className="text-cyan-400 font-bold">{score}</span></p>
                {template.gameType === 'running' && (
                  <p>Distance: <span className="text-green-400 font-bold">{Math.floor((gameSpecificState.distance || 0) / 10)}m</span></p>
                )}
                {template.gameType === 'shooting' && (
                  <p>Level Reached: <span className="text-purple-400 font-bold">{Math.floor(score / 100) + 1}</span></p>
                )}
              </div>
              <div className="space-x-4">
                <button
                  onClick={resetGame}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={onBack}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Back to Templates
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls Help */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
          <h4 className="font-bold mb-2">Controls:</h4>
          <div className="text-sm space-y-1">
            {template.gameType === 'shooting' && (
              <>
                <div>WASD / Arrow Keys - Move</div>
                <div>Space - Shoot</div>
                <div>Avoid enemies 👾, collect stars ⭐</div>
              </>
            )}
            {template.gameType === 'running' && (
              <>
                <div>A/D or ←/→ - Move left/right</div>
                <div>Space - Jump</div>
                <div>Avoid obstacles 🚧, collect stars ⭐</div>
              </>
            )}
            {template.gameType === 'flying' && (
              <>
                <div>WASD or Arrow Keys - Fly</div>
                <div>Watch your fuel gauge!</div>
                <div>Collect stars ⭐ for fuel</div>
              </>
            )}
            {template.gameType === 'puzzle' && (
              <>
                <div>Arrow Keys - Move cursor</div>
                <div>Space - Select/Match</div>
                <div>Make matches to score!</div>
              </>
            )}
          </div>
        </div>

        {/* Game-specific UI elements */}
        {template.gameType === 'flying' && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg">
            <div className="text-sm">
              <div>Fuel: {Math.floor(gameSpecificState.fuel || 0)}%</div>
              <div className="w-24 bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${gameSpecificState.fuel || 0}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}