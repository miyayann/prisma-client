import Link from "next/link";
import { PostTypes } from "../types";
import Image from "next/image";
import apiClient from "../lib/apiClient";
import { useAuth } from "../context/auth";
import { useState } from "react";

interface Props {
  post: PostTypes
  onDelete: () => void;
  onUpdate: () => void;
}

const Post = (props: Props) => {
  const { post, onDelete, onUpdate } = props;
  const Liked = (post.likes?.map((like) => like.isLiked));
  const initialIsLiked = Liked?.some((liked: boolean) => liked === true);
  const {user} = useAuth()
  const [editing, setEditing] = useState(false)
  const [updateContent, setUpdateContent] = useState("")
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleDelete = async () => {
    try {
      const response = await apiClient.delete(`/posts/delete/${post.id}`, {
        method: "DELETE",
      });

      if (response) {
        onDelete(); 
      } else {
        console.error("投稿の削除に失敗しました");
      }
    } catch (err) {
      console.error("エラー:", err);
    }
  }
  

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("l")
    try {
      const response = await apiClient.put(`/posts/update/${post.id}`, {
        content: updateContent,
      });
      setEditing(false);

      if (response) {
        setEditing(false);
        onUpdate();
      } else {
        console.error("投稿の更新に失敗しました");
      }
    } catch (err) {
      console.error("エラー:", err);
    }
  }

  const handleLike = async () => {
    try {
      const response = await apiClient.post(`/posts/like/${post.id}`);
      if (response) {
        setIsLiked(true); // いいねが成功したら状態を更新
      } else {
        console.error("いいねに失敗しました");
      }
    } catch (err) {
      console.error("エラー:", err);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await apiClient.post(`/posts/unlike/${post.id}`);
      if (response) {
        setIsLiked(false); // いいね解除が成功したら状態を更新
      } else {
        console.error("いいね解除に失敗しました");
      }
    } catch (err) {
      console.error("エラー:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-4 mb-4 flex justify-between items-end">
    <div className="mb-4 w-full">
      <div className="flex items-center mb-2">
        <Link href={`/profile/${post.author.profile.userId}`}>
          <img
          src={post.author.profile?.profileImageUrl}
            className="w-10 h-10 rounded-full mr-2"
            alt="User Avatar"
          />
        </Link>
        <div>
          <h2 className="font-semibold text-md">{post.author?.username}</h2>
          <p className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      { editing ? (
        <div className="w-full">
          <textarea
            onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => setUpdateContent(e.target.value)}
            className="w-10/12 border rounded-sm p-2"
          >
          </textarea>
        </div>

      ) : (<p className="text-gray-700 max-w-4xl">{post.content}</p>) }
    </div>
    <div className="flex flex-col">
    {user?.id === post.author.id && (
      <button onClick={editing ? handleSubmit : () => setEditing(true)} className="bg-red-500 w-14 text-white mt-6 px-3 py-1 rounded hover:bg-purple-700 duration-200">{editing ? "更新" : "編集"} </button>
    )}

    {user?.id === post.author.id && (
      <button onClick={handleDelete} className="bg-red-500 w-14 text-white mt-6 px-3 py-1 rounded hover:bg-purple-700 duration-200">削除</button>
    )}
    </div>
    <div className="flex flex-col">
        {user &&  (
          <>
            {isLiked ? (
              <button
                onClick={handleUnlike}
                className=" w-14 text-white mt-6 px-3 py-1 rounded hover:bg-purple-700 duration-200"
              >
                💓
              </button>
            ) : (
              <button
                onClick={handleLike}
                className=" w-14 text-white mt-6 px-3 py-1 rounded hover:bg-purple-700 duration-200"
              >
                💛
              </button>
            )}
          </>
        )}
      </div>
  </div>
  );
}

export default Post;