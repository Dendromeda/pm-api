package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

var (
	artists        map[int]*Artist
	albums         map[int]*Album
	albumsByArtist map[int][]*Album
	tracks         map[int]*Track
	tracksByAlbum  map[int][]*Track
)

func main() {

	readArtist()
	readAlbums()
	readTracks()

	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	r.Use(middleware.Logger)
	r.Get("/api", func(w http.ResponseWriter, r *http.Request) {

	})
	r.Get("/api/artists", func(w http.ResponseWriter, r *http.Request) {

		arr := make([]*Artist, 0)
		for _, v := range artists {
			arr = append(arr, v)
		}

		x, err := json.MarshalIndent(arr, "", "  ")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(x)
	})
	r.Get("/api/artist/{artist_id}", func(w http.ResponseWriter, r *http.Request) {
		artistID, err := strconv.Atoi(chi.URLParam(r, "artist_id"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		artist, ok := artists[artistID]
		if !ok {
			http.Error(w, "artist not found", http.StatusNotFound)
			return
		}
		artist.Albums = albumsByArtist[artistID]

		x, err := json.MarshalIndent(artist, "", "  ")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(x)
		artist.Albums = nil
	})
	r.Get("/api/album/{album_id}", func(w http.ResponseWriter, r *http.Request) {
		albumID, err := strconv.Atoi(chi.URLParam(r, "album_id"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		album, ok := albums[albumID]
		if !ok {
			http.Error(w, "album not found", http.StatusNotFound)
			return
		}

		tracks := make([]*Track, 0)

		for _, v := range tracksByAlbum[albumID] {
			tracks = append(album.Tracks, &Track{
				ID:          v.ID,
				Title:       v.Title,
				TrackNumber: v.TrackNumber,
			})
		}

		albumCopy := &Album{
			ID:     album.ID,
			Title:  album.Title,
			Img:    album.Img,
			Tracks: tracks,
		}
		x, err := json.MarshalIndent(albumCopy, "", "  ")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(x)
	})
	r.Get("/api/track/{track_id}", func(w http.ResponseWriter, r *http.Request) {
		trackID, err := strconv.Atoi(chi.URLParam(r, "track_id"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		track, ok := tracks[trackID]
		if !ok {
			http.Error(w, "track not found", http.StatusNotFound)
			return
		}

		x, err := json.MarshalIndent(track, "", "  ")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(x)
	})

	err := http.ListenAndServe(":4545", r)
	if err != nil {
		panic(err)
	}

}

func readArtist() {

	artists = make(map[int]*Artist)

	f, err := os.ReadFile("artists.json")
	if err != nil {
		panic(err)
	}
	var artistsF []map[string]any
	err = json.Unmarshal(f, &artistsF)
	if err != nil {
		panic(err)
	}

	for _, v := range artistsF {
		artist := &Artist{}
		artist.ID = int(v["id"].(float64))
		artist.Name = v["name"].(string)
		artist.Img = v["img"].(string)

		artists[artist.ID] = artist
	}

	x, err := json.MarshalIndent(artists, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(x))

}

func readAlbums() {

	albums = make(map[int]*Album)
	albumsByArtist = make(map[int][]*Album)

	f, err := os.ReadFile("albums.json")
	if err != nil {
		panic(err)
	}
	var albumsF []map[string]any
	err = json.Unmarshal(f, &albumsF)
	if err != nil {
		panic(err)
	}

	for _, v := range albumsF {
		album := &Album{}
		album.ID = int(v["id"].(float64))
		album.Title = v["title"].(string)
		album.Img = v["img"].(string)

		albums[album.ID] = album

		artistID := int(v["artist"].(float64))
		if _, ok := albumsByArtist[artistID]; !ok {
			albumsByArtist[artistID] = make([]*Album, 0)
		}
		albumsByArtist[artistID] = append(albumsByArtist[artistID], album)
	}

	x, err := json.MarshalIndent(albums, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(x))

}

func readTracks() {

	tracks = make(map[int]*Track)
	tracksByAlbum = make(map[int][]*Track)
	f, err := os.ReadFile("tracks.json")
	if err != nil {
		panic(err)
	}
	var tracksF []map[string]any
	err = json.Unmarshal(f, &tracksF)
	if err != nil {
		panic(err)
	}

	for _, v := range tracksF {
		track := &Track{}
		track.ID = int(v["id"].(float64))
		track.Title = v["title"].(string)
		track.TrackNumber = int(v["track_number"].(float64))
		if v["lyrics"] != nil {
			track.Lyrics = v["lyrics"].(string)
		}

		tracks[track.ID] = track

		albumID := int(v["album"].(float64))
		if _, ok := tracksByAlbum[albumID]; !ok {
			tracksByAlbum[albumID] = make([]*Track, 0)
		}
		tracksByAlbum[albumID] = append(tracksByAlbum[albumID], track)
	}

	x, err := json.MarshalIndent(tracks, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(x))
}
