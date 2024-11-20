// src/components/Pages/BoardListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext';
import { Board } from '../../../types/Board';
import { fetchBoardsWithUserPermissions } from '../../../utils/boardUtils';

const BoardListPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      if (!currentUser) return;

      try {
        const boardsData = await fetchBoardsWithUserPermissions(currentUser.uid);
        setBoards(boardsData);
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [currentUser]);

  const handleBoardClick = (boardId: string) => {
    localStorage.removeItem('boardId');
    localStorage.setItem('boardId', boardId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mx-auto max-w-3xl px-4 py-8'>
      <h1 className='mb-4 text-2xl font-bold'>어디로 들어갈까요?</h1>
      {boards.length === 0 ? (
        <div className='text-center text-gray-600'>
          <p>아직 초대받은 게시판이 없어요. 관리자에게 문의해주세요. 😔</p>
        </div>
      ) : (
        <ul className='space-y-4'>
          {boards.map((board) => (
            <Link
              to={`/board/${board.id}`}
              onClick={() => handleBoardClick(board.id)}
              key={board.id}
            >
              <li className='rounded bg-white p-4 shadow transition hover:bg-gray-100'>
                <h2 className='text-xl font-semibold'>{board.title}</h2>
                <p className='text-gray-600'>{board.description}</p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BoardListPage;
