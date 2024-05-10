import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor() {
    return (
        <div className="code-editor-container">
            <Editor theme="vs-dark" height="500px" defaultLanguage='python' defaultValue='// Edit your code here' />
        </div>
    );
}

export default CodeEditor;


// import './CodeEditor.css';
// import Editor from '@monaco-editor/react';

// const CodeEditor = () => {
//     return (
//         <div className="code-editor-container" style={{ paddingTop: '0px', borderRadius: '30px' }}>
//             <Editor theme="vs-dark" height="500px" defaultLanguage='python' defaultValue='// Edit your code here' />
//         </div>
//     );
// };

// export default CodeEditor;
