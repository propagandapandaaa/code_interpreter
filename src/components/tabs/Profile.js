import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthProvider';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, getMetadata } from 'firebase/storage';
import './Profile.css';

function Profile() {
    const { user } = useAuth();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [newProfilePic, setNewProfilePic] = useState(null);
    const [profilePicURL, setProfilePicURL] = useState("");
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchAuthToken = async () => {
            if (currentUser) {
                try {
                    const token = await currentUser.getIdToken();
                    setToken(token);
                    console.log('Authorization Token:', token);
                } catch (error) {
                    console.error('Error fetching auth token:', error);
                }
            }
        };
        fetchAuthToken();
    }, [currentUser]);

    useEffect(() => {
        const fetchProfilePic = async () => {
            if (user?.uid) {
                try {
                    const storage = getStorage();
                    const storageRef = ref(storage, `profilePics/${user.uid}.jpg`);
                    const url = await getDownloadURL(storageRef);
                    const metadata = await getMetadata(storageRef);
                    const downloadToken = metadata?.customMetadata?.token;
                    if (downloadToken) {
                        setProfilePicURL(`${url}&token=${downloadToken}`);
                    } else {
                        setProfilePicURL(url);
                    }
                } catch (error) {
                    console.error('Error fetching profile picture:', error);
                    setProfilePicURL('https://firebasestorage.googleapis.com/v0/b/code-1383c.firebasestorage.app/o/profilePics%2Fdefault.png?alt=media&token=d6f2abe7-2d9c-41d3-b5aa-b005a214c874');
                }
            } else {
                setProfilePicURL('https://firebasestorage.googleapis.com/v0/b/code-1383c.firebasestorage.app/o/profilePics%2Fdefault.png?alt=media&token=d6f2abe7-2d9c-41d3-b5aa-b005a214c874');
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

    const handleUpload = async () => {
        if (newProfilePic && currentUser) {
            try {
                setLoading(true);
                const storage = getStorage();
                const fileName = `${currentUser.uid}.jpg`; // Ensure filename matches storage rules
                const storageRef = ref(storage, `profilePics/${fileName}`);

                // Upload the image with authenticated context
                await uploadBytes(storageRef, newProfilePic);

                // Fetch the download URL
                const downloadURL = await getDownloadURL(storageRef);

                // Update the user's profile with the new photo URL
                await updateProfile(currentUser, { photoURL: downloadURL });

                setProfilePicURL(downloadURL);
                setNewProfilePic(null);
                console.log('Upload successful!');
            } catch (error) {
                console.error("Error uploading: ", error);
                alert(`Upload failed: ${error.message}`);
            } finally {
                setLoading(false);
            }
        } else {
            alert('No file selected or user not authenticated.');
        }
    };

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            <div className="profile-info">
                <img
                    src={profilePicURL}
                    alt="Profile"
                    className="profile-pic"
                    onError={(e) => {
                        e.target.src = `https://firebasestorage.googleapis.com/v0/b/code-1383c.firebasestorage.app/o/profilePics%2Fdefault.png?alt=media&token=${token}`;
                    }}
                />
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={loading || !newProfilePic}>
                    {loading ? 'Uploading...' : 'Upload New Picture'}
                </button>
            </div>
        </div>
    );
}

export default Profile;
