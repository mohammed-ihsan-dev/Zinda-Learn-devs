import { useState } from "react";
import {
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
} from "lucide-react";

const mockUsers = [
  {
    _id: "1",
    name: "Dr. Helena Thorne",
    avatar: "https://i.pravatar.cc/150?img=47",
    lastMessage: "Great progress on the thesis...",
    unreadCount: 1,
  },
  {
    _id: "2",
    name: "Prof. Julia",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "The resource list has been updated",
    unreadCount: 2,
  },
];

const mockMessages = {
  "1": [
    {
      _id: "m1",
      sender: "1",
      message:
        "Hello Alex! I've finished reviewing your research proposal.",
      time: "10:20 AM",
    },
    {
      _id: "m2",
      sender: "me",
      message:
        "Thank you so much! Did it seem robust enough?",
      time: "10:22 AM",
    },
    {
      _id: "m3",
      sender: "1",
      message:
        "That was the strongest part. I've attached references.",
      time: "10:24 AM",
      file: true,
    },
  ],
};

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [messages, setMessages] = useState(mockMessages["1"]);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;

    setMessages([
      ...messages,
      {
        _id: Date.now(),
        sender: "me",
        message: text,
        time: "Now",
      },
    ]);

    setText("");
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100 rounded-xl overflow-hidden">

      {/* LEFT */}
      <div className="w-[320px] bg-white border-r flex flex-col">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Messages</h2>

          <input
            placeholder="Search conversations..."
            className="mt-3 w-full px-3 py-2 rounded-full bg-gray-100 text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setMessages(mockMessages[user._id]);
              }}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100"
            >
              <img src={user.avatar} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col bg-gray-50">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-3">
            <img
              src={selectedUser.avatar}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{selectedUser.name}</p>
              <p className="text-xs text-green-500">● Online</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            <button className="p-2 bg-gray-100 rounded-full">
              <Phone size={18} />
            </button>
            <button className="p-2 bg-gray-100 rounded-full">
              <Video size={18} />
            </button>
            <button className="p-2 bg-gray-100 rounded-full">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender === "me";

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div>
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-xs text-sm shadow ${
                      isMe
                        ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                        : "bg-white"
                    }`}
                  >
                    {msg.message}

                    {/* FILE CARD */}
                    {msg.file && (
                      <div className="mt-3 bg-gray-100 p-2 rounded-lg text-xs">
                        📄 Methodology_Reference.pdf
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] mt-1 text-gray-400 text-right">
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })}

          {/* TYPING */}
          <p className="text-xs text-gray-400">Tutor is typing...</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 px-4 pb-2">
          <button className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
            Ask a doubt
          </button>
          <button className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
            Request live help
          </button>
        </div>

        {/* INPUT */}
        <div className="p-3 bg-white border-t flex items-center gap-2">
          <Paperclip size={18} className="text-gray-500" />

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm"
          />

          <Smile size={18} className="text-gray-500" />

          <button
            onClick={sendMessage}
            className="bg-purple-600 text-white p-2 rounded-full"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;