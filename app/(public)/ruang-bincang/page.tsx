import { collection, query, orderBy, limit, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import RuangBincangClient from "./client";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";

// Define the Post interface for typing
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
  timestamp: { seconds?: number };
}

// Fetch posts with correct typing
const fetchPosts = async (): Promise<Post[]> => {
  const postsPerPage = 5;
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(postsPerPage));
  const snapshot = await getDocs(q);

  // Type posts explicitly
  const posts: Post[] = snapshot.docs.map((doc: DocumentData) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return posts;
};

const RuangBincangPage = async () => {
  const posts = await fetchPosts();

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-bluetiful">Ruang Bincang</h1>
      <Suspense fallback={<Loader />}>
        <RuangBincangClient initialPosts={posts} /> 
      </Suspense>
    </div>
  );
};

export default RuangBincangPage;
