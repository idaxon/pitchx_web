import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MessagesPage: React.FC = () => {
  const { users, currentUser } = useApp();
  const peers = users.filter((u) => u.id !== currentUser.id);

  const [selectedPeer, setSelectedPeer] = useState(peers[0]);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    {
      sender: 'them',
      text: 'Hey Alex, saw your ATS analyzer architecture. Loved the OCR bounding box logic!',
      time: '10:30 AM',
    },
    {
      sender: 'me',
      text: 'Thanks Rahul! Spent quite a bit of time optimizing against irregular 2-column resume formats.',
      time: '10:35 AM',
    },
    {
      sender: 'them',
      text: 'Are you planning to open-source the tokenizer chunking module as well?',
      time: '10:42 AM',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: 'me', text: inputVal, time: 'Just now' },
    ]);
    setInputVal('');
  };

  return (
    <div className="bg-white border border-[#DFDFD9] rounded-2xl shadow-subtle overflow-hidden h-[750px] flex flex-col md:flex-row animate-fade-in">
      {/* Left Conversations List */}
      <div className="w-full md:w-80 border-r border-[#DFDFD9] flex flex-col bg-[#F9F8F4]">
        <div className="p-4 border-b border-[#DFDFD9]">
          <h2 className="font-extrabold text-sm text-[#1A1A19]">Direct Inquiries</h2>
          <p className="text-[11px] text-[#1A1A19]/60">Architectural inquiries & peer discussions</p>
        </div>
        <div className="overflow-y-auto flex-1 divide-y divide-[#DFDFD9]/60">
          {peers.map((peer) => (
            <button
              key={peer.id}
              onClick={() => setSelectedPeer(peer)}
              className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors ${
                selectedPeer.id === peer.id ? 'bg-white font-bold' : 'hover:bg-white/60'
              }`}
            >
              <img
                src={peer.avatar}
                alt={peer.name}
                className="w-10 h-10 rounded-lg object-cover border border-[#DFDFD9]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A1A19] truncate">
                    {peer.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#1A1A19]/40">Active</span>
                </div>
                <p className="text-xs text-[#1A1A19]/60 truncate font-normal">
                  {peer.headline.split('•')[0]}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#DFDFD9] flex items-center justify-between bg-[#F9F8F4]">
          <div className="flex items-center gap-3">
            <img
              src={selectedPeer.avatar}
              alt={selectedPeer.name}
              className="w-9 h-9 rounded-lg object-cover border border-[#DFDFD9]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[#1A1A19]">
                  {selectedPeer.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 bg-[#F9BE08] text-[#1A1A19] font-bold rounded">
                  ★ {selectedPeer.score.overall}
                </span>
              </div>
              <p className="text-xs text-[#1A1A19]/60">{selectedPeer.headline}</p>
            </div>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'me'
                    ? 'bg-[#1A1A19] text-[#F9BE08] rounded-br-none'
                    : 'bg-[#F9F8F4] text-[#1A1A19] border border-[#DFDFD9] rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`text-[9px] font-mono block mt-1 ${
                    m.sender === 'me' ? 'text-white/50 text-right' : 'text-[#1A1A19]/40'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Send Input Form */}
        <form
          onSubmit={handleSend}
          className="p-3.5 border-t border-[#DFDFD9] bg-[#F9F8F4] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Message ${selectedPeer.name}...`}
            className="flex-1 px-4 py-2 text-xs sm:text-sm bg-white border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
