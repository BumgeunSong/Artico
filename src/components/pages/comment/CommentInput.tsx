import React, { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from 'lucide-react'
import { addCommentToPost } from '@/utils/commentUtils'

interface CommentInputProps {
  postId: string
  placeholder?: string
}

const CommentInput: React.FC<CommentInputProps> = ({ postId, placeholder }) => {
  const [newComment, setNewComment] = useState('')
  const { currentUser } = useAuth()

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !postId || !newComment.trim()) return

    try {
      await addCommentToPost(postId, newComment, currentUser.uid, currentUser.displayName, currentUser.photoURL)
      setNewComment('')
    } catch (error) {
      console.error('댓글 추가 오류:', error)
    }
  }

  return (
    <form onSubmit={handleAddComment} className="w-full flex items-center space-x-2 mt-4">
      <Input
        type="text"
        placeholder={placeholder}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}

export default CommentInput