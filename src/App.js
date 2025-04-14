import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import { FaHeart, FaComment, FaShare, FaPlus, FaTimes } from "react-icons/fa";
import UserProfile from "./UserProfile"; // 👈 Import du profil utilisateur

const initialVideos = [
  {
    src: "video1.mp4",
    username: "@john_doe",
    description: "Une belle journée à la plage 🌊",
    likes: 150,
    comments: 25,
    shares: 10,
    liked: false,
    commentList: [],
  },
  {
    src: "video2.mp4",
    username: "@mia_music",
    description: "Ma nouvelle chanson est sortie 🎵",
    likes: 320,
    comments: 45,
    shares: 60,
    liked: false,
    commentList: [],
  },
  {
    src: "video3.mp4",
    username: "@funnycat",
    description: "Ce chat est un clown 😂",
    likes: 890,
    comments: 120,
    shares: 200,
    liked: false,
    commentList: [],
  },
];

function App() {
  const videoRefs = useRef([]);
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem("videos");
    return saved ? JSON.parse(saved) : initialVideos;
  });
  const [showForm, setShowForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    file: null,
    username: "",
    description: "",
  });

  const [activeComments, setActiveComments] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // 👈 Pour afficher un profil

  useEffect(() => {
    const toSave = videos.filter(v => !v.src.startsWith("blob:"));
    try {
      localStorage.setItem("videos", JSON.stringify(toSave));
    } catch (e) {
      console.warn("LocalStorage plein ou erreur :", e);
    }
  }, [videos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          const video = videoRefs.current[index];
          if (!video) return;

          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.75 }
    );

    videoRefs.current.forEach((video, i) => {
      if (video) {
        video.dataset.index = i;
        observer.observe(video);
      }
    });

    return () => observer.disconnect();
  }, [videos]);

  const toggleLike = (index) => {
    setVideos((prevVideos) =>
      prevVideos.map((video, i) => {
        if (i === index) {
          const liked = !video.liked;
          const likes = liked ? video.likes + 1 : video.likes - 1;
          return { ...video, liked, likes };
        }
        return video;
      })
    );
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!newVideo.file || !newVideo.username || !newVideo.description) {
      alert("Remplis tous les champs !");
      return;
    }

    const objectURL = URL.createObjectURL(newVideo.file);
    const newVideoData = {
      src: objectURL,
      username: newVideo.username,
      description: newVideo.description,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      commentList: [],
    };

    const updatedVideos = [newVideoData, ...videos];
    setVideos(updatedVideos);
    setShowForm(false);
    setNewVideo({ file: null, username: "", description: "" });
  };

  const handleVideoClick = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.paused ? video.play() : video.pause();
    }
  };

  const openComments = (index) => {
    setActiveComments(index);
    setNewComment("");
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const updated = videos.map((video, i) => {
      if (i === activeComments) {
        const updatedComments = [...video.commentList, newComment];
        return {
          ...video,
          commentList: updatedComments,
          comments: video.comments + 1,
        };
      }
      return video;
    });

    setVideos(updated);
    setNewComment("");
  };

  const openUserProfile = (username) => {
    setSelectedUser(username); // 👈 Affiche le profil
  };

  return (
    <div className="app">
      {videos.map((video, index) => (
        <div className="video-container" key={index}>
          <video
            className="video"
            src={video.src}
            loop
            playsInline
            controls={false}
            ref={(el) => (videoRefs.current[index] = el)}
            onClick={() => handleVideoClick(index)}
          ></video>

          <div className="icons">
            <button onClick={() => toggleLike(index)}>
              <FaHeart color={video.liked ? "red" : "white"} />
            </button>
            <button onClick={() => openComments(index)}>
              <FaComment />
            </button>
            <button><FaShare /></button>
          </div>

          <div className="video-info">
          <h4
  className="username"
  onClick={() => openUserProfile(video.username)}
>
  {video.username}
</h4>
            <p>{video.description}</p>
            <div className="counters">
              <span>❤️ {video.likes}</span>
              <span>💬 {video.comments}</span>
              <span>🔁 {video.shares}</span>
            </div>
          </div>
        </div>
      ))}

      <button className="plus-button" onClick={() => setShowForm(true)}>
        <FaPlus />
      </button>

      {showForm && (
        <div className="upload-form-overlay">
          <form className="upload-form" onSubmit={handleAddVideo}>
            <button className="close-button" onClick={() => setShowForm(false)} type="button">
              <FaTimes />
            </button>
            <h3>Ajouter une vidéo</h3>
            <input type="file" accept="video/*" onChange={(e) => setNewVideo({ ...newVideo, file: e.target.files[0] })} />
            <input type="text" placeholder="Nom d'utilisateur" value={newVideo.username} onChange={(e) => setNewVideo({ ...newVideo, username: e.target.value })} />
            <textarea placeholder="Description" value={newVideo.description} onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })} />
            <button type="submit">Ajouter</button>
          </form>
        </div>
      )}

      {activeComments !== null && (
        <div className="comment-overlay">
          <div className="comment-box">
            <button className="close-button" onClick={() => setActiveComments(null)}>
              <FaTimes />
            </button>
            <h4>Commentaires</h4>
            <div className="comment-list">
              {videos[activeComments].commentList.map((comment, idx) => (
                <p key={idx}>💬 {comment}</p>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ajouter un commentaire"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
            />
            <button onClick={addComment}>Envoyer</button>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="user-profile-overlay">
          <UserProfile username={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
      )}
    </div>
  );
}

export default App;
