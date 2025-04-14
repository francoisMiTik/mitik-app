import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import "./UserProfile.css";

function UserProfile({ username, onClose }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following] = useState(0); // pour l’exemple, fixé à 0

  const allVideos = JSON.parse(localStorage.getItem("videos")) || [];
  const userVideos = allVideos.filter((v) => v.username === username);

  useEffect(() => {
    const followedUsers = JSON.parse(localStorage.getItem("followedUsers")) || {};
    if (followedUsers[username]) {
      setIsFollowing(true);
      setFollowers(followedUsers[username].followers || 1);
    }
  }, [username]);

  const toggleFollow = () => {
    const updatedFollowing = !isFollowing;
    const updatedFollowers = updatedFollowing ? followers + 1 : followers - 1;
    setIsFollowing(updatedFollowing);
    setFollowers(updatedFollowers);

    const followedUsers = JSON.parse(localStorage.getItem("followedUsers")) || {};
    followedUsers[username] = {
      isFollowing: updatedFollowing,
      followers: updatedFollowers,
    };
    localStorage.setItem("followedUsers", JSON.stringify(followedUsers));
  };

  return (
    <div className="user-profile">
      <div className="header">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="profile-info">
        <img
          src={`https://i.pravatar.cc/150?u=${username}`}
          alt="Profil"
          className="profile-pic"
        />
        <h2>{username}</h2>
        <p className="bio">Bienvenue sur mon profil ! 🎥</p>
        <div className="stats">
          <span><strong>{followers}</strong> abonnés</span>
          <span><strong>{following}</strong> abonnements</span>
          <span><strong>{userVideos.length}</strong> vidéos</span>
        </div>
        <button className={`follow-btn ${isFollowing ? "following" : ""}`} onClick={toggleFollow}>
          {isFollowing ? "Abonné ✅" : "Suivre"}
        </button>
      </div>

      <div className="user-videos">
        <h3>Vidéos postées :</h3>
        <div className="video-list">
          {userVideos.length > 0 ? (
            userVideos.map((video, index) => (
              <video
                key={index}
                src={video.src}
                className="mini-video"
                controls
              />
            ))
          ) : (
            <p>Aucune vidéo pour l’instant.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
