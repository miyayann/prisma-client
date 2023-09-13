import { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import Post from "./Post";
import { PostTypes } from "../types";
import { useAuth } from "../context/auth";

const Timeline = () => {
  const [postText, setPostText] = useState<string>("")
  const [latestPosts, setLatestPosts] = useState<PostTypes[]>([])
  const {user} = useAuth()
  const [loading, setLoading] = useState(true);

  const handleDelete = () => {
    fetchLatestPosts();
    console.log("投稿を削除しました")
  }

  const handleUpdate = () => {
    fetchLatestPosts();
    console.log("投稿を更新しました")
  }


  const fetchLatestPosts = async () => {
    try {
      const response = await apiClient.get("/posts/get_latest_post");
      // 投稿データにいいね情報を追加
    const postsWithLikes = response.data.map((post: any) => {
      const isLikedByCurrentUser  = post.likes.some(
        (like: any) => like.userId === user?.id
      );
      return { ...post, isLikedByCurrentUser};
    });
      setLatestPosts(postsWithLikes);
      setLoading(false); 
    } catch (e) {
      console.log(e);
    }
  }


  useEffect(()  => {
    fetchLatestPosts()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newPost = await apiClient.post("/posts/post", {
        content: postText
      })
      setLatestPosts((prevPosts) => [newPost.data, ...prevPosts])
      setPostText("");
    } catch(e) {
      alert("ログインしてください");
    }
  }

  if (loading) {
    // データ取得中の表示
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
    <main className="container mx-auto py-4">
      <div className="bg-white shadow-md rounded p-4 mb-4">
        <form onSubmit={handleSubmit}>
          <textarea
          value={postText} 
            className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="What's on your mind?"
            onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => setPostText(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="mt-2 bg-gray-700 hover:bg-green-700 duration-200 text-white font-semibold py-2 px-4 rounded"
          >
            投稿
          </button>
        </form>
      </div>
      {latestPosts.map((post: PostTypes) => (
        <Post key={post.id} post={post} onDelete={handleDelete} onUpdate={handleUpdate}/>
      ))}
    </main>
  </div>
  );
}

export default Timeline;