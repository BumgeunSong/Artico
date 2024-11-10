import { Reply } from "@/types/Reply";
import { fetchUserNickname } from "@/utils/userUtils";
import { useEffect, useState } from "react";
import ReplyInput from "./ReplyInput";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, X } from "lucide-react";
import {
  deleteReplyToComment,
  updateReplyToComment,
} from "@/utils/commentUtils";

interface ReplyRowProps {
  reply: Reply;
  commentId: string;
  postId: string;
  isAuthor: boolean;
}

const ReplyRow: React.FC<ReplyRowProps> = ({
  reply,
  commentId,
  postId,
  isAuthor,
}) => {
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = async () => {
    setIsEditing((prev) => !prev);
  };

  const handleDelete = async () => {
    if (window.confirm("대댓글을 삭제하시겠습니까?")) {
      await deleteReplyToComment(postId, commentId, reply.id);
    }
  };

  const handleEditSubmit = async (content: string) => {
    await updateReplyToComment(postId, commentId, reply.id, content);
    setIsEditing(false);
  };

  const EditIcon = isEditing ? X : Edit;

  useEffect(() => {
    const loadNickname = async () => {
      fetchUserNickname(reply.userId).then(setUserNickname);
    };
    loadNickname();
  }, [reply.userId]);

  return (
    <div key={reply.id} className="flex items-start space-x-4">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <p className="font-semibold text-base">{userNickname || "??"}</p>
            <span className="text-sm text-muted-foreground">
              {reply.createdAt?.toDate().toLocaleString()}
            </span>
          </div>
          {isAuthor && (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditToggle}
                className="text-primary-500"
              >
                <EditIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="text-base mt-2">
          {isEditing ? (
            <ReplyInput
              onSubmit={handleEditSubmit}
              initialValue={reply.content}
            />
          ) : (
            <p>{reply.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyRow;
