import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, Plus, Trash2, Copy, Scissors, Eye, EyeOff } from 'lucide-react';

interface Keyframe {
  id: string;
  time: number;
  value: number;
  property: string;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

interface AnimationTrack {
  id: string;
  name: string;
  property: string;
  visible: boolean;
  locked: boolean;
  keyframes: Keyframe[];
}

export default function AnimationTimeline() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10); // 10 seconds
  const [fps, setFps] = useState(60);
  const [zoom, setZoom] = useState(1);
  const [selectedKeyframes, setSelectedKeyframes] = useState<string[]>([]);
  const [showTimeline, setShowTimeline] = useState(true);
  
  const [tracks, setTracks] = useState<AnimationTrack[]>([
    {
      id: 'pos-x',
      name: 'Position X',
      property: 'position-x',
      visible: true,
      locked: false,
      keyframes: [
        { id: '1', time: 0, value: 0, property: 'position-x', easing: 'ease-out' },
        { id: '2', time: 2, value: 100, property: 'position-x', easing: 'ease-in-out' },
        { id: '3', time: 5, value: 200, property: 'position-x', easing: 'ease-in' },
      ]
    },
    {
      id: 'pos-y',
      name: 'Position Y',
      property: 'position-y',
      visible: true,
      locked: false,
      keyframes: [
        { id: '4', time: 1, value: 0, property: 'position-y', easing: 'linear' },
        { id: '5', time: 3, value: -50, property: 'position-y', easing: 'ease-out' },
      ]
    },
    {
      id: 'rotation',
      name: 'Rotation',
      property: 'rotation',
      visible: true,
      locked: false,
      keyframes: [
        { id: '6', time: 0, value: 0, property: 'rotation', easing: 'linear' },
        { id: '7', time: 4, value: 360, property: 'rotation', easing: 'linear' },
      ]
    },
    {
      id: 'scale',
      name: 'Scale',
      property: 'scale',
      visible: true,
      locked: false,
      keyframes: [
        { id: '8', time: 0, value: 1, property: 'scale', easing: 'ease-in-out' },
        { id: '9', time: 2.5, value: 1.5, property: 'scale', easing: 'ease-in-out' },
        { id: '10', time: 5, value: 1, property: 'scale', easing: 'ease-in-out' },
      ]
    },
  ]);

  const timelineRef = useRef<HTMLDivElement>(null);
  const playbackRef = useRef<number | null>(null);

  // Animation playback
  useEffect(() => {
    if (isPlaying) {
      playbackRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + (1 / fps);
          if (newTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 1000 / fps);
    } else {
      if (playbackRef.current) {
        clearInterval(playbackRef.current);
        playbackRef.current = null;
      }
    }

    return () => {
      if (playbackRef.current) {
        clearInterval(playbackRef.current);
      }
    };
  }, [isPlaying, fps, duration]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const skipToStart = () => {
    setCurrentTime(0);
  };

  const skipToEnd = () => {
    setCurrentTime(duration);
  };

  const addKeyframe = (trackId: string, time: number) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track || track.locked) return;

    const newKeyframe: Keyframe = {
      id: Date.now().toString(),
      time,
      value: 0,
      property: track.property,
      easing: 'ease-in-out',
    };

    setTracks(tracks.map(t =>
      t.id === trackId
        ? { ...t, keyframes: [...t.keyframes, newKeyframe].sort((a, b) => a.time - b.time) }
        : t
    ));
  };

  const deleteKeyframe = (keyframeId: string) => {
    setTracks(tracks.map(track => ({
      ...track,
      keyframes: track.keyframes.filter(kf => kf.id !== keyframeId)
    })));
    setSelectedKeyframes(selectedKeyframes.filter(id => id !== keyframeId));
  };

  const selectKeyframe = (keyframeId: string, multiSelect: boolean = false) => {
    if (multiSelect) {
      setSelectedKeyframes(prev =>
        prev.includes(keyframeId)
          ? prev.filter(id => id !== keyframeId)
          : [...prev, keyframeId]
      );
    } else {
      setSelectedKeyframes([keyframeId]);
    }
  };

  const toggleTrackVisibility = (trackId: string) => {
    setTracks(tracks.map(track =>
      track.id === trackId ? { ...track, visible: !track.visible } : track
    ));
  };

  const toggleTrackLock = (trackId: string) => {
    setTracks(tracks.map(track =>
      track.id === trackId ? { ...track, locked: !track.locked } : track
    ));
  };

  const addNewTrack = () => {
    const newTrack: AnimationTrack = {
      id: `track-${Date.now()}`,
      name: `New Track ${tracks.length + 1}`,
      property: 'custom',
      visible: true,
      locked: false,
      keyframes: [],
    };
    setTracks([...tracks, newTrack]);
  };

  const getTimelineWidth = () => duration * 100 * zoom;

  if (!showTimeline) {
    return (
      <button
        onClick={() => setShowTimeline(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors z-10"
      >
        <Play className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="h-80 bg-gray-950 border-t border-gray-800 flex flex-col">
      {/* Timeline Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <h3 className="text-white font-semibold">Animation Timeline</h3>
          <button
            onClick={() => setShowTimeline(false)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        
        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={skipToStart}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button
            onClick={togglePlayback}
            className={`p-2 rounded transition-colors ${
              isPlaying 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={stopPlayback}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Square className="w-4 h-4" />
          </button>
          
          <button 
            onClick={skipToEnd}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Time Display */}
        <div className="flex items-center space-x-4">
          <div className="text-white text-sm font-mono">
            {currentTime.toFixed(2)}s / {duration.toFixed(1)}s
          </div>
          <div className="text-gray-400 text-sm">
            Frame: {Math.floor(currentTime * fps)}
          </div>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="flex items-center justify-between p-2 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center space-x-2">
          <button 
            onClick={addNewTrack}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Scissors className="w-4 h-4" />
          </button>
          <button 
            onClick={() => selectedKeyframes.forEach(deleteKeyframe)}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-gray-400 text-sm">FPS:</label>
            <select
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value))}
              className="bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-700"
            >
              <option value={24}>24</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
              <option value={120}>120</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-gray-400 text-sm">Zoom:</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-20 accent-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track Names */}
        <div className="w-40 bg-gray-900 border-r border-gray-800 overflow-y-auto">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="h-12 px-3 flex items-center justify-between border-b border-gray-800 hover:bg-gray-800 transition-colors"
            >
              <span className={`text-sm truncate ${track.visible ? 'text-gray-300' : 'text-gray-500'}`}>
                {track.name}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => toggleTrackVisibility(track.id)}
                  className={`p-1 rounded transition-colors ${
                    track.visible ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  {track.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => toggleTrackLock(track.id)}
                  className={`p-1 rounded transition-colors ${
                    track.locked ? 'text-red-400' : 'text-gray-400'
                  }`}
                >
                  <Square className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Tracks */}
        <div className="flex-1 relative overflow-auto" ref={timelineRef}>
          {/* Time Ruler */}
          <div className="h-8 bg-gray-900 border-b border-gray-800 flex items-center relative sticky top-0 z-10">
            <div className="relative" style={{ width: getTimelineWidth() }}>
              {Array.from({ length: Math.ceil(duration * 4) + 1 }, (_, i) => {
                const time = i * 0.25;
                const isSecond = time % 1 === 0;
                return (
                  <div
                    key={i}
                    className="absolute text-xs text-gray-400 flex flex-col items-center"
                    style={{ left: `${(time / duration) * 100}%` }}
                  >
                    <div className={`w-px bg-gray-600 ${isSecond ? 'h-4' : 'h-2'}`} />
                    {isSecond && <span className="mt-1">{time.toFixed(0)}s</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracks */}
          <div className="relative">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`h-12 border-b border-gray-800 relative hover:bg-gray-800/30 cursor-pointer ${
                  !track.visible ? 'opacity-50' : ''
                }`}
                onClick={(e) => {
                  if (track.locked) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const time = (x / (getTimelineWidth())) * duration;
                  addKeyframe(track.id, Math.max(0, Math.min(duration, time)));
                }}
                style={{ width: getTimelineWidth() }}
              >
                {/* Keyframes for this track */}
                {track.keyframes.map((keyframe) => (
                  <div
                    key={keyframe.id}
                    className={`absolute w-4 h-4 rounded-full transform -translate-x-2 -translate-y-2 cursor-move hover:scale-125 transition-transform ${
                      selectedKeyframes.includes(keyframe.id)
                        ? 'bg-yellow-400 ring-2 ring-yellow-300'
                        : 'bg-cyan-400 hover:bg-cyan-300'
                    }`}
                    style={{
                      left: `${(keyframe.time / duration) * 100}%`,
                      top: '50%',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectKeyframe(keyframe.id, e.ctrlKey || e.metaKey);
                    }}
                    title={`${keyframe.property}: ${keyframe.value} at ${keyframe.time.toFixed(2)}s (${keyframe.easing})`}
                  />
                ))}

                {/* Animation curves between keyframes */}
                {track.keyframes.length > 1 && (
                  <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                    {track.keyframes.slice(0, -1).map((keyframe, i) => {
                      const nextKeyframe = track.keyframes[i + 1];
                      const x1 = (keyframe.time / duration) * 100;
                      const x2 = (nextKeyframe.time / duration) * 100;
                      return (
                        <line
                          key={`${keyframe.id}-${nextKeyframe.id}`}
                          x1={`${x1}%`}
                          y1="50%"
                          x2={`${x2}%`}
                          y2="50%"
                          stroke="rgba(34, 211, 238, 0.5)"
                          strokeWidth="2"
                          strokeDasharray={keyframe.easing === 'linear' ? 'none' : '4,2'}
                        />
                      );
                    })}
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-8 bottom-0 w-0.5 bg-red-500 pointer-events-none z-20"
            style={{ left: `${(currentTime / duration) * getTimelineWidth()}px` }}
          >
            <div className="w-4 h-4 bg-red-500 transform -translate-x-1/2 -translate-y-2 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}