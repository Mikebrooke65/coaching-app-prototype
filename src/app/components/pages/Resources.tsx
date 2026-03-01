import { FileText, Video, Image as ImageIcon, Download, Search, Folder } from "lucide-react";

export function Resources() {
  const folders = [
    { id: 1, name: "Coaching Manuals", icon: Folder, count: 12, color: "bg-blue-100 text-[#0091f3]" },
    { id: 2, name: "Coaching Tips", icon: Video, count: 24, color: "bg-orange-100 text-[#ea7800]" },
    { id: 3, name: "Field Layouts", icon: FileText, count: 36, color: "bg-gray-100 text-[#545859]" },
    { id: 4, name: "Marketing Materials", icon: ImageIcon, count: 18, color: "bg-green-100 text-green-600" },
  ];

  const recentFiles = [
    {
      id: 1,
      name: "WCR Coaching Philosophy 2026.pdf",
      type: "PDF Document",
      size: "2.4 MB",
      date: "Feb 24, 2026",
      icon: FileText,
    },
    {
      id: 2,
      name: "Passing Drill Demonstration.mp4",
      type: "Video",
      size: "45.8 MB",
      date: "Feb 22, 2026",
      icon: Video,
    },
    {
      id: 3,
      name: "Season 2026 Schedule Template.xlsx",
      type: "Spreadsheet",
      size: "156 KB",
      date: "Feb 20, 2026",
      icon: FileText,
    },
    {
      id: 4,
      name: "Team Photo Day Guidelines.pdf",
      type: "PDF Document",
      size: "892 KB",
      date: "Feb 18, 2026",
      icon: FileText,
    },
    {
      id: 5,
      name: "WCR Logo Pack 2026.zip",
      type: "Archive",
      size: "12.3 MB",
      date: "Feb 15, 2026",
      icon: ImageIcon,
    },
  ];

  return (
    <div className="px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-6 border-l-8 border-[#8b5cf6] pl-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Resources</h1>
        <p className="text-sm text-gray-600">Coaching materials and documents</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0091f3] focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Folders Grid */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-3">Browse by Category</h3>
        <div className="grid grid-cols-2 gap-3">
          {folders.map((folder) => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${folder.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-sm text-gray-900 mb-1">{folder.name}</h4>
                <p className="text-xs text-gray-500">{folder.count} files</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Files */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Recent Files</h3>
        <div className="space-y-2">
          {recentFiles.map((file) => {
            const Icon = file.icon;
            return (
              <div
                key={file.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 truncate">{file.name}</h4>
                  <p className="text-xs text-gray-500">
                    {file.type} • {file.size} • {file.date}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                  <Download className="w-5 h-5 text-[#0091f3]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}