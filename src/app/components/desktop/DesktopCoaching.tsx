import { useState } from "react";
import { Search, Plus, Filter, BookOpen, Clock, Users, Target } from "lucide-react";
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

interface Lesson {
  id: number;
  title: string;
  ageGroup: string;
  duration: string;
  focus: string;
  type: string;
  participants: number;
  delivered: boolean;
  deliveryDate?: string;
}

export function DesktopCoaching() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "Passing & Movement",
      ageGroup: "U10",
      duration: "60 min",
      focus: "Technical",
      type: "Technical",
      participants: 18,
      delivered: true,
      deliveryDate: "Feb 28, 2026"
    },
    {
      id: 2,
      title: "Defensive Shape & Positioning",
      ageGroup: "U12",
      duration: "75 min",
      focus: "Tactical",
      type: "Tactical",
      participants: 16,
      delivered: true,
      deliveryDate: "Feb 27, 2026"
    },
    {
      id: 3,
      title: "Ball Control & First Touch",
      ageGroup: "U8",
      duration: "45 min",
      focus: "Technical",
      type: "Technical",
      participants: 15,
      delivered: false
    },
    {
      id: 4,
      title: "Small-Sided Games",
      ageGroup: "U14",
      duration: "90 min",
      focus: "Game",
      type: "Game",
      participants: 20,
      delivered: false
    },
    {
      id: 5,
      title: "Speed & Agility",
      ageGroup: "U16",
      duration: "60 min",
      focus: "Physical",
      type: "Physical",
      participants: 19,
      delivered: true,
      deliveryDate: "Feb 25, 2026"
    },
    {
      id: 6,
      title: "Finishing & Shooting",
      ageGroup: "U12",
      duration: "60 min",
      focus: "Technical",
      type: "Technical",
      participants: 17,
      delivered: false
    },
  ];

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.ageGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.focus.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || lesson.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'tactical': return 'bg-purple-100 text-purple-800';
      case 'physical': return 'bg-green-100 text-green-800';
      case 'game': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#22c55e' }}>Coaching Sessions</h1>
        <p className="text-gray-600">Manage and deliver training sessions for your teams</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search lessons..."
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
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="tactical">Tactical</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
                <SelectItem value="game">Game</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="gap-2 bg-[#0091f3] hover:bg-[#0081d8]">
            <Plus className="w-4 h-4" />
            New Session
          </Button>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[#0091f3] hover:shadow-md transition-all cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#0091f3]/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-[#0091f3]" />
              </div>
              <Badge className={getTypeBadgeColor(lesson.type)}>
                {lesson.type}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 text-lg mb-3">{lesson.title}</h3>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                <span>Focus: {lesson.focus}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration} • {lesson.ageGroup}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{lesson.participants} players</span>
              </div>
            </div>

            {/* Status and Action */}
            <div className="pt-4 border-t border-gray-200">
              {lesson.delivered ? (
                <div>
                  <Badge className="bg-green-100 text-green-800 mb-2">
                    Delivered
                  </Badge>
                  <p className="text-xs text-gray-500">Delivered on {lesson.deliveryDate}</p>
                </div>
              ) : (
                <Button variant="outline" className="w-full" size="sm">
                  Start Session
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
          <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{lessons.filter(l => l.delivered).length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{lessons.filter(l => !l.delivered).length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Avg Participants</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(lessons.reduce((sum, l) => sum + l.participants, 0) / lessons.length)}
          </p>
        </div>
      </div>
    </div>
  );
}