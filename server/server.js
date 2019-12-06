const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(cors());

const publicPath = path.join(__dirname, '..', 'public');


if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.resolve(__dirname, '..', 'build')));
} else {
    app.use(express.static(publicPath));
}

if (process.env.NODE_ENV === 'production'){
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
    });
} else{
    app.get('*', (req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port: ', PORT);
});