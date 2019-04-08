const playedVideo = document.getElementById('playedVideoTitle');
const historyContainer = document.getElementById('historyContainer');

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let replacement = 'player';

function onYouTubeIframeAPIReady() { // after loading the script with iframe api , videoframe will be created
    player = new YT.Player(replacement, {
        className: 'embed-responsive-item playField',
        playerVars: {'rel': 0},
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
}

function onPlayerReady() {
    console.log('Ready to play the video!');
}

let id;

function playVideo(el) {
    let videoTitle;
    if(el.closest('.media-body')){
        videoTitle = el.closest('.media-body').children[0].innerText;
    }
    else{
        videoTitle = el.textContent;
    }
    playedVideo.innerText = videoTitle; // takes video name and insert it before iframe
    id = el.id;
    player.loadVideoById(id);
}

function sendInfoToServ(data) {
    const init = (method) => {
        return new Object({
            method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
    };
    return fetch('/addvideo', init('POST'))
        .then(res => res.clone())
        .then(cloned => cloned.json())
}


async function onPlayerStateChange() {
    const videoData = {};
    console.log('player state changed');
    if (player.getPlayerState() === 1) {
        videoData.videoTitle = playedVideo.innerText;
        videoData.videoId = id;

        // console.log(videoData);
        console.log('ready to save to db');
        let historyVideos = await sendInfoToServ(videoData);
        let { videoTitle, videoId, _id} = historyVideos;
        await historyDataInsertion(videoTitle, videoId, _id)
    }
}

function historyDataInsertion(title, id, dbId) {
    let storedVideo = document.createElement('div');
    storedVideo.className = 'stored-video';

    let storedVideoTitle = document.createElement('h5');
    storedVideoTitle.className = 'stored-video-title';
    storedVideoTitle.textContent = title;
    storedVideoTitle.id = id;
    storedVideoTitle.setAttribute('onclick', 'playVideo(this)');

    let storedVideoDeletor = document.createElement('button');
    storedVideoDeletor.type = 'button';
    storedVideoDeletor.className = 'close video-deleter';
    storedVideoDeletor['aria-label'] = 'Close';
    storedVideoDeletor.id = dbId;
    storedVideoDeletor.setAttribute('onclick', 'deleteFromData(this)');
    let span = document.createElement('span');
    span['aria-hidden'] = 'true';
    span.className = 'video-deleter-span';
    span.innerHTML = '&times;';
    storedVideoDeletor.appendChild(span);

    storedVideo.appendChild(storedVideoTitle);
    storedVideo.appendChild(storedVideoDeletor);
    historyContainer.appendChild(storedVideo);
}



