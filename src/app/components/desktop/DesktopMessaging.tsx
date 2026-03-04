import { useState } from "react";
import { Search, Send, MoreVertical, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { User } from "../../App";
import { Badge } from "../ui/badge";

interface DesktopMessagingProps {
  user: User;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export function DesktopMessaging({ user }: DesktopMessagingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<number>(1);
  const [messageText, setMessageText] = useState("");

  const conversations: Conversation[] = [
    {
      id: 1,
      name: "U10 Rangers Coaches",
      lastMessage: "Great session today! The kids loved the dribbling drills.",
      timestamp: "2m ago",
      unread: 2,
      avatar: "UC"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      lastMessage: "Can we reschedule tomorrow's training?",
      timestamp: "1h ago",
      unread: 1,
      avatar: "SJ"
    },
    {
      id: 3,
      name: "All Coaches",
      lastMessage: "Meeting reminder: Monday 7 PM at the club house",
      timestamp: "3h ago",
      unread: 0,
      avatar: "AC"
    },
    {
      id: 4,
      name: "Michael Brown",
      lastMessage: "Thanks for sharing those drill videos!",
      timestamp: "1d ago",
      unread: 0,
      avatar: "MB"
    },
    {
      id: 5,
      name: "U12 Blue Parents",
      lastMessage: "Game time confirmed for Saturday at 10 AM",
      timestamp: "2d ago",
      unread: 0,
      avatar: "UP"
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hey! How did the training session go today?",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: user.name,
      content: "It went really well! The kids were super engaged with the passing drills.",
      timestamp: "10:32 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content: "That's great to hear! I've been working on their first touch.",
      timestamp: "10:35 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: user.name,
      content: "Perfect timing! We should coordinate our sessions so we're building on each other's work.",
      timestamp: "10:37 AM",
      isOwn: true
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      content: "Great idea! Can we reschedule tomorrow's training? I have a conflict.",
      timestamp: "10:40 AM",
      isOwn: false
    },
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle send logic here
      setMessageText("");
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: '#545859' }}>Messages</h2>
            <Button size="sm" className="gap-2 bg-[#0091f3] hover:bg-[#0081d8]">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-[#0091f3]' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0091f3] text-white flex items-center justify-center font-semibold flex-shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <Badge className="ml-2 bg-[#0091f3] text-white hover:bg-[#0091f3] flex-shrink-0">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0091f3] text-white flex items-center justify-center font-semibold">
                    {selectedConv.avatar}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedConv.name}</h2>
                    <p className="text-sm text-gray-500">Active now</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.isOwn
                            ? 'bg-[#0091f3] text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        {!message.isOwn && (
                          <p className="text-xs font-semibold mb-1 opacity-70">{message.sender}</p>
                        )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 px-2 ${message.isOwn ? 'text-right' : ''}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3">
                  <Textarea
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 resize-none"
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="gap-2 bg-[#0091f3] hover:bg-[#0081d8]"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}