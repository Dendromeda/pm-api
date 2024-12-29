package main

type Artist struct {
	ID     int      `json:"id"`
	Name   string   `json:"name"`
	Img    string   `json:"img,omitempty"`
	Albums []*Album `json:"albums,omitempty"`
}

type Album struct {
	ID       int      `json:"id"`
	Title    string   `json:"title"`
	Img      string   `json:"img,omitempty"`
	ArtistID int      `json:"artist,omitempty"`
	Tracks   []*Track `json:"tracks,omitempty"`
}

type Track struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	TrackNumber int    `json:"track_number"`
	Lyrics      string `json:"lyrics,omitempty"`
	AlbumID     int    `json:"album,omitempty"`
}
