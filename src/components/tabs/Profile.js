import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthProvider';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const { user } = useAuth();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [newProfilePic, setNewProfilePic] = useState(null);
    const [profilePicURL, setProfilePicURL] = useState(currentUser?.photoURL || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfilePic = async () => {
            if (user?.uid) {
                try {
                    const storage = getStorage();
                    const storageRef = ref(storage, `profilePics/${user.uid}.jpg`);
                    const url = await getDownloadURL(storageRef);
                    setProfilePicURL(url);
                } catch (error) {
                    console.error("Error fetching profile picture:", error);
                }
            }
        };
        fetchProfilePic();
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setNewProfilePic(file);
        } else {
            alert("Please upload a valid image file.");
        }
    };

    const compressAndResizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onloadend = () => {
                img.src = reader.result;
            };

            reader.onerror = reject;

            reader.readAsDataURL(file);

            img.onload = () => {
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = Math.round((width * MAX_HEIGHT) / height);
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => resolve(blob), file.type, 0.8);
            };
        });
    };

    const handleUpload = async () => {
        if (newProfilePic) {
            try {
                setLoading(true);

                const compressedImage = await compressAndResizeImage(newProfilePic);

                const storage = getStorage();
                const storageRef = ref(storage, `profilePics/${currentUser.uid}.jpg`);

                // Upload the image with the correct content type
                const metadata = {
                    contentType: newProfilePic.type,
                };
                await uploadBytes(storageRef, compressedImage, metadata);

                // Fetch the image URL without custom headers
                const downloadURL = await getDownloadURL(storageRef);
                await updateProfile(currentUser, { photoURL: downloadURL });

                setProfilePicURL(downloadURL);
                setNewProfilePic(null);

            } catch (error) {
                console.error("Error processing or uploading the image: ", error);
                alert(`Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSignOut = () => {
        auth.signOut();
    };

    const handlePasswordChange = () => {
        if (currentUser?.email) {
            auth.sendPasswordResetEmail(currentUser.email)
                .then(() => alert('Password reset email sent.'))
                .catch((error) => {
                    console.error("Error sending password reset email:", error);
                    alert(`Error: ${error.message}`);
                });
        }
    };

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            <div className="profile-info">
                <div className="profile-pic-container">
                    {profilePicURL ? (
                        <img src={`${profilePicURL}?alt=media`} alt="Profile" className="profile-pic" />
                    ) : (
                        <div className="profile-pic default-profile">No Image</div>
                    )}
                    <div className="upload-btn">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <button onClick={handleUpload} disabled={loading || !newProfilePic}>
                            {loading ? 'Uploading...' : 'Upload New Picture'}
                        </button>
                    </div>
                </div>

                <div className="user-details">
                    <p>Email: {currentUser?.email}</p>
                    <p>Registered on: {currentUser?.metadata?.creationTime}</p>
                    <button onClick={handlePasswordChange}>Change Password</button>
                </div>
            </div>

            <div className="sign-out">
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        </div>
    );
}

export default Profile;