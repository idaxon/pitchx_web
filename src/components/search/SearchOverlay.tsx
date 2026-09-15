import React, { useEffect, useRef } from 'react';
import { Search, X, FolderGit2, Users, Hash, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SearchOverlay: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    projects,
    users,
    topics,
    navigateTo,
    openProjectModal,
  } = useApp();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener for '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && (e.target as HTMLElement)?.tagName !== 'INPUT' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchQuery.trim().toLowerCase();

  const matchedProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.skills.some((s) => s.toLowerCase().includes(query)) ||
      p.tags.some((t) => t.toLowerCase().includes(query))
  );

  const matchedUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query) ||
      u.handle.toLowerCase().includes(query) ||
      u.headline.toLowerCase().includes(query) ||
      u.skills.some((s) => s.name.toLowerCase().includes(query))
  );

  const matchedTopics = topics.filter(
    (t) =>
      t.tag.toLowerCase().includes(query) ||
      t.name.toLowerCase().includes(query) ||
      t.relatedSkills.some((s) => s.toLowerCase().includes(query))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-[#1A1A19]/60 backdrop-blur-sm animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white border border-[#DFDFD9] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#DFDFD9] flex items-center gap-3 bg-[#F9F8F4]">
          <Search className="w-5 h-5 text-[#1A1A19]" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, builders, skills, topics (e.g. 'React', 'AI', 'C++')..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#1A1A19] placeholder:text-[#1A1A19]/40 focus:outline-none font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-mono text-[#1A1A19]/50 hover:text-[#1A1A19]"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-[#1A1A19]/60 hover:text-[#1A1A19] hover:bg-white border border-transparent hover:border-[#DFDFD9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-5">
          {/* Quick preset chips when search is empty */}
          {!query && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A19]/50 block mb-2">
                Popular Discoveries
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'Artificial Intelligence', 'Figma', 'WebAssembly', 'SaaS', 'Computer Vision'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="text-xs px-3 py-1.5 bg-[#F9F8F4] hover:bg-[#1A1A19] hover:text-[#F9BE08] border border-[#DFDFD9] rounded-lg font-medium transition-all"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* 1. Projects Section */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19]/60 mb-2">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Projects ({matchedProjects.length})</span>
              </div>
              <div className="divide-y divide-[#DFDFD9]/60">
                {matchedProjects.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      openProjectModal(p);
                    }}
                    className="py-2.5 px-2 -mx-2 hover:bg-[#F9F8F4] rounded-lg cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1A1A19] group-hover:underline">
                          {p.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F9BE08]/20 text-[#1A1A19] border border-[#F9BE08]/40">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#1A1A19]/60 line-clamp-1 mt-0.5">
                        {p.description}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#1A1A19]/40 group-hover:text-[#1A1A19]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Builders / People Section */}
          {matchedUsers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19]/60 mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Builders & Creators ({matchedUsers.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedUsers.slice(0, 4).map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateTo('profile', { user: u });
                    }}
                    className="p-2.5 bg-[#F9F8F4] hover:bg-[#F0EFEA] border border-[#DFDFD9] rounded-xl cursor-pointer flex items-center gap-2.5 transition-colors"
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-9 h-9 rounded-lg object-cover border border-[#DFDFD9]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#1A1A19] truncate">
                          {u.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#1A1A19]/50">
                          ★ {u.score.overall}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#1A1A19]/60 line-clamp-1">
                        {u.headline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Topics Section */}
          {matchedTopics.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A19]/60 mb-2">
                <Hash className="w-3.5 h-3.5" />
                <span>Topics & Proof Categories ({matchedTopics.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedTopics.slice(0, 6).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateTo('topic', { topic: t });
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#1A1A19] hover:text-[#F9BE08] border border-[#DFDFD9] rounded-lg text-xs font-bold transition-all group"
                  >
                    <span>{t.tag}</span>
                    <span className="text-[10px] font-mono opacity-60">
                      {t.countProjects}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query &&
            matchedProjects.length === 0 &&
            matchedUsers.length === 0 &&
            matchedTopics.length === 0 && (
              <div className="text-center py-10 text-[#1A1A19]/50">
                <p className="text-xs font-semibold">No results found for "{query}".</p>
                <p className="text-[11px] mt-1">
                  Try searching by skill (e.g. "Python", "Figma") or topic (e.g. "AI").
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
