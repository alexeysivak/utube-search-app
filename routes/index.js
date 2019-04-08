const express = require('express');
const fetch = require('node-fetch'); // gives us ability to use fetch on back end as well
const router = express.Router();
const db = require('../db/db');

db.checkConnection(); // check if db connected
// GET https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&key=[YOUR_API_KEY] HTTP/1.1
const API_KEY = 'AIzaSyBJk3aUPzSI0IIuubY7O6nlMFkv-vo-6dw';
const youtubeBasic = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=18&q=`;

/* GET home page. */
router.get('/', async function (req, res, next) {
    const videosStored = await db.getCollection('videos');
    res.render('index', {title: 'Youtube search App', videos: videosStored});
});

router.post('/videos', async function (req, res, next) {
    let input = await req.body.input;
    let youtubeUrl = `${youtubeBasic}${input}&type=video&key=${API_KEY}`;
    let videos = await fetch(youtubeUrl)
        .then(res => res.json())
        .then(json => json.items)
        .catch(e => console.log(e));
    res.send(videos)
});

router.post('/addvideo', async function (req, res) {
    let data = await req.body;
    const existingVideos = JSON.stringify(await db.getCollection('videos'));
    if (!~(existingVideos.search(data.videoId))) {
        await db.sendData(data, 'videos');
        const videos = await db.getCollection('videos');
        const lastAddedVideo = videos.pop();
        res.json(lastAddedVideo);
    } else {
        console.log('video already exists!');
        res.end()
    }

});

router.delete('/videodeletion/:id', async function (req, res, next) {
    let id = await req.params.id;
    await db.deleteData(id, 'videos'); //  insert as arguments necessary args
    await res.end('/');
});


module.exports = router;
