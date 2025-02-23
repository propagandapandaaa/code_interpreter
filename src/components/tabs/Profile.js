import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthProvider';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const { user } = useAuth();
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [profilePicURL, setProfilePicURL] = useState(user?.photoURL || "");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        if (user?.photoURL) {
            setProfilePicURL(user.photoURL);
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setNewProfilePic(file);
        } else {
            alert("Please upload a valid image file.");
        }
    };

    const handleUpload = async () => {
        if (newProfilePic) {
            const storage = getStorage();
            const storageRef = ref(storage, `profilePictures/${user.uid}`);
            try {
                setLoading(true);
                await uploadBytes(storageRef, newProfilePic);
                const downloadURL = await getDownloadURL(storageRef);
                setProfilePicURL(downloadURL);
                // Update the profile picture in Firebase Auth
                await updateProfile(user, { photoURL: downloadURL });
                setLoading(false);
            } catch (error) {
                console.error("Error uploading file: ", error);
                setLoading(false);
            }
        }
    };

    const handleSignOut = () => {
        getAuth().signOut();
    };

    const handlePasswordChange = () => {
        if (user?.email) {
            getAuth().sendPasswordResetEmail(user.email)
                .then(() => {
                    alert('Password reset email sent.');
                })
                .catch((error) => {
                    console.error("Error sending password reset email:", error);
                });
        }
    };
    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            <div className="profile-info">
                {/* Profile Picture */}
                <div className="profile-pic-container">
                    {profilePicURL ? (
                        <img src={profilePicURL} alt="Profile" className="profile-pic" />
                    ) : (
                        <div className="profile-pic default-profile">No Image</div>
                    )}
                    <div className="upload-btn">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <button onClick={handleUpload} disabled={loading}>
                            {loading ? 'Uploading...' : 'Upload New Picture'}
                        </button>
                    </div>
                </div>

                {/* User Information */}
                <div className="user-details">
                    <p>Email: {user?.email}</p>
                    <p>Registered on: {user?.metadata?.creationTime}</p>
                    {/* Password Change */}
                    <button onClick={handlePasswordChange}>Change Password</button>
                </div>
            </div>

            {/* Sign out button */}
            <div className="sign-out">
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        </div>
    );
}

export default Profile;