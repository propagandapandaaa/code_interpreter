import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { postRequest } from '../../api/apiService';
import { saveCodeToChallenge, loadCodeForChallenge } from '../../api/codeService'; // Modified service
import { auth } from '../../firebaseConfig';
import { useParams } from 'react-router-dom';  // For getting challengeId from URL
import './Coding.css';

function Coding() {
    const { challengeId } = useParams(); // Get challengeId from URL
    const [code, setCode] = useState('// Edit your code here');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // API route can be easily modified here
    const API_ROUTE = 'http://localhost:8000/api/execute';

    const handleEditorChange = (value) => {
        if (value !== undefined) {
            setCode(value);
        }
    };

    // Execute code via API
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

    // Save code to Firebase in relation to the challenge
    const handleSaveClick = async () => {
        const user = auth.currentUser;
        if (user && challengeId) {
            await saveCodeToChallenge(user.uid, challengeId, code); // Save code for specific challenge
            console.log('Code saved for challenge:', challengeId);
        } else {
            console.log('User not logged in or no challenge ID');
        }
    };

    // Load code from Firebase for the specific challenge
    const handleLoadClick = async () => {
        const user = auth.currentUser;
        if (user && challengeId) {
            const loadedCode = await loadCodeForChallenge(user.uid, challengeId); // Load code for specific challenge
            setCode(loadedCode || '// No code found');
            console.log('Code loaded for challenge:', challengeId);
        } else {
            console.log('User not logged in or no challenge ID');
        }
    };

    // Load code on component mount
    useEffect(() => {
        handleLoadClick();
    }, [challengeId]);

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
                <button onClick={handleSaveClick}>Save Code</button>
                <button onClick={handleLoadClick}>Load Code</button>
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