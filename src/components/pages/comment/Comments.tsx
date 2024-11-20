import React from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { addCommentToPost } from '@/utils/commentUtils';
import CommentInput from './CommentInput';
import CommentList from './CommentList';

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { currentUser } = useAuth();

  const handleSubmit = async (content: string) => {
    if (!postId) {
      return;
    }

    await addCommentToPost(
      postId,
      content,
      currentUser.uid,
      currentUser.displayName,
      currentUser.photoURL,
    );
  };

  return (
    <section className='mt-12 space-y-8'>
      <h2 className='text-2xl font-semibold'>댓글</h2>
      <CommentList postId={postId} />
      <div className='my-6 border-t border-gray-200' />
      <CommentInput onSubmit={handleSubmit} />
    </section>
  );
};

export default Comments;
