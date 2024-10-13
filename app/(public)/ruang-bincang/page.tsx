import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import RuangBincangClient from "./client";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";

const fetchPosts = async () => {
  const postsPerPage = 5;
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(postsPerPage));
  const snapshot = await getDocs(q);

  const posts = snapshot.docs.map((doc) => ({
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
