import React, { useState } from "react";

const PostAComment = () => {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-8">Leave a comment</h3>
      <form>
        <textarea
          name="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          cols="30"
          rows="10"
          placeholder="Share your opinions about this
          post...."
          className="w-full bg-bgPrimary focus:outline-none p-5"
        />
        <button
          type="submit"
          className="w-full bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostAComment;
