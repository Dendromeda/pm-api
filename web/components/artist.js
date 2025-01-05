
class Artist extends HTMLElement {

    observedAttributes = ["name", "artistId"];
    albums = []; 
    name = "";
    artistId = 0;
    albumList;

    constructor() {
      super();
    }
    // Element functionality written in here

    connectedCallback() {
        console.log(this.getAttribute("name"), this.getAttribute("artistId"));
        this.name = this.getAttribute("name");
        this.artistId = this.getAttribute("artistId");
        const div = document.createElement("div");
        this.appendChild(div);
        const h = document.createElement("h3");
        h.textContent = this.name;
        div.appendChild(h);
        this.albumList = document.createElement("ul");
        div.appendChild(this.albumList);
        this.albumList.hidden = true;
        const artist = this;
        h.addEventListener("click", () => {
            artist.getAlbums();
            artist.toggle();
        });
    }

    hide() {
        this.albumList.hidden = true;
    }

    show() {
        this.albumList.hidden = false;
    }

    toggle() {
        this.albumList.hidden = !this.albumList.hidden;
    }

    getAlbums() {
        if (this.albums.length > 0) {
            return;
        }
        fetch(`http://dendromeda.se:4545/api/artist/${this.artistId}`)
         .then(res => res.json())
         .then(json => {
                this.albums = json.albums;
                this.albums.forEach(album => {
                    const elem = document.createElement("pm-album");
                    elem.setAttribute("title", album.title);
                    elem.setAttribute("albumId", album.id);
                    this.albumList.appendChild(elem);
                });
         })
    }


  }

  customElements.define("pm-artist", Artist);