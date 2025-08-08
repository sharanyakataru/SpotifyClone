import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import SearchResults from "./SearchResults";
import PlaylistView from "./PlaylistView";
import { clonePlaylist } from "../utils/playlistUtils";

export default function Body({ headerBackground: $headerBackground }) {
  const [{ 
    token, 
    selectedPlaylist, 
    selectedPlaylistId, 
    searchResults, 
    searchQuery,
    currentPlaying,
    playerState 
  }, dispatch] = useStateProvider();
  
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's own playlists for home view
  useEffect(() => {
    const getUserPlaylists = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists?limit=50",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        
        const validPlaylists = response.data.items.filter(playlist => playlist && playlist.id);
        setFeaturedPlaylists(validPlaylists);
        
        dispatch({ type: reducerCases.SET_PLAYLISTS, payload: validPlaylists });
      } catch (error) {
        console.error("Error fetching playlists:", error);
        setFeaturedPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch playlists if no specific playlist is selected and no search results
    if (!selectedPlaylistId && !searchResults) {
      getUserPlaylists();
    }
  }, [token, selectedPlaylistId, searchResults, dispatch]);

  // Fetch specific playlist when selectedPlaylistId is available
  useEffect(() => {
    const getInitialPlaylist = async () => {
      if (!token || !selectedPlaylistId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        
        const selectedPlaylist = {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description?.startsWith("<a") 
            ? "" 
            : response.data.description || "",
          image: response.data.images?.[0]?.url || "",
          tracks: response.data.tracks.items
            .filter(item => item && item.track && item.track.id)
            .map(({ track }) => ({
              id: track.id,
              name: track.name,
              artists: track.artists.map((artist) => artist.name),
              image: track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || "",
              duration: track.duration_ms,
              album: track.album?.name || "Unknown Album",
              context_uri: track.album?.uri || "",
              track_number: track.track_number || 1,
            })),
        };
        
        dispatch({ type: reducerCases.SET_PLAYLIST, payload: selectedPlaylist });
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedPlaylistId) {
      getInitialPlaylist();
    }
  }, [token, dispatch, selectedPlaylistId]);

  const playTrack = async (id, name, artists, image, context_uri, track_number) => {
    try {
      const response = await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        {
          context_uri,
          offset: {
            position: track_number - 1,
          },
          position_ms: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      
      if (response.status === 204) {
        const currentPlaying = { id, name, artists, image };
        dispatch({ type: reducerCases.SET_PLAYING, payload: currentPlaying });
        dispatch({ type: reducerCases.SET_PLAYER_STATE, payload: true });
      } else {
        dispatch({ type: reducerCases.SET_PLAYER_STATE, payload: true });
      }
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const handleClone = async () => {
    if (!selectedPlaylist) return;

    const result = await clonePlaylist(token, selectedPlaylist, dispatch, reducerCases);

    if (result.success) {
      alert("Playlist cloned successfully!");
    } else {
      alert("Failed to clone playlist");
    }
  };

  const selectPlaylist = (playlistId) => {
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, payload: playlistId });
  };

  const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <Container $headerBackground={$headerBackground}>
        <div className="loading">Loading...</div>
      </Container>
    );
  }

  return (
    <Container $headerBackground={$headerBackground}>
      {searchResults ? (
        <SearchResults
          searchResults={searchResults}
          searchQuery={searchQuery}
          playTrack={playTrack}
          selectPlaylist={selectPlaylist}
          msToMinutesAndSeconds={msToMinutesAndSeconds}
          currentPlaying={currentPlaying}
          playerState={playerState}
        />
      ) : selectedPlaylist ? (
        <PlaylistView
          selectedPlaylist={selectedPlaylist}
          playTrack={playTrack}
          msToMinutesAndSeconds={msToMinutesAndSeconds}
          currentPlaying={currentPlaying}
          playerState={playerState}
          onClone = {handleClone}
        />
      ) : (
        <div className="home-content">
          <div className="greeting">
            <h1>{getGreeting()}</h1>
          </div>
          
          {featuredPlaylists.length > 0 && (
            <div className="featured-section">
              <h2>Your Playlists</h2>
              <div className="playlists-grid">
                {featuredPlaylists
                  .filter(playlist => playlist && playlist.id)
                  .map((playlist) => (
                    <div
                      key={playlist.id}
                      className="playlist-card"
                      onClick={() => selectPlaylist(playlist.id)}
                    >
                      <div className="playlist-image">
                        <img 
                          src={playlist.images?.[0]?.url || "/placeholder-playlist.png"} 
                          alt={playlist.name} 
                        />
                      </div>
                      <div className="playlist-info">
                        <h3>{playlist.name}</h3>
                        <p>{playlist.description || `${playlist.tracks?.total || 0} tracks`}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    color: white;
    font-size: 1.2rem;
  }

  .home-content {
    padding: 2rem;
    color: white;
    
    .greeting {
      margin-bottom: 2rem;
      
      h1 {
        font-size: 2rem;
        font-weight: bold;
      }
    }
    
    .featured-section {
      h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: white;
      }
      
      .playlists-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
        
        .playlist-card {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }
          
          .playlist-image {
            img {
              width: 100%;
              aspect-ratio: 1;
              object-fit: cover;
              border-radius: 8px;
              margin-bottom: 1rem;
            }
          }
          
          .playlist-info {
            h3 {
              font-size: 1rem;
              font-weight: bold;
              margin-bottom: 0.5rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            
            p {
              font-size: 0.8rem;
              color: #b3b3b3;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
    }
  }
`;