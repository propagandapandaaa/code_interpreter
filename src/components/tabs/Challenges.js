import React, { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../AuthProvider';
import './Challenges.css';

const Challenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [newChallenge, setNewChallenge] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(5); // New state for max participants
    const challengesCollection = collection(db, 'challenges');
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch challenges when user is available
    useEffect(() => {
        if (user) {
            fetchChallenges();
        }
    }, [user]); // Only run fetchChallenges when user is available

    const fetchChallenges = async () => {
        if (!user) return; // Guard clause if user is not available

        const querySnapshot = await getDocs(challengesCollection);
        const challengesList = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                participants: data.participants || [],
                maxParticipants: data.maxParticipants || 5,
                isJoined: data.participants?.includes(user?.uid), // Check if user is in the participants list
            };
        }));
        setChallenges(challengesList);
    };

    const handleAddChallenge = async () => {
        if (newChallenge.trim() && maxParticipants > 0) {
            await addDoc(challengesCollection, {
                name: newChallenge,
                participants: [],
                maxParticipants: maxParticipants, // Use maxParticipants state here
                createdAt: new Date(),
                description: "Default challenge description"
            });
            setNewChallenge('');
            setMaxParticipants(5); // Reset to default after adding
            fetchChallenges();
        }
    };

    const handleDeleteChallenge = async (id) => {
        await deleteDoc(doc(db, 'challenges', id));
        fetchChallenges();
    };

    const goToEditor = (challengeId) => {
        navigate(`/editor/${challengeId}`);
    };

    const handleJoinChallenge = async (challengeId) => {
        const challengeRef = doc(db, 'challenges', challengeId);
        const challengeDoc = await getDoc(challengeRef);
        const currentParticipants = challengeDoc.data().participants || [];

        // Check if challenge is full
        if (currentParticipants.length >= challengeDoc.data().maxParticipants) {
            alert('Challenge is full!');
            return;
        }

        // Optimistically update the participants locally
        const updatedParticipants = [...currentParticipants, user.uid];
        setChallenges(prevChallenges =>
            prevChallenges.map(challenge =>
                challenge.id === challengeId
                    ? { ...challenge, participants: updatedParticipants }
                    : challenge
            )
        );

        // Now update Firestore
        await updateDoc(challengeRef, {
            participants: updatedParticipants,
        });

        // Re-fetch challenges to ensure we have the latest data
        fetchChallenges();
    };

    const handleLeaveChallenge = async (challengeId) => {
        const challengeRef = doc(db, 'challenges', challengeId);
        const challengeDoc = await getDoc(challengeRef);
        const currentParticipants = challengeDoc.data().participants || [];

        // Optimistically remove the user from the participants list
        const updatedParticipants = currentParticipants.filter(id => id !== user.uid);
        setChallenges(prevChallenges =>
            prevChallenges.map(challenge =>
                challenge.id === challengeId
                    ? { ...challenge, participants: updatedParticipants }
                    : challenge
            )
        );

        // Now update Firestore
        await updateDoc(challengeRef, {
            participants: updatedParticipants,
        });

        // Re-fetch challenges to ensure we have the latest data
        fetchChallenges();
    };

    return (
        <div className="challenges-container">
            <h1 className="challenges-title">Challenges Overview</h1>

            <div className="input-group">
                <input
                    type="text"
                    className="challenge-input"
                    placeholder="New Challenge Name"
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                />
                <input
                    type="number"
                    className="max-participants-input"
                    placeholder="Max Participants"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    min="1"
                />
                <button
                    className="add-button"
                    onClick={handleAddChallenge}
                >
                    Add Challenge
                </button>
            </div>

            <div className="challenges-grid">
                {challenges.map(challenge => (
                    <div key={challenge.id} className="challenge-card">
                        <div className="card-content">
                            <h2 className="challenge-name">{challenge.name}</h2>
                            <p className="participants-count">
                                Participants: {challenge.participants.length} / {challenge.maxParticipants}
                            </p>

                            {challenge.isJoined ? (
                                <div className="button-group">
                                    <button
                                        className="work-button"
                                        onClick={() => goToEditor(challenge.id)}
                                    >
                                        Work on Code
                                    </button>
                                    <button
                                        className="leave-button"
                                        onClick={() => handleLeaveChallenge(challenge.id)}
                                    >
                                        Leave Challenge
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="join-button"
                                    onClick={() => handleJoinChallenge(challenge.id)}
                                    disabled={challenge.participants.length >= challenge.maxParticipants}
                                >
                                    {challenge.participants.length >= challenge.maxParticipants
                                        ? 'Challenge Full'
                                        : 'Join Challenge'}
                                </button>
                            )}

                            {user?.isAdmin && (
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteChallenge(challenge.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Challenges;