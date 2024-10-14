const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Cloud Function untuk Upvote/Downvote
exports.votePost = functions.https.onCall(async (
    data: { 
        postId: any; 
        voteType: any; 
    }, 
    context: { 
        auth: { 
            uid: any; 
        }; 
    }) => {
  const { postId, voteType } = data;
  const userId = context.auth.uid;

  if (!userId) {
    throw new functions.https.HttpsError('failed-precondition', 'User must be authenticated.');
  }

  const postRef = db.collection('posts').doc(postId);
  const postDoc = await postRef.get();

  if (!postDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Post not found.');
  }

  const postData = postDoc.data();
  const upvotes = postData.upvotes || [];
  const downvotes = postData.downvotes || [];

  // Handle upvote
  if (voteType === 'upvote') {
    if (upvotes.includes(userId)) {
      // Jika user sudah melakukan upvote, hapus upvote
      await postRef.update({
        upvotes: admin.firestore.FieldValue.arrayRemove(userId),
      });
    } else {
      // Tambahkan upvote dan hapus downvote jika ada
      await postRef.update({
        upvotes: admin.firestore.FieldValue.arrayUnion(userId),
        downvotes: admin.firestore.FieldValue.arrayRemove(userId),
      });
    }
  }

  // Handle downvote
  if (voteType === 'downvote') {
    if (downvotes.includes(userId)) {
      // Jika user sudah melakukan downvote, hapus downvote
      await postRef.update({
        downvotes: admin.firestore.FieldValue.arrayRemove(userId),
      });
    } else {
      // Tambahkan downvote dan hapus upvote jika ada
      await postRef.update({
        downvotes: admin.firestore.FieldValue.arrayUnion(userId),
        upvotes: admin.firestore.FieldValue.arrayRemove(userId),
      });
    }
  }

  return { success: true };
});
