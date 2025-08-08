import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { AiFillClockCircle } from "react-icons/ai";
import { reducerCases } from "../utils/Constants";

export default function Body({ headerBackground: $headerBackground }) {
  const [{ token, selectedPlaylist, selectedPlaylistId }, dispatch] = useStateProvider();
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's own playlists instead of featured playlists (which might need special permissions)
  useEffect(() => {
    const getUserPlaylists = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists?limit=6",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        setFeaturedPlaylists(response.data.items);
        
        // Also dispatch to global state for sidebar
        dispatch({ type: reducerCases.SET_PLAYLISTS, payload: response.data.items });
      } catch (error) {
        console.error("Error fetching playlists:", error);
        // Try a fallback - get a specific popular playlist
        try {
          const fallbackResponse = await axios.get(
            "https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M", // Today's Top Hits
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            }
          );
          setFeaturedPlaylists([fallbackResponse.data]);
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
          setFeaturedPlaylists([]);
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch playlists if no specific playlist is selected
    if (!selectedPlaylistId) {
      getUserPlaylists();
    }
  }, [token, selectedPlaylistId, dispatch]);

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
          tracks: response.data.tracks.items.map(({ track }) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist) => artist.name),
            image: track.album.images?.[2]?.url || track.album.images?.[0]?.url || "",
            duration: track.duration_ms,
            album: track.album.name,
            context_uri: track.album.uri,
            track_number: track.track_number,
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
      {selectedPlaylist ? (
        // Show selected playlist
        <>
          <div className="playlist">
            <div className="image">
              <img src={selectedPlaylist.image} alt="selected playlist" />
            </div>
            <div className="details">
              <span className="type">PLAYLIST</span>
              <h1 className="title">{selectedPlaylist.name}</h1>
              <p className="description">{selectedPlaylist.description}</p>
            </div>
          </div>
          <div className="list">
            <div className="header-row">
              <div className="col"><span>#</span></div>
              <div className="col"><span>TITLE</span></div>
              <div className="col"><span>ALBUM</span></div>
              <div className="col"><span><AiFillClockCircle /></span></div>
            </div>
            <div className="tracks">
              {selectedPlaylist.tracks.map((
                { id, name, artists, image, duration, album, context_uri, track_number },
                index
              ) => (
                <div
                  className="row"
                  key={id}
                  onClick={() => playTrack(id, name, artists, image, context_uri, track_number)}
                >
                  <div className="col"><span>{index + 1}</span></div>
                  <div className="col detail">
                    <div className="image">
                      <img src={image} alt="track" />
                    </div>
                    <div className="info">
                      <span className="name">{name}</span>
                      <span>{Array.isArray(artists) ? artists.join(", ") : artists}</span>
                    </div>
                  </div>
                  <div className="col"><span>{album}</span></div>
                  <div className="col"><span>{msToMinutesAndSeconds(duration)}</span></div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Show home view with featured playlists
        <div className="home-content">
          <div className="greeting">
            <h1>{getGreeting()}</h1>
          </div>
          
          {featuredPlaylists.length > 0 && (
            <div className="featured-section">
              <h2>Your Playlists</h2>
              <div className="playlists-grid">
                {featuredPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="playlist-card"
                    onClick={() => selectPlaylist(playlist.id)}
                  >
                    <div className="playlist-image">
                      <img src={playlist.images?.[0]?.url} alt={playlist.name} />
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

  .playlist {
    margin: 0 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    .image {
      img {
        height: 15rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
      }
    }
    .details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: #e0dede;
      .title {
        color: white;
        font-size: 4rem;
      }
    }
  }
  
  .list {
    .header-row {
      display: grid;
      grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
      margin: 1rem 0 0 0;
      color: #dddcdc;
      position: sticky;
      top: 15vh;
      padding: 1rem 3rem;
      transition: 0.3s ease-in-out;
      background-color: ${({ $headerBackground }) =>
        $headerBackground ? "#000000dc" : "none"};
    }
    .tracks {
      margin: 0 2rem;
      display: flex;
      flex-direction: column;
      margin-bottom: 5rem;
      .row {
        padding: 0.5rem 1rem;
        display: grid;
        grid-template-columns: 0.3fr 3.1fr 2fr 0.1fr;
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
        .col {
          display: flex;
          align-items: center;
          color: #dddcdc;
          img {
            height: 40px;
            width: 40px;
          }
        }
        .detail {
          display: flex;
          gap: 1rem;
          .info {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  }
`;