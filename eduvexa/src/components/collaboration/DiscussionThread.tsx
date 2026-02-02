"use client";

import { useState } from 'react';
import { MessageSquare, Reply, Heart, Bookmark, MoreVertical, User, Paperclip } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import ProfessionalButton from '@/components/ui/ProfessionalButton';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  replies?: Comment[];
}

interface DiscussionThreadProps {
  title: string;
  description: string;
  author: string;
  createdAt: string;
  tags: string[];
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  onBookmarkComment: (commentId: string) => void;
}

export default function DiscussionThread({
  title,
  description,
  author,
  createdAt,
  tags,
  comments,
  onAddComment,
  onLikeComment,
  onBookmarkComment
}: DiscussionThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyContent.trim()) {
      onAddComment(replyContent, commentId);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'yesterday';
    return date.toLocaleDateString();
  };

  const CommentComponent = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8 border-l-2 border-neutral-200 pl-4' : ''}`}>
      <div className="space-y-3">
        {/* Comment Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-neutral-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">{comment.author}</span>
                <span className="text-xs text-neutral-500">{formatTimestamp(comment.timestamp)}</span>
              </div>
            </div>
          </div>
          <button className="text-neutral-400 hover:text-neutral-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Comment Content */}
        <div className="space-y-2">
          <p className="text-sm text-neutral-700 whitespace-pre-wrap">{comment.content}</p>
          
          {/* Attachments */}
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {comment.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg text-xs">
                  <Paperclip className="w-3 h-3 text-neutral-500" />
                  <span className="text-neutral-700">{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLikeComment(comment.id)}
            className={`flex items-center gap-1 text-xs ${
              comment.isLiked ? 'text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </button>
          
          <button
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700"
          >
            <Reply className="w-3 h-3" />
            Reply
          </button>
          
          <button
            onClick={() => onBookmarkComment(comment.id)}
            className={`flex items-center gap-1 text-xs ${
              comment.isBookmarked ? 'text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Bookmark className={`w-3 h-3 ${comment.isBookmarked ? 'fill-current' : ''}`} />
            {comment.isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="mt-3 space-y-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <ProfessionalButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
              >
                Cancel
              </ProfessionalButton>
              <ProfessionalButton
                variant="primary"
                size="sm"
                onClick={() => handleReply(comment.id)}
                disabled={!replyContent.trim()}
              >
                Reply
              </ProfessionalButton>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3 mt-3">
            {comment.replies.map((reply) => (
              <CommentComponent key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ProfessionalCard className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Thread Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-neutral-900 mb-2">{title}</h2>
              <p className="text-sm text-neutral-600 mb-3">{description}</p>
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span>Started by {author}</span>
                <span>•</span>
                <span>{formatTimestamp(createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-neutral-600" />
            <h3 className="text-sm font-semibold text-neutral-900">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>
          </div>

          {/* Add Comment */}
          <div className="space-y-3 p-4 bg-neutral-50 rounded-lg">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex justify-end">
              <ProfessionalButton
                variant="primary"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                icon={<MessageSquare className="w-4 h-4" />}
              >
                Post Comment
              </ProfessionalButton>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentComponent key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </ProfessionalCard>
  );
}
