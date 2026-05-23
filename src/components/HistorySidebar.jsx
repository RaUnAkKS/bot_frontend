import { useState, useEffect } from 'react';
import { getHistory } from '../services/api';

/**
 * Collapsible sidebar showing conversation history.
 * Loads past sessions from the backend API.
 */
const HistorySidebar = ({ isOpen, onClose, onLoadSession, currentSessionId, refreshTrigger, onNewChat }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch history when sidebar opens (mobile), on initial load (desktop), or when refreshTrigger changes
  useEffect(() => {
    fetchHistory();
  }, [isOpen, refreshTrigger]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      // Group by session_id
      const grouped = data.reduce((acc, conv) => {
        if (!acc[conv.session_id]) {
          acc[conv.session_id] = {
            session_id: conv.session_id,
            messages: [],
            lastMessage: conv.user_message,
            lastTime: conv.created_at,
          };
        }
        acc[conv.session_id].messages.push(conv);
        return acc;
      }, {});
      setSessions(Object.values(grouped).slice(0, 20));
    } catch (err) {
      console.error('[HistorySidebar] Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  // ... formatDate remains the same ...
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        id="history-sidebar"
        className={`fixed top-0 left-0 h-full w-[280px] sm:w-80 z-50 glass-strong flex flex-col transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 lg:z-0 lg:rounded-[2rem] lg:h-full shadow-2xl lg:shadow-none lg:mr-6`}
      >
        {/* Header with New Chat Button */}
        <div className="flex flex-col p-4 lg:p-5 border-b border-surface-200/50 dark:border-surface-700/30 gap-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-surface-800 dark:text-surface-100">History</h2>
            </div>
            
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl hover:bg-surface-200/50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <svg className="w-5 h-5 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* New Chat Button moved here */}
          <button
            onClick={() => {
              if (onNewChat) onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold glass shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-surface-800/80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-surface-700 dark:text-surface-200"
          >
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-2 pb-20 lg:pb-4 min-h-0">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && sessions.length === 0 && (
            <div className="text-center py-12 px-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-surface-700 dark:text-surface-300">No conversations yet</p>
              <p className="text-xs text-surface-500 mt-1">Your past chats will appear here</p>
            </div>
          )}

          {sessions.map((session, index) => (
            <button
              key={session.session_id}
              onClick={() => onLoadSession(session.session_id, session.messages)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 group animate-slide-in-left ${
                currentSessionId === session.session_id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800/50 shadow-sm'
                  : 'hover:bg-surface-100/80 dark:hover:bg-surface-800/50 border-transparent hover:shadow-sm'
              } border`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className={`text-sm font-semibold truncate ${
                  currentSessionId === session.session_id 
                    ? 'text-primary-700 dark:text-primary-300' 
                    : 'text-surface-700 dark:text-surface-300 group-hover:text-surface-900 dark:group-hover:text-surface-100'
                }`}>
                  {session.lastMessage}
                </p>
                <span className="text-[10px] font-medium text-surface-400 flex-shrink-0 mt-0.5">
                  {formatDate(session.lastTime)}
                </span>
              </div>
              <p className="text-xs font-medium text-surface-500 mt-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
              </p>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default HistorySidebar;
