// src/api/codeService.js
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Save code to Firestore
/* FOR TESTING, doesnt save code for specific challenge */
export const saveCode = async (userId, code) => {
    try {
        await setDoc(doc(db, 'userCodes', userId), { code });
        console.log('Code saved successfully!');
    } catch (error) {
        console.error('Error saving code:', error);
    }
};

// Load code from Firestore
/* FOR TESTING, doesnt save code for specific challenge */
export const loadCode = async (userId) => {
    try {
        const docRef = doc(db, 'userCodes', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().code;
        } else {
            console.log('No code found!');
            return '';
        }
    } catch (error) {
        console.error('Error loading code:', error);
        return '';
    }
};


export const saveCodeToChallenge = async (userId, challengeId, code) => {
    const codeRef = doc(db, 'challenges', challengeId, 'submissions', userId);  // Sub-collection for each user
    await setDoc(codeRef, {
        code,
        timestamp: new Date(),
    });
};

// Load code from a specific challenge for the user
export const loadCodeForChallenge = async (userId, challengeId) => {
    const codeRef = doc(db, 'challenges', challengeId, 'submissions', userId);
    const docSnap = await getDoc(codeRef);
    if (docSnap.exists()) {
        return docSnap.data().code;
    } else {
        return null;
    }
};