import { useState } from "react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Votes from "../votes/Votes";
import { MdDeleteForever } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import UserCard from "../users/UserCard";
import CommentAnnotation from "../comments/CommentAnnotation";

function CardPost({ post, onPostDeleted }) {
  const [deleteError, setDeleteError] = useState(null);

  const [updateError, setUpdateError] = useState(null);

  const { user, isLoggedIn, isAdmin, isModerator } = useAuth();

  const navigate = useNavigate();

  console.log(post.created_at);

  // Check if the user is logged in and if they are the author of the post
  const isAuthor = user && user.id === post.created_by;

  // Fetch the author name when the component mounts or when post.created_by changes
  // TODO: could use helper function "getUserNameById" to fetch the author name in future

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post.id}`);
      onPostDeleted();
      console.log("Post deleted successfully");
    } catch (err) {
      console.error(err);
      setDeleteError("Failed to delete post." + " " + err.message);
      setTimeout(() => {
        setDeleteError(null);
      }, 3000); // Clear the error after 3 seconds
      window.scrollTo(0, 0); // Scroll to the top of the page
    }
  };

  const handleUpdate = async () => {
    if (!isLoggedIn) {
      setUpdateError("You must be logged in to update a post.");
      setTimeout(() => {
        setUpdateError(null);
      }, 3000);
      return;
    }
    // if (user.id !== post.created_by) {
    //   setUpdateError("You are not authorized to update this post.");
    //   setTimeout(() => {
    //     setUpdateError(null);
    //   }, 3000);
    //   return;
    // }
    window.scrollTo(0, 0); // Scroll to the top of the page
    navigate(`/posts/${post.id}/update`);
  };

  return (
    <div className="shadow-md rounded bg-white flex flex-col p-4 relative">
      <div className="flex flex-col justify-between p-4">
        <div className="flex justify-between">
          <Link
            to={`/posts/${post.id}`}
            className="text-xl font-semibold hover:text-red-400 hover:underline"
          >
            {post.title}
          </Link>
          <p className="font-semibold mb-4 text-sm bg-indigo-500 w-1/8 flex justify-center rounded-full text-white p-1">
            {post.topic}
          </p>
        </div>

        <UserCard userId={post.created_by} createdAt={post.created_at} />

        <p className="text-gray-700 overflow-ellipsis break-words line-clamp-2 py-5">
          {post.content}
        </p>
      </div>

      <div className="flex justify-between items-center pt-3 gap-5">
        <Votes postId={post.id} />
        {/* Show the number of comments */}
        <CommentAnnotation postId={post.id} />
        {/* Show the delete and update buttons only if the user is logged in and is the author of the post */}
        {(isAuthor || isAdmin || isModerator) && (
          <div className="flex justify-end w-full gap-2">
            <button
              onClick={handleUpdate}
              className="bg-indigo-500 text-white p-2 hover:bg-indigo-600 cursor-pointer rounded"
            >
              <AiFillEdit />
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-400 text-white p-2  hover:bg-red-500 cursor-pointer rounded"
            >
              <MdDeleteForever />
            </button>
          </div>
        )}
      </div>
      {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
      {updateError && <p className="text-red-500 mt-2">{updateError}</p>}
    </div>
  );
}

export default CardPost;
