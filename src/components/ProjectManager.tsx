import React, { useState } from 'react';
import { X, Plus, Folder, Trash2, Download, Upload, Search, Calendar } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  type: '2D' | '3D';
  lastModified: string;
  thumbnail: string;
  size: string;
}

interface ProjectManagerProps {
  onClose: () => void;
}

export default function ProjectManager({ onClose }: ProjectManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Space Adventure',
      type: '3D',
      lastModified: '2024-01-15',
      thumbnail: '🚀',
      size: '45.2 MB'
    },
    {
      id: '2',
      name: 'Pixel Platformer',
      type: '2D',
      lastModified: '2024-01-14',
      thumbnail: '🎮',
      size: '12.8 MB'
    },
    {
      id: '3',
      name: 'Racing Game',
      type: '3D',
      lastModified: '2024-01-13',
      thumbnail: '🏎️',
      size: '78.5 MB'
    },
    {
      id: '4',
      name: 'Puzzle Quest',
      type: '2D',
      lastModified: '2024-01-12',
      thumbnail: '🧩',
      size: '23.1 MB'
    },
  ]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: `New Project ${projects.length + 1}`,
      type: '2D',
      lastModified: new Date().toISOString().split('T')[0],
      thumbnail: '🎯',
      size: '0 MB'
    };
    setProjects([newProject, ...projects]);
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const importProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.zip';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simulate import
        const newProject: Project = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: '2D',
          lastModified: new Date().toISOString().split('T')[0],
          thumbnail: '📁',
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
        };
        setProjects([newProject, ...projects]);
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-white font-semibold text-xl">Project Manager</h2>
            <p className="text-gray-400 text-sm">Manage your game projects</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={importProject}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            
            <button
              onClick={createNewProject}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-4xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">{project.thumbnail}</span>
                  
                  {/* Type Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                    project.type === '3D' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-green-600 text-white'
                  }`}>
                    {project.type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 truncate">{project.name}</h3>
                  
                  <div className="flex items-center space-x-2 text-gray-400 text-sm mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>{project.lastModified}</span>
                    <span>•</span>
                    <span>{project.size}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg transition-colors text-sm">
                      Open
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => deleteProject(project.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-lg font-medium mb-2">No projects found</h3>
              <p className="text-gray-400 mb-6">Create your first project to get started</p>
              <button
                onClick={createNewProject}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Create New Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}