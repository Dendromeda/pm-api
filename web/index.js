
function getArtists() {
    const list = document.getElementById("artistList")
  fetch('http://dendromeda.se:4545/api/artists')
    .then(response => response.json())
    .then(data => {
        data.forEach(artist => {
            console.log(artist.name);
            const elem = document.createElement("pm-artist");
            console.log(artist);
            elem.setAttribute("name", artist.name);
            elem.setAttribute("artistId", artist.id);
            list.appendChild(elem);
        })
    })
}

getArtists();