import { useState } from 'react';
import { FileText, Video, Link as LinkIcon, Image as ImageIcon, Search, Download, Star } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'video' | 'pdf' | 'link' | 'image';
  url: string;
  uploadedAt: string;
  isFavorite?: boolean;
}

// Mock data
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Passing Drills for U10',
    description: 'Essential passing techniques and drills for young players',
    category: 'Training Drills',
    type: 'pdf',
    url: '#',
    uploadedAt: '2026-03-01',
  },
  {
    id: '2',
    title: 'Defensive Positioning Tutorial',
    description: 'Video guide on defensive positioning and tactics',
    category: 'Videos',
    type: 'video',
    url: '#',
    uploadedAt: '2026-02-28',
    isFavorite: true,
  },
  {
    id: '3',
    title: 'FIFA Coaching Guidelines',
    description: 'Official FIFA youth coaching guidelines',
    category: 'Documents',
    type: 'link',
    url: '#',
    uploadedAt: '2026-02-25',
  },
  {
    id: '4',
    title: 'Field Setup Diagrams',
    description: 'Training field setup diagrams for various drills',
    category: 'Training Drills',
    type: 'image',
    url: '#',
    uploadedAt: '2026-02-20',
    isFavorite: true,
  },
  {
    id: '5',
    title: 'Goalkeeping Basics',
    description: 'Fundamental goalkeeping techniques and exercises',
    category: 'Videos',
    type: 'video',
    url: '#',
    uploadedAt: '2026-02-15',
  },
];

const categories = ['All', 'Training Drills', 'Videos', 'Documents'];

export function Resources() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="p-4 pb-20">
      <div className="border-l-8 border-[#8b5cf6] pl-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-[#0091f3] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{resource.category}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                  </div>
                  
                  <button className="flex items-center gap-1 text-[#0091f3] text-sm font-medium hover:underline">
                    <Download className="w-4 h-4" />
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No resources found</p>
        </div>
      )}
    </div>
  );
}
