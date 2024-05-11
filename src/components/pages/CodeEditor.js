import React from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

function CodeEditor() {
    return (
        <div className="code-editor-container">
            <div className='code-editor'>
                <Editor theme="vs-dark" height="500px" defaultLanguage='javascript' defaultValue='// Edit your code here' />
            </div>
        </div>
    );
}

export default CodeEditor;
