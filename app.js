// app.js
const express = require('express');
const bodyParser = require('body-parser');
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
    posts.push({ title, content });
    res.redirect('/');
});

app.get('/posts/:id/edit', (req, res) => {
    const post = posts[req.params.id];
    res.render('edit-post', { post, id: req.params.id });
});

app.post('/posts/:id', (req, res) => {
    const { title, content } = req.body;
    posts[req.params.id] = { title, content };
    res.redirect('/');
});

app.post('/posts/:id/delete', (req, res) => {
    posts.splice(req.params.id, 1);
    res.redirect('/');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
