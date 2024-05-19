const express = require('express');
const app = express();
const port = 3001; // Choose your port

const menuItems = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    // ... more items dynamically from a database, etc.
];

app.get('/api/menu-items', (req, res) => {
    res.json({ items: menuItems });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});