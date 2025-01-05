
async function getArtists() {
  const res = await fetch('http://dendromeda.se:4545/api/artists')
  return await res.json()
}

function addArtists(data) {
    console.log("b", data);
    const list = document.getElementById("artistList");
    data.forEach(artist => {
        console.log(artist.name);
        const elem = document.createElement("pm-artist");
        console.log(artist);
        elem.setAttribute("name", artist.name);
        elem.setAttribute("artistId", artist.id);
        elem.setAttribute("imgSrc", artist.img);
        list.appendChild(elem);
    })
}

getArtists().then(addArtists)