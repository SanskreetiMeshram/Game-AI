import React, { useState, useRef, useEffect } from 'react';
import { Move, RotateCw, Square, Circle, Triangle, Maximize2, Minimize2, Grid3X3, Eye, EyeOff } from 'lucide-react';

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

interface GameEditorProps {
  isPlayMode: boolean;
  gameObjects: GameObject[];
  onObjectsChange: (objects: GameObject[]) => void;
  is3D: boolean;
  onModeChange: (is3D: boolean) => void;
}

export default function GameEditor({ isPlayMode, gameObjects, onObjectsChange, is3D, onModeChange }: GameEditorProps) {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [tool, setTool] = useState<'move' | 'rotate' | 'scale'>('move');
  const [showGrid, setShowGrid] = useState(true);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, zoom: 1 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLDivElement>(null);
  const [playerObject, setPlayerObject] = useState<GameObject | null>(null);

  // Find player object for game controls
  useEffect(() => {
    const player = gameObjects.find(obj => obj.type === 'player' || obj.behaviors.includes('player'));
    setPlayerObject(player || null);
  }, [gameObjects]);

  // Keyboard controls for play mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPlayMode && playerObject) {
        setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isPlayMode && playerObject) {
        setKeys(prev => {
          const newKeys = new Set(prev);
          newKeys.delete(e.key.toLowerCase());
          return newKeys;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlayMode, playerObject]);

  // Game loop for play mode
  useEffect(() => {
    if (!isPlayMode || !playerObject) return;

    const gameLoop = setInterval(() => {
      onObjectsChange(gameObjects.map(obj => {
        if (obj.id === playerObject.id) {
          let newX = obj.x;
          let newY = obj.y;
          let newZ = obj.z || 0;

          // Movement controls
          const speed = 5;
          if (keys.has('w') || keys.has('arrowup')) {
            if (is3D) newZ -= speed;
            else newY -= speed;
          }
          if (keys.has('s') || keys.has('arrowdown')) {
            if (is3D) newZ += speed;
            else newY += speed;
          }
          if (keys.has('a') || keys.has('arrowleft')) {
            newX -= speed;
          }
          if (keys.has('d') || keys.has('arrowright')) {
            newX += speed;
          }
          if (keys.has(' ') && obj.behaviors.includes('jump')) {
            // Jump behavior
            newY -= 10;
          }

          // Boundary checks
          newX = Math.max(0, Math.min(800, newX));
          newY = Math.max(0, Math.min(600, newY));
          if (is3D) newZ = Math.max(-200, Math.min(200, newZ));

          return { ...obj, x: newX, y: newY, z: newZ };
        }
        return obj;
      }));
    }, 16); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [isPlayMode, playerObject, keys, gameObjects, onObjectsChange, is3D]);

  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'player': return <Circle className="w-6 h-6" />;
      case 'enemy': return <Triangle className="w-6 h-6" />;
      case 'platform': return <Square className="w-6 h-6" />;
      case 'character': return <Circle className="w-6 h-6" />;
      case '3d-model': return <Square className="w-6 h-6" />;
      case 'environment': return <Square className="w-6 h-6" />;
      default: return <Circle className="w-6 h-6" />;
    }
  };

  const handleObjectClick = (objectId: string, event: React.MouseEvent) => {
    if (isPlayMode) return;
    event.stopPropagation();
    setSelectedObject(objectId);
  };

  const handleObjectDrag = (objectId: string, event: React.MouseEvent) => {
    if (isPlayMode) return;
    
    const startX = event.clientX;
    const startY = event.clientY;
    const object = gameObjects.find(obj => obj.id === objectId);
    if (!object) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - startX) / cameraPosition.zoom;
      const deltaY = (e.clientY - startY) / cameraPosition.zoom;
      
      onObjectsChange(gameObjects.map(obj => 
        obj.id === objectId 
          ? { 
              ...obj, 
              x: Math.max(0, Math.min(800, object.x + deltaX)),
              y: Math.max(0, Math.min(600, object.y + deltaY))
            }
          : obj
      ));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (isPlayMode) return;
    setSelectedObject(null);
  };

  const handleWheel = (event: React.WheelEvent) => {
    if (isPlayMode) return;
    event.preventDefault();
    
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setCameraPosition(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(3, prev.zoom * zoomFactor))
    }));
  };

  return (
    <div className="flex-1 bg-gray-900 relative overflow-hidden">
      {/* Editor Controls */}
      {!isPlayMode && (
        <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
          <div className="bg-gray-800 rounded-lg p-2 flex flex-col space-y-2">
            <button
              onClick={() => setTool('move')}
              className={`p-3 rounded-lg transition-colors ${
                tool === 'move' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Move className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTool('rotate')}
              className={`p-3 rounded-lg transition-colors ${
                tool === 'rotate' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-2 flex flex-col space-y-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-3 rounded-lg transition-colors ${
                showGrid ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 2D/3D Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gray-800 rounded-lg p-2 flex space-x-2">
          <button
            onClick={() => onModeChange(false)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !is3D ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            2D
          </button>
          <button
            onClick={() => onModeChange(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              is3D ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            3D
          </button>
        </div>
      </div>

      {/* Grid Background */}
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * cameraPosition.zoom}px ${20 * cameraPosition.zoom}px`,
            transform: `translate(${cameraPosition.x}px, ${cameraPosition.y}px)`
          }}
        />
      )}

      {/* Editor Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        style={{
          transform: `scale(${cameraPosition.zoom}) translate(${cameraPosition.x}px, ${cameraPosition.y}px)`
        }}
      >
        {/* Render Game Objects */}
        {gameObjects.map((obj) => (
          <div
            key={obj.id}
            className={`absolute transform transition-all duration-200 ${
              selectedObject === obj.id ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900' : ''
            } ${isPlayMode ? 'cursor-default' : 'cursor-move hover:scale-110'}`}
            style={{
              left: obj.x,
              top: obj.y,
              transform: `
                rotate(${obj.rotation}deg) 
                scale(${obj.scale})
                ${is3D ? `translateZ(${obj.z || 0}px) perspective(1000px)` : ''}
              `,
              color: obj.color,
              zIndex: is3D ? Math.floor((obj.z || 0) + 100) : 'auto',
            }}
            onClick={(e) => handleObjectClick(obj.id, e)}
            onMouseDown={(e) => handleObjectDrag(obj.id, e)}
          >
            <div className={`p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-400 transition-colors shadow-lg ${
              is3D ? 'shadow-2xl' : ''
            }`}>
              {getObjectIcon(obj.type)}
              
              {/* Object Label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                {obj.type}
              </div>

              {/* Behavior Indicators */}
              {obj.behaviors.length > 0 && (
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        ))}

        {/* Play Mode Overlay */}
        {isPlayMode && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center pointer-events-none">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
              🎮 PLAY MODE - Use WASD or Arrow Keys to Move
            </div>
          </div>
        )}

        {/* 3D Perspective Indicators */}
        {is3D && !isPlayMode && (
          <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 p-3 rounded-lg">
            <div className="text-white text-sm font-medium mb-2">3D View</div>
            <div className="text-gray-400 text-xs space-y-1">
              <div>X: Horizontal</div>
              <div>Y: Vertical</div>
              <div>Z: Depth</div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm">
        {isPlayMode ? (
          <span>Playing • {gameObjects.length} Objects</span>
        ) : (
          <span>
            Editor • {gameObjects.length} Objects • 
            {selectedObject ? ' 1 Selected' : ' None Selected'} • 
            Zoom: {Math.round(cameraPosition.zoom * 100)}% •
            {is3D ? ' 3D Mode' : ' 2D Mode'}
          </span>
        )}
      </div>
    </div>
  );
}