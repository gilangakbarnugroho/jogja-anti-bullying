import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import DetailPostClient from "./client";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import { notFound } from "next/navigation";

// Define the Post type for TypeScript validation
interface Post {
  id: string;
  content: string;
  user: string;
  name: string;
  profilePicture?: string;
  isAnonymous: boolean;
  category?: string;
  fileType?: string;
  fileURL?: string;
  timestamp: { seconds?: number }; // Ensure timestamp has seconds field
}

// Fetch post data from Firestore
const fetchPost = async (postId: string): Promise<Post | null> => {
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  // Destructure Firestore data into a Post object
  const post = { id: docSnap.id, ...docSnap.data() } as Post;

  // Validate that necessary fields are present
  if (
    !post.content ||
    !post.user ||
    !post.name ||
    post.isAnonymous === undefined ||
    !post.timestamp?.seconds
  ) {
    return null; // Return null if essential fields are missing
  }

  return post;
};

const DetailPostPage = async ({ params }: { params: { id: string } }) => {
  const post = await fetchPost(params.id);

  if (!post) {
    return notFound(); // Redirect to 404 if the post is not found
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <Suspense fallback={<Loader />}>
        <DetailPostClient post={post} />
      </Suspense>
    </div>
  );
};

export default DetailPostPage;
