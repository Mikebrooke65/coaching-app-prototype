import { useState } from 'react';
import { MessageCircle, Send, Search, Plus, Users } from 'lucide-react';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isGroup: boolean;
  participants?: number;
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
    participants: 18,
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
    participants: 8,
  },
  {
    id: '4',
    name: 'Parent - John Smith',
    lastMessage: 'Thanks for the update',
    timestamp: 'Monday',
    unread: 0,
    isGroup: false,
  },
  {
    id: '5',
    name: 'U10 Girls Team',
    lastMessage: 'Match rescheduled to Saturday',
    timestamp: 'Tuesday',
    unread: 1,
    isGroup: true,
    participants: 15,
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

export function DesktopMessaging() {
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

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messaging</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0081d9] transition-colors">
          <Plus className="w-4 h-4" />
          New Message
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Panel - Conversations List */}
        <div className="w-1/3 flex flex-col bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-blue-50 border-l-4 border-l-[#0091f3]'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#0091f3] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {conversation.isGroup ? (
                      <Users className="w-5 h-5" />
                    ) : (
                      conversation.name.charAt(0)
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate text-sm">
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
                    
                    {conversation.isGroup && conversation.participants && (
                      <p className="text-xs text-gray-500 mt-1">
                        {conversation.participants} participants
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0091f3] rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedConversation.isGroup ? (
                      <Users className="w-5 h-5" />
                    ) : (
                      selectedConversation.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-900">{selectedConversation.name}</h2>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.isGroup 
                        ? `${selectedConversation.participants} participants` 
                        : 'Direct Message'}
                    </p>
                  </div>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Details
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[60%] rounded-lg p-3 ${
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
              <div className="p-4 border-t border-gray-200">
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
                    className="px-6 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0081d9] transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
