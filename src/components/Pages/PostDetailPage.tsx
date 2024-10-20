import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, NavigateFunction } from 'react-router-dom';
import { firestore } from '../../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { fetchPost } from '../../utils/postUtils';
import { Post } from '../../types/Posts';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, Edit, Trash2 } from 'lucide-react'

const deletePost = async (id: string): Promise<void> => {
  await deleteDoc(doc(firestore, 'posts', id));
};

const handleDelete = async (id: string, navigate: NavigateFunction): Promise<void> => {
  if (!id) return;

  const confirmDelete = window.confirm('정말로 이 게시물을 삭제하시겠습니까?');
  if (!confirmDelete) return;

  try {
    await deletePost(id);
    navigate('/feed');
  } catch (error) {
    console.error('게시물 삭제 오류:', error);
  }
};

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        console.error('게시물 ID가 제공되지 않았습니다');
        setIsLoading(false);
        return;
      }

      try {
        const fetchedPost = await fetchPost(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error('게시물 가져오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">게시물을 찾을 수 없습니다.</h1>
        <Button onClick={() => navigate('/feed')}>
          <ChevronLeft className="mr-2 h-4 w-4" /> 피드로 돌아가기
        </Button>
      </div>
    );
  }

  const isAuthor = currentUser?.uid === post.authorId;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate('/feed')} className="mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" /> 피드로 돌아가기
      </Button>
      <Card>
        <CardHeader className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              작성자: {post.authorName} | 작성일: {post.createdAt.toLocaleString()}
            </p>
            {isAuthor && (
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/edit/${id}`)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(id!, navigate)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            className="prose prose-sm sm:prose lg:prose-lg mx-auto"
          />
        </CardContent>
      </Card>
    </div>
  );
}