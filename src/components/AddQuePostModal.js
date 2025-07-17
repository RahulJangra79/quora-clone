// import React, { useState } from "react";
// import Modal from "react-modal";
// import Avatar from "@mui/material/Avatar";
// // import { PeopleAltOutlined, ExpandMore, Close } from "@mui/icons-material";
// import "../css/Modal.css";
// import imageCompression from "browser-image-compression";
// import { Close } from "@mui/icons-material";

// const CLOUDINARY_UPLOAD_URL =
//   "https://api.cloudinary.com/v1_1/dmjuvhepw/image/upload";
// const CLOUDINARY_UPLOAD_PRESET = "quora-clone";

// const AddQuePostModal = ({
//   isOpen,
//   onRequestClose,
//   user,
//   input,
//   setInput,
//   handleQuestion,
//   handlePost,
// }) => {
//   const [activeTab, setActiveTab] = useState("question");
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [uploading, setUploading] = useState(0);

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const options = {
//         maxSizeMB: 1,
//         maxWidthOrHeight: 1024,
//       };
//       const compressedFile = await imageCompression(file, options);
//       setImageFile(compressedFile);
//       setImagePreview(URL.createObjectURL(compressedFile));
//     }
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     setImagePreview(null);
//   };

//   const uploadToCloudinary = async () => {
//     if (!imageFile) return "";

//     const formData = new FormData();
//     formData.append("file", imageFile);
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

//     try {
//       setUploading(1);

//       const res = await fetch(CLOUDINARY_UPLOAD_URL, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       setUploading(0);
//       return data.secure_url;
//     } catch (error) {
//       console.error("Cloudinary upload error:", error);
//       alert("Image upload failed!");
//       setUploading(0);
//       return "";
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (activeTab === "question") {
//       handleQuestion(e);
//       onRequestClose();
//       return;
//     }

//     const imageUrl = await uploadToCloudinary();
//     handlePost(e, imageUrl);
//     setImageFile(null);
//     setImagePreview(null);
//     onRequestClose();
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       shouldCloseOnOverlayClick={false}
//       overlayClassName="ReactModal__Overlay"
//       className="ReactModal__Content"
//       ariaHideApp={false}
//     >
//       <div className="modal__title">
//         <h5
//           className={activeTab === "question" ? "active-tab" : ""}
//           onClick={() => setActiveTab("question")}
//         >
//           Add Question
//         </h5>
//         <h5
//           className={activeTab === "post" ? "active-tab" : ""}
//           onClick={() => setActiveTab("post")}
//         >
//           Add Post
//         </h5>
//       </div>

//       <div className="modal__info">
//         <Avatar className="avatar" src={user.photo} />
//         <p>{user.disPlayName ? user.disPlayName : user.email}</p>
//         {/* <div className="modal__scope">
//           <PeopleAltOutlined />
//           <p>Public</p>
//           <ExpandMore />
//         </div> */}
//       </div>

//       <div className="modal__Field modal__body">
//         {activeTab === "question" ? (
//           <textarea
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Start your question with 'What', 'How', 'Why', etc."
//             rows={5}
//             style={{ resize: "none" }}
//           />
//         ) : (
//           <>
//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Share your thoughts or post something interesting..."
//               rows={5}
//               style={{ resize: "none" }}
//             />

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="modal__fileInput"
//             />

//             {imagePreview && (
//               <div className="modal__imageContainer">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="modal__imagePreview"
//                 />
//                 <Close className="modal__imageClose" onClick={removeImage} />
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       <div className="modal__buttons sticky-footer">
//         <button className="cancle" onClick={onRequestClose}>
//           Cancel
//         </button>
//         <button
//           type="submit"
//           onClick={handleSubmit}
//           className="add"
//           disabled={uploading > 0}
//         >
//           {uploading > 0
//             ? "Uploading..."
//             : activeTab === "question"
//             ? "Add Question"
//             : "Add Post"}
//         </button>
//       </div>
//     </Modal>
//   );
// };

// export default AddQuePostModal;








import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Avatar from "@mui/material/Avatar";
import "../css/Modal.css";
import imageCompression from "browser-image-compression";
import { Close } from "@mui/icons-material";
import db from "../firebase";
import firebase from "firebase/compat/app";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dmjuvhepw/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "quora-clone";

const AddQuePostModal = ({ isOpen, onRequestClose, user, activeTab: initialTab  }) => {
  const [activeTab, setActiveTab] = useState("question");
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(0);

    useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);


  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
      };
      const compressedFile = await imageCompression(file, options);
      setImageFile(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploading(1);
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploading(0);
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert("Image upload failed!");
      setUploading(0);
      return "";
    }
  };

  const handleQuestion = async () => {
    if (!input.trim()) return;

    try {
      await db.collection("questions").add({
        user,
        question: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setInput("");
    } catch (err) {
      console.error("Failed to post question:", err);
    }
  };

  const handlePost = async () => {
    if (!input.trim()) return;
    const imageUrl = await uploadToCloudinary();

    try {
      await db.collection("posts").add({
        user,
        post: input,
        imageUrl: imageUrl || "",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setInput("");
      removeImage();
    } catch (err) {
      console.error("Failed to post:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "question") {
      await handleQuestion();
    } else {
      await handlePost();
    }

    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      overlayClassName="ReactModal__Overlay"
      className="ReactModal__Content"
      ariaHideApp={false}
    >
      <div className="modal__title">
        <h5 className={activeTab === "question" ? "active-tab" : ""} onClick={() => setActiveTab("question")}>
          Add Question
        </h5>
        <h5 className={activeTab === "post" ? "active-tab" : ""} onClick={() => setActiveTab("post")}>
          Add Post
        </h5>
      </div>

      <div className="modal__info">
        <Avatar className="avatar" src={user.photo} />
        <p>{user.disPlayName ? user.disPlayName : user.email}</p>
      </div>

      <div className="modal__Field modal__body">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            activeTab === "question"
              ? "Start your question with 'What', 'How', 'Why', etc."
              : "Share your thoughts or post something interesting..."
          }
          rows={5}
          style={{ resize: "none" }}
        />

        {activeTab === "post" && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="modal__fileInput"
            />

            {imagePreview && (
              <div className="modal__imageContainer">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="modal__imagePreview"
                />
                <Close className="modal__imageClose" onClick={removeImage} />
              </div>
            )}
          </>
        )}
      </div>

      <div className="modal__buttons sticky-footer">
        <button className="cancle" onClick={onRequestClose}>
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="add"
          disabled={uploading > 0}
        >
          {uploading > 0
            ? "Uploading..."
            : activeTab === "question"
            ? "Add Question"
            : "Add Post"}
        </button>
      </div>
    </Modal>
  );
};

export default AddQuePostModal;