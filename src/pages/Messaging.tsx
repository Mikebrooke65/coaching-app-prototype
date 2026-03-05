import { useState } from 'react';
import { MessageCircle, Send, Search, ArrowLeft } from 'lucide-react';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
  isGroup: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'U12 Boys Team',
    lastMessage: 'Great practice today everyone!',
    timestamp: '2:30 PM',
    unread: 2,
    isGroup: true,
  },
  {
    id: '2',
    name: 'Coach Smith',
    lastMessage: 'Can you send me the training plan?',
    timestamp: '1:15 PM',
    unread: 0,
    isGroup: false,
  },
  {
    id: '3',
    name: 'Coaches Group',
    lastMessage: 'Meeting scheduled for next week',
    timestamp: 'Yesterday',
    unread: 5,
    isGroup: true,
  },
  {
    id: '4',
    name: 'Parent - John Smith',
    lastMessage: 'Thanks for the update',
    timestamp: 'Monday',
    unread: 0,
    isGroup: false,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Coach Smith',
    content: 'Great practice today everyone!',
    timestamp: '2:25 PM',
    isOwn: false,
  },
  {
    id: '2',
    sender: 'You',
    content: 'Thanks! The team is really improving',
    timestamp: '2:27 PM',
    isOwn: true,
  },
  {
    id: '3',
    sender: 'Coach Johnson',
    content: 'Agreed, especially with passing drills',
    timestamp: '2:28 PM',
    isOwn: false,
  },
  {
    id: '4',
    sender: 'You',
    content: 'Next session we should focus on positioning',
    timestamp: '2:30 PM',
    isOwn: true,
  },
];

export function Messaging() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle send message
      setMessageInput('');
    }
  };

  if (selectedConversation) {
    return (
      <div className="flex flex-col h-screen">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedConversation(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">{selectedConversation.name}</h2>
              <p className="text-sm text-gray-600">
                {selectedConversation.isGroup ? 'Group Chat' : 'Direct Message'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.isOwn
                    ? 'bg-[#0091f3] text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                {!message.isOwn && (
                  <p className="text-xs font-medium mb-1 opacity-70">{message.sender}</p>
                )}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4 pb-safe">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0081d9] transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="border-l-8 border-[#545859] pl-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
        />
      </div>

      {/* Conversations List */}
      <div className="space-y-2">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation)}
            className="bg-white rounded-lg shadow p-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#0091f3] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {conversation.name.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {conversation.timestamp}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#0091f3] text-white text-xs font-medium rounded-full flex-shrink-0">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredConversations.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No conversations found</p>
        </div>
      )}
    </div>
  );
}
