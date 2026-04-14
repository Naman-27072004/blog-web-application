// app.js
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // Built-in for unique IDs
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let posts = [];

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/posts/new', (req, res) => {
    res.render('new-post');
});

app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    // Fix: Using unique ID instead of array index
    const newPost = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim()
    };
    posts.push(newPost);
    res.redirect('/');
});

app.get('/posts/:id/edit', (req, res) => {
    // Fix: Find by ID and handle 404
    const post = posts.find(p => p.id === req.params.id);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.render('edit-post', { post });
});

app.post('/posts/:id', (req, res) => {
    const { title, content } = req.body;
    // Fix: Find index by ID and handle 404
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).send('Post not found');
    }
    posts[index] = { ...posts[index], title: title.trim(), content: content.trim() };
    res.redirect('/');
});

app.post('/posts/:id/delete', (req, res) => {
    // Fix: Filter by ID instead of splicing by index
    const postExists = posts.some(p => p.id === req.params.id);
    if (!postExists) {
        return res.status(404).send('Post not found');
    }
    posts = posts.filter(p => p.id !== req.params.id);
    res.redirect('/');
});

// 404 Handler for other routes
app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
