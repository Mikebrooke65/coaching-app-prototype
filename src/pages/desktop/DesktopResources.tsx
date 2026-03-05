import { useState } from 'react';
import { FileText, Video, Link as LinkIcon, Image as ImageIcon, Search, Download, Star, Upload, Trash2 } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'video' | 'pdf' | 'link' | 'image';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  isFavorite?: boolean;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Passing Drills for U10',
    description: 'Essential passing techniques and drills for young players',
    category: 'Training Drills',
    type: 'pdf',
    url: '#',
    uploadedBy: 'Admin',
    uploadedAt: '2026-03-01',
    tags: ['passing', 'u10', 'fundamentals'],
  },
  {
    id: '2',
    title: 'Defensive Positioning Tutorial',
    description: 'Video guide on defensive positioning and tactics',
    category: 'Videos',
    type: 'video',
    url: '#',
    uploadedBy: 'Coach Smith',
    uploadedAt: '2026-02-28',
    tags: ['defense', 'tactics', 'positioning'],
    isFavorite: true,
  },
  {
    id: '3',
    title: 'FIFA Coaching Guidelines',
    description: 'Official FIFA youth coaching guidelines',
    category: 'Documents',
    type: 'link',
    url: '#',
    uploadedBy: 'Admin',
    uploadedAt: '2026-02-25',
    tags: ['guidelines', 'fifa', 'youth'],
  },
];

const categories = ['All', 'Training Drills', 'Videos', 'Documents', 'Images'];

export function DesktopResources() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const filteredResources = mockResources.filter((resource) => {
    const matchesCategory =
      selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'link':
        return <LinkIcon className="w-5 h-5" />;
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-purple-100 text-purple-700';
      case 'pdf':
        return 'bg-red-100 text-red-700';
      case 'link':
        return 'bg-blue-100 text-blue-700';
      case 'image':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Resources Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0081d9] transition-colors">
          <Upload className="w-4 h-4" />
          Upload Resource
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-1/2 flex flex-col bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#0091f3] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedResource?.id === resource.id
                    ? 'border-[#0091f3] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                    {getIcon(resource.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      {resource.isFavorite && (
                        <Star className="w-4 h-4 text-[#ea7800] fill-current flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{resource.category}</span>
                      <span>•</span>
                      <span className="capitalize">{resource.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2 bg-white rounded-lg shadow p-6">
          {selectedResource ? (
            <div>
              <div className="flex items-start gap-3 mb-6">
                <div className={`p-3 rounded-lg ${getTypeColor(selectedResource.type)}`}>
                  {getIcon(selectedResource.type)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedResource.title}
                  </h2>
                  <p className="text-gray-600">{selectedResource.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{selectedResource.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{selectedResource.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uploaded by:</span>
                      <span className="font-medium text-gray-900">{selectedResource.uploadedBy}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0081d9] transition-colors">
                    <Download className="w-4 h-4" />
                    Download / Open
                  </button>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a resource to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
