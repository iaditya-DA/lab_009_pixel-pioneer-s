"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, Share2, X, Loader2 } from 'lucide-react';

// --- Type Definitions ---
type UserRole = 'viewer' | 'admin';

interface Stream {
  _id: string; // Changed from number to string for MongoDB compatibility
  title: string;
  admin: string;
  adminId: string;
  viewers: number;
  thumbnail: string; // Emoji or URL
  isLive: boolean;
  startTime: string;
  hlsUrl: string; // The playback URL from your streaming provider (Livepeer/Mux/AWS)
}

interface Comment {
  _id: string;
  user: string;
  text: string;
  timestamp: string;
}

export default function MonasteryLive() {
  const [userRole, setUserRole] = useState<UserRole>('viewer');
  // In a real app, get this from your Auth session (e.g., NextAuth)
  const [currentUser, setCurrentUser] = useState<string>('User_' + Math.floor(Math.random() * 1000));
  
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [watching, setWatching] = useState<string | null>(null);
  const [showGoLive, setShowGoLive] = useState<boolean>(false);
  const [streamTitle, setStreamTitle] = useState<string>('');
  
  // Comments for the currently watching stream
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);

  // --- 1. Fetch Streams (Polling) ---
  const fetchStreams = async () => {
    try {
      const res = await fetch('/api/live/get-streams');
      if (res.ok) {
        const data = await res.json();
        setStreams(data.streams || []);
      }
    } catch (error) {
      console.error("Failed to fetch streams", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();
    // Poll every 10 seconds to check for new streams/viewer counts
    const interval = setInterval(fetchStreams, 10000); 
    return () => clearInterval(interval);
  }, []);

  // --- 2. Fetch Comments (Polling when watching) ---
  const fetchComments = async (streamId: string) => {
    try {
      const res = await fetch(`/api/live/comments?streamId=${streamId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  useEffect(() => {
    if (watching) {
      fetchComments(watching);
      const interval = setInterval(() => fetchComments(watching), 3000); // Poll comments every 3s
      return () => clearInterval(interval);
    }
  }, [watching]);

  // --- 3. Start Streaming (Go Live) ---
  const handleStartStream = async () => {
    if (!streamTitle.trim()) return;

    try {
      // Call backend to generate stream key/record in DB
      const res = await fetch('/api/live/start-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: streamTitle,
          admin: userRole === 'admin' ? 'Monastery Admin' : currentUser,
          adminId: currentUser
        })
      });

      const data = await res.json();

      if (data.success) {
        // Optimistically add to list or wait for poll
        setWatching(data.stream._id);
        setShowGoLive(false);
        setStreamTitle('');
        fetchStreams(); // Refresh list immediately
      } else {
        alert("Failed to start stream: " + data.message);
      }
    } catch (error) {
      console.error("Error starting stream", error);
      alert("Could not connect to server");
    }
  };

  // --- 4. Stop Streaming ---
  const handleStopStream = async () => {
    if (!watching) return;
    
    try {
      await fetch('/api/live/stop-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamId: watching })
      });
      
      setWatching(null);
      fetchStreams(); // Refresh list
    } catch (error) {
      console.error("Error stopping stream", error);
    }
  };

  // --- 5. Add Comment ---
  const handleAddComment = async () => {
    if (!newComment.trim() || !watching) return;
    setIsSendingComment(true);

    try {
      const res = await fetch('/api/live/post-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamId: watching,
          user: currentUser,
          text: newComment
        })
      });

      if (res.ok) {
        setNewComment('');
        fetchComments(watching); // Refresh comments immediately
      }
    } catch (error) {
      console.error("Error posting comment", error);
    } finally {
      setIsSendingComment(false);
    }
  };

  const currentStream = streams.find(s => s._id === watching);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
        <div className="max-w-[2000px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-light tracking-tight text-gray-900">
              Monastery <span className="text-red-500">Live</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userRole === 'admin' && !watching && (
              <button
                onClick={() => setShowGoLive(true)}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
              >
                Go Live
              </button>
            )}

            <button
              onClick={() => setUserRole(prev => (prev === 'admin' ? 'viewer' : 'admin'))}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              {userRole === 'admin' ? '👤 Admin' : '👤 Switch Role'}
            </button>
          </div>
        </div>
      </header>

      {/* Go Live Modal */}
      {showGoLive && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-gray-900">Go Live</h2>
              <button onClick={() => setShowGoLive(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Stream Title</label>
                <input
                  type="text"
                  placeholder="e.g., Morning Prayer Ceremony"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-xs font-medium text-gray-700">Note:</p>
                <p className="text-xs text-gray-500">Starting the stream will generate your RTMP key.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowGoLive(false)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              <button
                onClick={handleStartStream}
                disabled={!streamTitle.trim()}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg transition-colors text-sm"
              >
                Start Stream
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[2000px] mx-auto">
        {loading && !watching ? (
             <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-red-500" /></div>
        ) : currentStream ? (
          // Watching View
          <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Main Player */}
            <div className="flex-1 min-w-0">
              <div className="bg-black rounded-xl aspect-video flex items-center justify-center mb-6 relative overflow-hidden group">
                {/* TODO: Replace this div with a real player like 'react-player' 
                   <ReactPlayer url={currentStream.hlsUrl} playing controls width="100%" height="100%" />
                */}
                <div className="text-gray-500 text-sm flex flex-col items-center">
                    <span className="text-4xl mb-2">{currentStream.thumbnail}</span>
                    <span>Video Player Placeholder</span>
                    <span className="text-xs mt-2 text-gray-700">{currentStream.hlsUrl}</span>
                </div>
                
                <div className="absolute top-4 right-4 inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
              </div>

              {/* Stream Info */}
              <div>
                <h1 className="text-3xl font-light text-gray-900 mb-4">{currentStream.title}</h1>
                <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                      {currentStream.thumbnail}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{currentStream.admin}</p>
                      <p className="text-sm text-gray-500">{currentStream.viewers.toLocaleString()} watching</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => setLiked(!liked)} className={`p-3 rounded-full transition-colors ${liked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      <Heart className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    {currentStream.adminId === currentUser && (
                      <button onClick={handleStopStream} className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full text-sm font-medium transition-colors">
                        Stop Stream
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Sidebar */}
            <div className="w-full lg:w-96 flex flex-col h-[600px] border border-gray-100 rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-light text-gray-900">Live Chat</h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {comments.length === 0 && <p className="text-gray-400 text-center text-sm mt-4">No comments yet. Say hello!</p>}
                {comments.map(comment => (
                  <div key={comment._id} className="text-sm">
                    <div className="flex items-baseline gap-2">
                        <p className="font-bold text-gray-900 text-xs">{comment.user}</p>
                        <span className="text-[10px] text-gray-400">{new Date(comment.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-gray-700 mt-0.5 leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                <div className="flex gap-2">
                    <input
                    type="text"
                    placeholder="Say something..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button onClick={handleAddComment} disabled={isSendingComment} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors disabled:opacity-50">
                    <Send className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Home Feed
          <div className="p-6">
            <h2 className="text-2xl font-light text-gray-900 mb-6">Live Now</h2>
            
            {streams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {streams.map(stream => (
                    <button key={stream._id} onClick={() => setWatching(stream._id)} className="group text-left hover:opacity-80 transition-opacity">
                    <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center text-4xl mb-3 relative overflow-hidden">
                        {stream.thumbnail}
                        <div className="absolute top-2 right-2 inline-flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        LIVE
                        </div>
                    </div>
                    <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-gray-700">{stream.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{stream.admin}</p>
                    <p className="text-xs text-gray-500 mt-1">{stream.viewers.toLocaleString()} watching</p>
                    </button>
                ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-5xl mb-4 opacity-20">📺</div>
                    <h2 className="text-2xl font-light text-gray-900 mb-2">No streams live right now</h2>
                    <p className="text-gray-600">Check back soon or start a new stream</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}