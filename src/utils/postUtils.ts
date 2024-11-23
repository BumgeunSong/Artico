import {
  collection,
  orderBy,
  doc,
  getDoc,
  where,
  query,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  getDocs,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { firestore } from '../firebase';
import { Post } from '../types/Posts';

export const fetchPost = async (boardId: string, postId: string): Promise<Post | null> => {
  const docSnap = await getDoc(doc(firestore, `boards/${boardId}/posts`, postId));

  if (!docSnap.exists()) {
    console.log('해당 문서가 없습니다!');
    return null;
  }

  return mapDocToPost(docSnap, boardId);
};

export function fetchPosts(
  boardId: string,
  selectedAuthorId: string | null,
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
) {
  let q = query(
    collection(firestore, `boards/${boardId}/posts`),
    orderBy('createdAt', 'desc'),
  );

  if (selectedAuthorId) {
    q = query(q, where('authorId', '==', selectedAuthorId));
  }

  return onSnapshot(q, async (snapshot) => {
    const postsData = await Promise.all(snapshot.docs.map((doc) => mapDocToPost(doc, boardId)));
    setPosts(postsData);
  });
}

async function mapDocToPost(docSnap: QueryDocumentSnapshot<DocumentData>, boardId: string): Promise<Post> {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    boardId: data.boardId,
    title: data.title,
    content: data.content,
    authorId: data.authorId,
    authorName: data.authorName,
    comments: await getCommentsCount(boardId, docSnap.id),
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate(),
  };
}

async function getCommentsCount(boardId: string, postId: string): Promise<number> {
  const commentsSnapshot = await getDocs(collection(firestore, `boards/${boardId}/posts/${postId}/comments`));
  const commentsCount = await Promise.all(
    commentsSnapshot.docs.map(async (comment) => {
      const repliesSnapshot = await getDocs(
        collection(firestore, `boards/${boardId}/posts/${postId}/comments/${comment.id}/replies`),
      );
      return Number(comment.exists()) + repliesSnapshot.docs.length;
    }),
  );
  return commentsCount.reduce((acc, curr) => acc + curr, 0);
}

export async function createPost(boardId: string, title: string, content: string, authorId: string, authorName: string) {
  const postRef = doc(collection(firestore, `boards/${boardId}/posts`));
  return setDoc(postRef, {
    title,
    boardId,
    content,
    authorId,
    authorName,
    createdAt: serverTimestamp(),
  });
}