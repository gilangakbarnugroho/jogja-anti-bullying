import { collection, query, orderBy, limit, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import RuangBincangClient from "./client";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";

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

const fetchPosts = async (): Promise<Post[]> => {
  const postsPerPage = 5;
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(postsPerPage));
  const snapshot = await getDocs(q);

  const posts: Post[] = snapshot.docs.map((doc: DocumentData) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return posts;
};

const RuangBincangPage = async () => {
  const posts = await fetchPosts();

  return (
    <div className="container max-w-4xl mx-auto p-4 mt-24">
      <h1 className="text-3xl font-bold mb-6 text-center text-bluetiful">Ruang Berbincang</h1>
      <Suspense fallback={<Loader />}>
        <RuangBincangClient /> 
      </Suspense>
    </div>
  );
};

export default RuangBincangPage;
