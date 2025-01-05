
class Track extends HTMLElement {

    observedAttributes = ["title", "trackId"];
    lyrics;
    title = "";
    trackId = 0;

    constructor() {
      super();
    }
    // Element functionality written in here

    connectedCallback() {
        console.log(this.getAttribute("title"), this.getAttribute("trackId"));
        this.title = this.getAttribute("title");
        this.trackId = this.getAttribute("trackId");
        const div = document.createElement("div");
        this.appendChild(div);
        const h = document.createElement("h5");
        h.textContent = this.title;
        div.appendChild(h);
        this.lyrics = document.createElement("div");
        div.appendChild(this.lyrics);
        this.lyrics.hidden = true;
        const track = this;
        h.addEventListener("click", () => {
            track.getLyrics();
            track.toggle();
        });
    }

    hide() {
        this.lyrics.hidden = true;
    }

    show() {
        this.lyrics.hidden = false;
    }

    toggle() {
        this.lyrics.hidden = !this.lyrics.hidden;
    }

    getLyrics() {
        if (this.lyrics.textContent.length > 0) {
            return;
        }
        fetch(`http://dendromeda.se:4545/api/track/${this.trackId}`)
         .then(res => res.json())
         .then(json => {
                const unformatted = json.lyrics
                unformatted.split("\n").forEach(line => {
                    console.log(this.lyrics);
                    console.log(line);
                    const p = document.createElement("span")
                    p.textContent = line;
                    const br = document.createElement("br");
                    this.lyrics.appendChild(p);
                    this.lyrics.appendChild(br);
                });
         })
    }


  }

  customElements.define("pm-track", Track);