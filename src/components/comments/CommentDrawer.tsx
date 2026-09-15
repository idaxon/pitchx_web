import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  ArrowBigUp,
  CornerDownRight,
  Send,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommentDrawer: React.FC = () => {
  const {
    activeDiscussionProject,
    closeDiscussionDrawer,
    comments,
    handleAddComment,
    currentUser,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyInputVal, setReplyInputVal] = useState('');

  if (!activeDiscussionProject) return null;

  const projectComments = comments[activeDiscussionProject.id] || [];

  const handleSubmitTopComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleAddComment(activeDiscussionProject.id, inputVal);
    setInputVal('');
  };

  const handleSubmitReply = (parentCommentId: string) => {
    if (!replyInputVal.trim()) return;
    handleAddComment(activeDiscussionProject.id, replyInputVal, parentCommentId);
    setReplyInputVal('');
    setReplyToId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1A1A19]/50 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click */}
      <div className="flex-1" onClick={closeDiscussionDrawer} />

      {/* Drawer Panel */}
      <div className="w-full max-w-lg bg-white border-l border-[#DFDFD9] h-full flex flex-col shadow-2xl">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#DFDFD9] flex items-center justify-between bg-[#F9F8F4]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#1A1A19]" />
            <div>
              <h3 className="font-extrabold text-sm text-[#1A1A19]">
                Peer Review & Discussions
              </h3>
              <p className="text-[11px] font-mono text-[#1A1A19]/60 truncate max-w-[280px]">
                {activeDiscussionProject.title}
              </p>
            </div>
          </div>
          <button
            onClick={closeDiscussionDrawer}
            className="p-1.5 rounded-lg text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-white border border-transparent hover:border-[#DFDFD9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight: Top Discussion Tip */}
        <div className="p-3 bg-[#F9F8F4] border-b border-[#DFDFD9] text-xs text-[#1A1A19]/75 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F9BE08] flex-shrink-0" />
          <span>
            Engage with architecture inquiries, benchmark audits, and reproducible testing.
          </span>
        </div>

        {/* Comment Thread List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {projectComments.length === 0 ? (
            <div className="text-center py-12 text-[#1A1A19]/50">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-semibold">No discussions yet.</p>
              <p className="text-[11px] mt-0.5">
                Be the first engineer or designer to review this proof!
              </p>
            </div>
          ) : (
            projectComments.map((comment) => (
              <div
                key={comment.id}
                className="p-3.5 bg-[#F9F8F4] border border-[#DFDFD9] rounded-xl space-y-2.5"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-7 h-7 rounded-md object-cover border border-[#DFDFD9]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#1A1A19]">
                        {comment.author.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#1A1A19]/50 ml-1.5">
                        @{comment.author.handle}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#1A1A19]/40">
                    {comment.createdAt}
                  </span>
                </div>

                {/* Comment body */}
                <p className="text-xs sm:text-sm text-[#1A1A19]/80 leading-relaxed">
                  {comment.content}
                </p>

                {/* Actions: Upvote & Reply */}
                <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-[#1A1A19]/70">
                  <button className="flex items-center gap-1 hover:text-[#1A1A19]">
                    <ArrowBigUp className="w-3.5 h-3.5" />
                    <span>{comment.upvotes}</span>
                  </button>
                  <button
                    onClick={() =>
                      setReplyToId(replyToId === comment.id ? null : comment.id)
                    }
                    className="flex items-center gap-1 hover:text-[#1A1A19]"
                  >
                    <CornerDownRight className="w-3 h-3" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-3 pl-3 border-l-2 border-[#DFDFD9] space-y-2 pt-1">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-2.5 bg-white border border-[#DFDFD9] rounded-lg space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={reply.author.avatar}
                              alt={reply.author.name}
                              className="w-5 h-5 rounded-md object-cover"
                            />
                            <span className="text-xs font-bold text-[#1A1A19]">
                              {reply.author.name}
                            </span>
                            <span className="text-[9px] font-mono px-1 bg-[#F9BE08] text-[#1A1A19] font-bold rounded">
                              OP
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#1A1A19]/40">
                            {reply.createdAt}
                          </span>
                        </div>
                        <p className="text-xs text-[#1A1A19]/80 leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Reply Input if replyToId is active */}
                {replyToId === comment.id && (
                  <div className="mt-2 pt-2 border-t border-[#DFDFD9]/60 flex gap-1.5">
                    <input
                      type="text"
                      value={replyInputVal}
                      onChange={(e) => setReplyInputVal(e.target.value)}
                      placeholder={`Reply to @${comment.author.handle}...`}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      className="px-3 py-1.5 bg-[#1A1A19] text-[#F9BE08] text-xs font-bold rounded-lg"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Bottom Input Area */}
        <form
          onSubmit={handleSubmitTopComment}
          className="p-4 border-t border-[#DFDFD9] bg-[#F9F8F4] flex items-center gap-2"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-md object-cover border border-[#DFDFD9] flex-shrink-0"
          />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Write a technical inquiry or review..."
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#DFDFD9] rounded-lg focus:outline-none focus:border-[#1A1A19]"
          />
          <button
            type="submit"
            className="p-2 bg-[#1A1A19] hover:bg-[#2A2A28] text-[#F9BE08] rounded-lg transition-all"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
