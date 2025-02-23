// src/components/CodeEditor.js
import React, { useState } from 'react';
import axios from 'axios';

function CodeEditor() {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const executeCode = async () => {
        setIsLoading(true);
        setError('');
        setOutput('');

        try {
            const response = await axios.post('http://localhost:8000/api/execute', {
                code: code
            });
            setOutput(response.data.output);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="code-editor">
            <h1>Code Editor</h1>
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your Python code here..."
                rows={10}
                cols={50}
            />
            <button
                onClick={executeCode}
                disabled={isLoading}
            >
                {isLoading ? 'Executing...' : 'Run Code'}
            </button>

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

export default CodeEditor;
