// import { useEffect, useState } from "react";
// import "../css/Notification.css";
// import Avatar from "@mui/material/Avatar";
// import db from "../firebase";
// import { getAuth } from "firebase/auth";

// function Notification() {
//   const [notifications, setNotifications] = useState([]);
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   useEffect(() => {
//     if (!currentUser) return;

//     const fetchNotifications = async () => {
//       try {
//         const [
//           followsSnap,
//           groupFollowsSnap,
//           answersSnap,
//           commentsSnap,
//           upvoteSnap,
//         ] = await Promise.all([
//           db
//             .collection("follows")
//             .where("followeeId", "==", currentUser.uid)
//             .orderBy("timestamp", "desc")
//             .get(),

//           db
//             .collection("groupfollows")
//             .where("ownerId", "==", currentUser.uid)
//             .orderBy("timestamp", "desc")
//             .get(),

//           db
//             .collection("answers")
//             .where("questionOwnerId", "==", currentUser.uid)
//             .orderBy("timestamp", "desc")
//             .get(),

//           db
//             .collection("comments")
//             .where("targetUserId", "==", currentUser.uid)
//             .orderBy("timestamp", "desc")
//             .get(),

//           db
//             .collection("votes")
//             .where("userId", "==", currentUser.uid)
//             .where("type", "==", "upvote")
//             .orderBy("timestamp", "desc")
//             .get(),
//         ]);

//         const followNotifications = followsSnap.docs.map((doc) => ({
//           id: doc.id,
//           type: "follow",
//           timestamp: doc.data().timestamp,
//           triggeredBy: {
//             photo: doc.data().followerPhoto,
//             display: doc.data().followerDisplay,
//           },
//           message: `${doc.data().followerDisplay} started following you.`,
//         }));

//         const groupFollowNotifications = groupFollowsSnap.docs.map((doc) => ({
//           id: doc.id,
//           timestamp: doc.data().timestamp,
//           triggeredBy: {
//             photo: doc.data().user.photo,
//             display: doc.data().user.display,
//           },
//           message: `${doc.data().user.display} followed your space "${
//             doc.data().groupTitle
//           }".`,
//         }));

//         const answerNotifications = answersSnap.docs.map((doc) => ({
//           id: doc.id,
//           type: "answer",
//           timestamp: doc.data().timestamp,
//           triggeredBy: {
//             photo: doc.data().user?.photo,
//             display: doc.data().user?.display,
//           },
//           message: `${doc.data().user?.display} answered your question.`,
//         }));

//         const commentNotifications = commentsSnap.docs.map((doc) => ({
//           id: doc.id,
//           type: "comment",
//           timestamp: doc.data().timestamp,
//           triggeredBy: {
//             photo: doc.data().user?.photo,
//             display: doc.data().user?.display,
//           },
//           message: `${doc.data().user?.display} commented on your post.`,
//         }));

//         const upvoteNotifications = upvoteSnap.docs.map((doc) => ({
//           id: doc.id,
//           type: "upvote",
//           timestamp: doc.data().timestamp,
//           triggeredBy: doc.data().triggeredBy,
//           message: doc.data().message,
//         }));

//         const merged = [
//           ...followNotifications,
//           ...groupFollowNotifications,
//           ...answerNotifications,
//           ...commentNotifications,
//           ...upvoteNotifications,
//         ].sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());

//         setNotifications(merged);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     fetchNotifications();
//   }, [currentUser]);

//   return (
//     <div className="notification-page">
//       <h2 className="notification-title">Notifications</h2>
//       {notifications.length === 0 ? (
//         <p className="notification-empty">No new notifications yet.</p>
//       ) : (
//         <div className="notification-list">
//           {notifications.map((note) => (
//             <div key={note.id} className="notification-card">
//               <Avatar
//                 src={note.triggeredBy?.photo}
//                 className="notification-avatar"
//               />
//               <div className="notification-content">
//                 <p className="notification-message">{note.message}</p>
//                 <span className="notification-time">
//                   {new Date(note.timestamp?.toDate()).toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Notification;







import { useEffect, useState } from "react";
import "../css/Notification.css";
import Avatar from "@mui/material/Avatar";
import { getAuth } from "firebase/auth";
import db from "../firebase";
import { useNavigate } from "react-router-dom";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const [
          followsSnap,
          groupFollowsSnap,
          answersSnap,
          commentsSnap,
          upvoteSnap
        ] = await Promise.all([
          db
            .collection("follows")
            .where("followeeId", "==", currentUser.uid)
            .orderBy("timestamp", "desc")
            .get(),

          db
            .collection("groupfollows")
            .where("ownerId", "==", currentUser.uid)
            .orderBy("timestamp", "desc")
            .get(),

          db
            .collection("answers")
            .where("questionOwnerId", "==", currentUser.uid)
            .orderBy("timestamp", "desc")
            .get(),

          db
            .collection("comments")
            .where("targetUserId", "==", currentUser.uid)
            .orderBy("timestamp", "desc")
            .get(),

          db
            .collection("votes")
            .where("userId", "==", currentUser.uid)
            .where("type", "==", "upvote")
            .orderBy("timestamp", "desc")
            .get()
        ]);

        const followNotifications = followsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "follow",
          timestamp: doc.data().timestamp,
          triggeredBy: {
            photo: doc.data().followerPhoto,
            display: doc.data().followerDisplay
          },
          message: `${doc.data().followerDisplay} started following you.`,
          targetPath: `/user/${doc.data().followerId}`
        }));

        const groupFollowNotifications = groupFollowsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "groupfollow",
          timestamp: doc.data().timestamp,
          triggeredBy: {
            photo: doc.data().user.photo,
            display: doc.data().user.display
          },
          message: `${doc.data().user.display} followed your space "${doc.data().groupTitle}".`,
          targetPath: `/group/${doc.data().groupId}`
        }));

        const answerNotifications = answersSnap.docs.map((doc) => ({
          id: doc.id,
          type: "answer",
          timestamp: doc.data().timestamp,
          triggeredBy: {
            photo: doc.data().user?.photo,
            display: doc.data().user?.display
          },
          message: `${doc.data().user?.display} answered your question.`,
          targetPath: `/question/${doc.data().questionId}`
        }));

        const commentNotifications = commentsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "comment",
          timestamp: doc.data().timestamp,
          triggeredBy: {
            photo: doc.data().user?.photo,
            display: doc.data().user?.display
          },
          message: `${doc.data().user?.display} commented on your post.`,
          targetPath: `/post/${doc.data().postId}`
        }));

        const upvoteNotifications = upvoteSnap.docs.map((doc) => ({
          id: doc.id,
          type: "upvote",
          timestamp: doc.data().timestamp,
          triggeredBy: doc.data().triggeredBy,
          message: doc.data().message,
          targetPath: `/post/${doc.data().postId}`
        }));

        const merged = [
          ...followNotifications,
          ...groupFollowNotifications,
          ...answerNotifications,
          ...commentNotifications,
          ...upvoteNotifications
        ].sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());

        setNotifications(merged);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  return (
    <div className="notification-page">
      <h2 className="notification-title">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="notification-empty">No new notifications yet.</p>
      ) : (
        <div className="notification-list">
          {notifications.map((note) => (
            <div
              key={note.id}
              className="notification-card"
              onClick={() => note.targetPath && navigate(note.targetPath)}
              style={{ cursor: note.targetPath ? "pointer" : "default" }}
            >
              <Avatar
                src={note.triggeredBy?.photo}
                className="notification-avatar"
              />
              <div className="notification-content">
                <p className="notification-message">{note.message}</p>
                <span className="notification-time">
                  {new Date(note.timestamp?.toDate()).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
