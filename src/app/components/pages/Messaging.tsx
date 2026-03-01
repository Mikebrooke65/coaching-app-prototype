import { MessageSquare, Send, Search, MoreVertical, Phone, Video } from "lucide-react";
import { User } from "../../App";
import { useState } from "react";

interface MessagingProps {
  user: User;
}

export function Messaging({ user }: MessagingProps) {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const conversations = [
    {
      id: 1,
      name: "U14 Blue Team",
      type: "group" as const,
      lastMessage: "Great practice today! See you Thursday.",
      timestamp: "2:45 PM",
      unread: 3,
      avatar: "👥",
    },
    {
      id: 2,
      name: "Coach Sarah Williams",
      type: "direct" as const,
      lastMessage: "Can you cover my session tomorrow?",
      timestamp: "1:20 PM",
      unread: 1,
      avatar: "SW",
    },
    {
      id: 3,
      name: "U12 White Coaches",
      type: "group" as const,
      lastMessage: "Updated the drill plan for Saturday",
      timestamp: "Yesterday",
      unread: 0,
      avatar: "👥",
    },
    {
      id: 4,
      name: "Admin Team",
      type: "group" as const,
      lastMessage: "New equipment arrived at the clubhouse",
      timestamp: "Yesterday",
      unread: 0,
      avatar: "⚙️",
    },
    {
      id: 5,
      name: "Coach Michael Chen",
      type: "direct" as const,
      lastMessage: "Thanks for the session plan!",
      timestamp: "Tuesday",
      unread: 0,
      avatar: "MC",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Coach Emma Davis",
      content: "Great passing drills today team! Really impressed with the improvement.",
      timestamp: "2:30 PM",
      isOwn: false,
      avatar: "ED",
    },
    {
      id: 2,
      sender: user.name,
      content: "Thanks Emma! The players are really buying into the new system.",
      timestamp: "2:35 PM",
      isOwn: true,
      avatar: user.name.split(' ').map(n => n[0]).join(''),
    },
    {
      id: 3,
      sender: "Coach Tom Rodriguez",
      content: "Anyone have extra cones? Left mine at home 😅",
      timestamp: "2:40 PM",
      isOwn: false,
      avatar: "TR",
    },
    {
      id: 4,
      sender: user.name,
      content: "I have a spare set! I'll bring them.",
      timestamp: "2:42 PM",
      isOwn: true,
      avatar: user.name.split(' ').map(n => n[0]).join(''),
    },
    {
      id: 5,
      sender: "Coach Emma Davis",
      content: "Perfect! See everyone at 4pm.",
      timestamp: "2:45 PM",
      isOwn: false,
      avatar: "ED",
    },
  ];

  if (selectedChat === null) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <div className="px-4 pt-6 pb-4 bg-white border-b border-gray-200">
          {/* Header */}
          <div className="mb-4 border-l-8 border-[#545859] pl-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Messaging</h1>
            <p className="text-sm text-gray-600">Team communications</p>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0091f3] focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#0091f3] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold">
                    {conversation.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-gray-900 truncate">
                        {conversation.name}
                      </h4>
                      <span className="text-xs text-gray-500 ml-2">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="w-6 h-6 bg-[#ea7800] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{conversation.unread}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentConversation = conversations.find(c => c.id === selectedChat);

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedChat(null)}
              className="text-[#0091f3] font-medium text-sm"
            >
              ← Back
            </button>
            <div className="w-10 h-10 bg-[#0091f3] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {currentConversation?.avatar}
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                {currentConversation?.name}
              </h3>
              <p className="text-xs text-gray-500">
                {currentConversation?.type === 'group' ? 'Group chat' : 'Active now'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20 bg-gray-50">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isOwn && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700 mr-2 flex-shrink-0">
                  {message.avatar}
                </div>
              )}
              <div className={`max-w-[75%] ${message.isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                {!message.isOwn && (
                  <span className="text-xs text-gray-600 mb-1 ml-1">{message.sender}</span>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.isOwn
                      ? 'bg-[#0091f3] text-white rounded-br-sm'
                      : 'bg-white text-gray-900 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1 ml-1">{message.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 pb-20">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0091f3] focus:border-transparent text-sm"
          />
          <button className="w-10 h-10 bg-[#0091f3] rounded-full flex items-center justify-center text-white hover:bg-[#0081d8] transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}