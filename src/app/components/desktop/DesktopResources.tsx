import { useState } from "react";
import { Search, FileText, Video, Image, Download, Eye, Plus, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Resource {
  id: number;
  title: string;
  type: 'document' | 'video' | 'image';
  category: string;
  size: string;
  uploadDate: string;
  downloads: number;
}

export function DesktopResources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const resources: Resource[] = [
    {
      id: 1,
      title: "U12 Season Training Plan",
      type: "document",
      category: "Training Plans",
      size: "2.4 MB",
      uploadDate: "Feb 28, 2026",
      downloads: 45
    },
    {
      id: 2,
      title: "Passing Drills Video Tutorial",
      type: "video",
      category: "Video Library",
      size: "125 MB",
      uploadDate: "Feb 25, 2026",
      downloads: 32
    },
    {
      id: 3,
      title: "Field Formation Diagrams",
      type: "image",
      category: "Tactical Resources",
      size: "1.2 MB",
      uploadDate: "Feb 20, 2026",
      downloads: 28
    },
    {
      id: 4,
      title: "Coaching Philosophy Guide",
      type: "document",
      category: "Coaching Resources",
      size: "890 KB",
      uploadDate: "Feb 18, 2026",
      downloads: 67
    },
    {
      id: 5,
      title: "First Aid Procedures",
      type: "document",
      category: "Safety",
      size: "450 KB",
      uploadDate: "Feb 15, 2026",
      downloads: 89
    },
    {
      id: 6,
      title: "Defensive Tactics Breakdown",
      type: "video",
      category: "Video Library",
      size: "98 MB",
      uploadDate: "Feb 12, 2026",
      downloads: 41
    },
    {
      id: 7,
      title: "Player Assessment Forms",
      type: "document",
      category: "Forms & Templates",
      size: "320 KB",
      uploadDate: "Feb 10, 2026",
      downloads: 56
    },
    {
      id: 8,
      title: "Training Equipment Setup",
      type: "image",
      category: "Training Plans",
      size: "2.1 MB",
      uploadDate: "Feb 8, 2026",
      downloads: 34
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || resource.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'video': return <Video className="w-5 h-5 text-purple-600" />;
      case 'image': return <Image className="w-5 h-5 text-green-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'image': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#8b5cf6' }}>Resource Library</h1>
        <p className="text-gray-600">Access training plans, videos, and coaching materials</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="image">Images</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="gap-2 bg-[#0091f3] hover:bg-[#0081d8]">
            <Plus className="w-4 h-4" />
            Upload Resource
          </Button>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[#0091f3] hover:shadow-md transition-all"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                {getTypeIcon(resource.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                <p className="text-sm text-gray-500">{resource.category}</p>
              </div>
              <Badge className={getTypeBadgeColor(resource.type)}>
                {resource.type}
              </Badge>
            </div>

            {/* Details */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>{resource.size}</span>
              <span>•</span>
              <span>{resource.uploadDate}</span>
              <span>•</span>
              <span>{resource.downloads} downloads</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm" className="flex-1 gap-2">
                <Eye className="w-4 h-4" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Resources</p>
          <p className="text-2xl font-bold text-gray-900">{resources.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Documents</p>
          <p className="text-2xl font-bold text-blue-600">
            {resources.filter(r => r.type === 'document').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Videos</p>
          <p className="text-2xl font-bold text-purple-600">
            {resources.filter(r => r.type === 'video').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Downloads</p>
          <p className="text-2xl font-bold text-gray-900">
            {resources.reduce((sum, r) => sum + r.downloads, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}