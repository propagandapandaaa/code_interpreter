import React, { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../AuthProvider';
import './ChallengeDetail.css';

const ChallengeDetail = () => {
    const { challengeId } = useParams(); // Get the challenge ID from the URL
    const [challenge, setChallenge] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchChallengeDetail();
    }, [challengeId]);

    const fetchChallengeDetail = async () => {
        if (!challengeId) return;

        const challengeRef = doc(db, 'challenges', challengeId);
        const challengeDoc = await getDoc(challengeRef);

        if (challengeDoc.exists()) {
            setChallenge({
                id: challengeDoc.id,
                ...challengeDoc.data(),
                isJoined: challengeDoc.data().participants?.includes(user?.uid),
            });
        }
    };

    const handleJoinChallenge = async () => {
        const challengeRef = doc(db, 'challenges', challengeId);
        const challengeDoc = await getDoc(challengeRef);
        const currentParticipants = challengeDoc.data().participants || [];

        // Check if challenge is full
        if (currentParticipants.length >= challengeDoc.data().maxParticipants) {
            alert('Challenge is full!');
            return;
        }

        const updatedParticipants = [...currentParticipants, user.uid];
        await updateDoc(challengeRef, { participants: updatedParticipants });

        fetchChallengeDetail(); // Re-fetch the challenge details
    };

    const handleLeaveChallenge = async () => {
        const challengeRef = doc(db, 'challenges', challengeId);
        const challengeDoc = await getDoc(challengeRef);
        const currentParticipants = challengeDoc.data().participants || [];

        const updatedParticipants = currentParticipants.filter(id => id !== user.uid);
        await updateDoc(challengeRef, { participants: updatedParticipants });

        fetchChallengeDetail(); // Re-fetch the challenge details
    };

    if (!challenge) return <div>Loading...</div>;

    return (
        <div className="challenge-detail-container">
            <button className="back-button" onClick={() => navigate('/challenges')}>
                Back to Challenges
            </button>

            <h1 className="challenge-name">{challenge.name}</h1>
            <p className="challenge-description">{challenge.description}</p>
            <p className="participants-count">
                Participants: {challenge.participants.length} / {challenge.maxParticipants}
            </p>

            <h2 className="participants-title">Participants</h2>
            <ul className="participants-list">
                {challenge.participants.map((participantId, index) => (
                    <li key={index} className="participant-item">
                        {participantId}
                    </li>
                ))}
            </ul>

            {challenge.isJoined ? (
                <button className="leave-button" onClick={handleLeaveChallenge}>
                    Leave Challenge
                </button>
            ) : (
                <button
                    className="join-button"
                    onClick={handleJoinChallenge}
                    disabled={challenge.participants.length >= challenge.maxParticipants}
                >
                    {challenge.participants.length >= challenge.maxParticipants
                        ? 'Challenge Full'
                        : 'Join Challenge'}
                </button>
            )}
        </div>
    );
};

export default ChallengeDetail;