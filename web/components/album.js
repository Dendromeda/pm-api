class Album extends HTMLElement {

    observedAttributes = ["title", "albumId"];
    tracks = []; 
    title = "";
    albumId = 0;
    trackList;

    constructor() {
      super();
    }
    // Element functionality written in here

    connectedCallback() {
        this.title = this.getAttribute("title");
        this.albumId = this.getAttribute("albumId");
        const div = document.createElement("div");
        this.appendChild(div);
        const h = document.createElement("h4");
        h.textContent = this.title;
        div.appendChild(h);
        this.trackList = document.createElement("ol");
        div.appendChild(this.trackList);
        this.trackList.hidden = true;
        const album = this;
        h.addEventListener("click", () => {
            album.getTracks();
            album.toggle();
        });
    }

    hide() {
        this.trackList.hidden = true;
    }

    show() {
        this.trackList.hidden = false;
    }

    toggle() {
        this.trackList.hidden = !this.trackList.hidden;
    }

    getTracks() {
        if (this.tracks.length > 0) {
            return;
        }
        fetch(`http://dendromeda.se:4545/api/album/${this.albumId}`)
         .then(res => res.json())
         .then(json => {
                console.log(json);
                this.tracks = json.tracks;
                this.tracks.sort((a, b) => a.track_number - b.track_number);
                this.tracks.forEach(track => {
                    const li = document.createElement("li");
                    const elem = document.createElement("pm-track");
                    elem.setAttribute("title", track.title);
                    elem.setAttribute("trackId", track.id);
                    li.appendChild(elem);
                    this.trackList.appendChild(li);
                });
         })
    }
  }

  customElements.define("pm-album", Album);