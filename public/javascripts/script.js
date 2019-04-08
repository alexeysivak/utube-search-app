const inputLabel = document.getElementById('basic-addon1');
const searchResults = document.getElementById('search-results');

 function extractValue(el) {
     let val = el.value;
    const init = (method) => {
        return new Object({
            method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({input: val})
        })
    };
    if (val !== '') {
        inputLabel.textContent = 'Enter search parameters';
        inputLabel.style.color = 'black';
       return fetch('/videos', init('POST'))
           .then(res => res.json())
    } else {
        inputLabel.textContent = 'Enter name of the video';
        inputLabel.style.color = '#ff9908';
    }
}

async function inputAndRender(el) {
    let videos = await extractValue(el);
    while (searchResults.firstChild) {
        searchResults.removeChild(searchResults.firstChild);
    }
    videos.forEach( video =>{
        let mediaContainer = document.createElement('div');
        mediaContainer.className = 'media mt-3';

        let thumbnail = document.createElement('img');
        thumbnail.src = video.snippet.thumbnails.default.url;
        thumbnail.className = 'mr-3 thumbnail';
        thumbnail.alt = 'thumbnail';

        let mediaBody = document.createElement('div');
        mediaBody.className = 'media-body';

        let title = document.createElement('h5');
        title.className = 'mt-0 video-title';
        title.textContent = video.snippet.title;

        let button = document.createElement('button');
        button.type = 'button';
        button.className =  'btn btn-warning';
        button.textContent = 'Play video';
        button.id = video.id.videoId;
        button.setAttribute('onclick', 'playVideo(this)');
        mediaBody.appendChild(title);
        mediaBody.appendChild(button);

        mediaContainer.appendChild(thumbnail);
        mediaContainer.appendChild(mediaBody);

        searchResults.appendChild(mediaContainer);
    })
}

async function deleteFromData(el) {
     let videoId = el.id;
     await fetch(`/videodeletion/${videoId}`, {method: 'DELETE'});
    el.closest('.stored-video').style.display = 'none';
}



