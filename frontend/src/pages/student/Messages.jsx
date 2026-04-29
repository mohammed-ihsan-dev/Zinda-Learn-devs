import { useState, useEffect, useRef } from "react";
import {
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Search,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getConversations, getConversation, sendMessage } from "../../services/messageService";
import toast from "react-hot-toast";

const Messages = () => {
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data.conversations || []);
      if (data.conversations?.length > 0 && !selectedUser) {
        setSelectedUser(data.conversations[0].user);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    setMessagesLoading(true);
    try {
      const data = await getConversation(userId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const messageContent = text;
    setText("");

    try {
      const data = await sendMessage(selectedUser._id, messageContent);
      setMessages([...messages, data.message]);
      
      // Update conversations list to show last message
      fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setText(messageContent); // Put text back if failed
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200">
      
      {/* LEFT: CONVERSATIONS LIST */}
      <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 border border-transparent focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv.user._id}
                onClick={() => setSelectedUser(conv.user)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-l-4 ${
                  selectedUser?._id === conv.user._id
                    ? "bg-purple-50 border-purple-600"
                    : "hover:bg-gray-50 border-transparent"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.user.avatar || "https://ui-avatars.com/api/?name=" + conv.user.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    alt={conv.user.name}
                  />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-sm font-bold text-gray-900 truncate">{conv.user.name}</p>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: CHAT AREA */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedUser ? (
          <>
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedUser.avatar || "https://ui-avatars.com/api/?name=" + selectedUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    alt={selectedUser.name}
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedUser.name}</p>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Online</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                  <Phone size={18} />
                </button>
                <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                  <Video size={18} />
                </button>
                <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messagesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = msg.sender._id === currentUser?._id;

                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                            isMe
                              ? "bg-purple-600 text-white rounded-tr-none"
                              : "bg-white text-gray-800 rounded-tl-none"
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="text-[10px] mt-1.5 text-gray-400 font-medium px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                  <Send className="w-12 h-12 mb-3" />
                  <p className="text-sm font-medium">Say hello to {selectedUser.name}!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* QUICK ACTIONS */}
            <div className="flex gap-2 px-4 pb-3">
              <button className="px-4 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-full text-xs font-bold transition-colors">
                Ask a doubt
              </button>
              <button className="px-4 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-full text-xs font-bold transition-colors">
                Request live help
              </button>
            </div>

            {/* INPUT AREA */}
            <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-3">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip size={20} />
              </button>

              <div className="flex-1 relative">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="w-full px-5 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 border border-transparent focus:border-purple-500 transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Smile size={20} />
                </button>
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!text.trim()}
                className={`p-3 rounded-2xl transition-all ${
                  text.trim()
                    ? "bg-purple-600 text-white shadow-md hover:bg-purple-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <Send size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Select a conversation</h3>
            <p className="text-gray-500 max-w-xs">Choose a contact from the list to start messaging and get your doubts cleared.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;