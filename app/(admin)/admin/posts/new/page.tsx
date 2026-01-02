import PostForm from "../post-form"; // Import form dari folder induk
import { createPost } from "../actions"; // Import logic create dari folder induk

export default function NewPostPage() {
  return (
    <div className="pb-20">
      {/* Kita panggil Form dengan action createPost & initialData kosong */}
      <PostForm action={createPost} initialData={null} />
    </div>
  );
}