import { createPost } from "../actions";
import PostForm from "../post-form"; // Import komponen shared

export default function NewPostPage() {
  return (
    <div className="pb-20 pt-6 px-6">
       {/* Kita panggil PostForm dengan action 'createPost'.
          Tidak perlu initialData karena ini buat artikel baru.
       */}
       <PostForm action={createPost} />
    </div>
  );
}