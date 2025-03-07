import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { postRequest } from '../../api/apiService';
import { saveCodeToChallenge, loadCodeForChallenge } from '../../api/codeService';
import { auth } from '../../firebaseConfig';
import { useParams } from 'react-router-dom';
import './Coding.css';

function Coding() {
    const { challengeId } = useParams();
    const [code, setCode] = useState('// Edit your code here');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);  // State to store authenticated user

    const API_ROUTE = 'http://localhost:8000/api/execute';

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const handleEditorChange = (value) => {
        if (value !== undefined) {
            setCode(value);
        }
    };

    const handleExecuteClick = async () => {
        console.log('Editor Content:', code);
        setIsLoading(true);
        setError('');
        setOutput('');

        const { output, error } = await postRequest(API_ROUTE, { code });
        setOutput(output);
        setError(error);

        setIsLoading(false);
    };

    const handleSaveClick = async () => {
        if (user && challengeId) {
            await saveCodeToChallenge(user.uid, challengeId, code);
            console.log('Code saved for challenge:', challengeId);
        } else {
            console.log('User not logged in or no challenge ID');
        }
    };

    const handleLoadClick = async () => {
        console.log('Challenge:', challengeId);
        console.log('User:', user);

        if (user && challengeId) {
            const loadedCode = await loadCodeForChallenge(user.uid, challengeId);
            setCode(loadedCode || '// No code found');
            console.log('Code loaded for challenge:', challengeId);
        } else {
            console.log('User not logged in or no challenge ID');
        }
    };

    // Load code when user authentication state changes and challengeId is available
    useEffect(() => {
        if (user && challengeId) {
            handleLoadClick();
        }
    }, [user, challengeId]);

    return (
        <div className="code-editor-container">
            <div className="code-editor">
                <Editor
                    theme="vs-dark"
                    height="500px"
                    defaultLanguage="python"
                    value={code}
                    onChange={handleEditorChange}
                />
            </div>

            <div className="buttons">
                <button onClick={handleExecuteClick} disabled={isLoading}>
                    {isLoading ? 'Executing...' : 'Run Code'}
                </button>
                <button onClick={handleSaveClick} disabled={!user}>
                    Save Code
                </button>
                <button onClick={handleLoadClick} disabled={!user}>
                    Load Code
                </button>
            </div>

            {output && (
                <div className="output">
                    <h3>Output:</h3>
                    <pre>{output}</pre>
                </div>
            )}

            {error && (
                <div className="error">
                    <h3>Error:</h3>
                    <pre>{error}</pre>
                </div>
            )}
        </div>
    );
}

export default Coding;