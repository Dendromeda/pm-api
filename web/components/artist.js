
class Artist extends HTMLElement {

    observedAttributes = ["name", "artistId", "imgSrc"];
    albums = []; 
    name = "";
    artistId = 0;
    albumList;
    img;

    constructor() {
      super();
    }
    // Element functionality written in here

    connectedCallback() {
        this.name = this.getAttribute("name");
        this.artistId = this.getAttribute("artistId");
        const div = document.createElement("div");
        this.appendChild(div);
        const h = document.createElement("h3");
        h.textContent = this.name;
        div.appendChild(h);
        this.img = document.createElement("img");
        this.img.src = this.getAttribute("imgSrc");
        this.img.style.display = "none";
        this.img.style.width = "100px";
        this.img.style.height = "100px";
        div.appendChild(this.img);
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
        this.img.style.display = "none";
        this.albumList.hidden = true;
    }

    show() {
        this.img.style.display = "block";
        this.albumList.hidden = false;
    }

    toggle() {
        this.img.style.display = this.img.style.display === "none" ? "block" : "none";
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