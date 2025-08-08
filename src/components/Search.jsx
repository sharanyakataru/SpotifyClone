import React from "react";
import styled from "styled-components";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";

export default function SearchResults({ 
  searchResults, 
  searchQuery, 
  playTrack, 
  selectPlaylist, 
  msToMinutesAndSeconds,
  currentPlaying,
  playerState 
}) {
  if (!searchResults) return null;

  const isTrackPlaying = (trackId) => {
    return currentPlaying?.id === trackId && playerState;
  };

  return (
    <Container>
      <div className="search-header">
        <h1>Search results for "{searchQuery}"</h1>
      </div>

      {/* Top Result Section */}
      {(searchResults.tracks?.length > 0 || searchResults.artists?.length > 0) && (
        <div className="top-result-section">
          <h2>Top result</h2>
          <div className="top-result-grid">
            {/* Best Match - could be artist or track */}
            {searchResults.artists?.length > 0 && (
              <div className="top-result-card artist-card">
                <div className="top-result-image">
                  <img 
                    src={searchResults.artists[0].images?.[0]?.url || '/placeholder-artist.png'} 
                    alt={searchResults.artists[0].name} 
                  />
                </div>
                <div className="top-result-info">
                  <h3>{searchResults.artists[0].name}</h3>
                  <div className="type-badge">
                    <span>Artist</span>
                  </div>
                </div>
                <div className="play-button">
                  <BsPlayFill />
                </div>
              </div>
            )}
            
            {/* Songs section in top result */}
            {searchResults.tracks?.length > 0 && (
              <div className="top-songs">
                <h3>Songs</h3>
                <div className="top-tracks-list">
                  {searchResults.tracks
                    .filter(track => track && track.id)
                    .slice(0, 4)
                    .map((track, index) => (
                      <div
                        className={`track-row ${isTrackPlaying(track.id) ? 'playing' : ''}`}
                        key={track.id}
                        onClick={() => playTrack(
                          track.id,
                          track.name,
                          track.artists?.map(artist => artist.name) || [],
                          track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || "",
                          track.album?.uri || "",
                          track.track_number || 1
                        )}
                      >
                        <div className="track-number">
                          {isTrackPlaying(track.id) ? (
                            <div className="playing-animation">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          ) : (
                            <span className="number">{index + 1}</span>
                          )}
                          <div className="play-hover">
                            <BsPlayFill />
                          </div>
                        </div>
                        <div className="track-info">
                          <div className="track-image">
                            <img 
                              src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || "/placeholder.png"} 
                              alt="track" 
                            />
                          </div>
                          <div className="track-details">
                            <span className="track-name">{track.name}</span>
                            <div className="track-artists">
                              {track.artists?.map((artist, i) => (
                                <span key={artist.id || i}>
                                  {artist.name}
                                  {i < track.artists.length - 1 && ", "}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="track-actions">
                          <AiOutlineHeart className="heart-icon" />
                          <span className="duration">
                            {msToMinutesAndSeconds(track.duration_ms || 0)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Artists Section */}
      {searchResults.artists && searchResults.artists.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2>Artists</h2>
            <button className="show-all">Show all</button>
          </div>
          <div className="artists-grid">
            {searchResults.artists
              .filter(artist => artist && artist.id)
              .slice(0, 6)
              .map((artist) => (
                <div key={artist.id} className="artist-card">
                  <div className="card-image">
                    <img 
                      src={artist.images?.[0]?.url || '/placeholder-artist.png'} 
                      alt={artist.name} 
                    />
                    <div className="play-button">
                      <BsPlayFill />
                    </div>
                  </div>
                  <div className="card-info">
                    <h3>{artist.name}</h3>
                    <p>Artist</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Playlists Section */}
      {searchResults.playlists && searchResults.playlists.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2>Playlists</h2>
            <button className="show-all">Show all</button>
          </div>
          <div className="playlists-grid">
            {searchResults.playlists
              .filter(playlist => playlist && playlist.id)
              .slice(0, 6)
              .map((playlist) => (
                <div
                  key={playlist.id}
                  className="playlist-card"
                  onClick={() => selectPlaylist(playlist.id)}
                >
                  <div className="card-image">
                    <img 
                      src={playlist.images?.[0]?.url || "/placeholder-playlist.png"} 
                      alt={playlist.name} 
                    />
                    <div className="play-button">
                      <BsPlayFill />
                    </div>
                  </div>
                  <div className="card-info">
                    <h3>{playlist.name}</h3>
                    <p>By {playlist.owner?.display_name || "Spotify"} • {playlist.tracks?.total || 0} songs</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Albums Section - if you have album results */}
      {searchResults.albums && searchResults.albums.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2>Albums</h2>
            <button className="show-all">Show all</button>
          </div>
          <div className="albums-grid">
            {searchResults.albums
              .filter(album => album && album.id)
              .slice(0, 6)
              .map((album) => (
                <div key={album.id} className="album-card">
                  <div className="card-image">
                    <img 
                      src={album.images?.[0]?.url || "/placeholder-album.png"} 
                      alt={album.name} 
                    />
                    <div className="play-button">
                      <BsPlayFill />
                    </div>
                  </div>
                  <div className="card-info">
                    <h3>{album.name}</h3>
                    <p>{album.release_date?.split('-')[0]} • {album.artists?.map(artist => artist.name).join(", ")}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 2rem;
  color: white;
  
  .search-header {
    margin-bottom: 2rem;
    
    h1 {
      font-size: 2rem;
      font-weight: bold;
      margin: 0;
    }
  }
  
  .top-result-section {
    margin-bottom: 3rem;
    
    > h2 {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      color: white;
    }
    
    .top-result-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      height: 280px;
      
      .top-result-card {
        background: linear-gradient(135deg, #3E3E3E 0%, #2A2A2A 100%);
        border-radius: 8px;
        padding: 2rem;
        position: relative;
        cursor: pointer;
        transition: background 0.3s ease;
        
        &:hover {
          background: linear-gradient(135deg, #4A4A4A 0%, #353535 100%);
          
          .play-button {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .top-result-image {
          width: 120px;
          height: 120px;
          margin-bottom: 1rem;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: ${props => props.isArtist ? '50%' : '4px'};
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          }
        }
        
        &.artist-card .top-result-image img {
          border-radius: 50%;
        }
        
        .top-result-info {
          h3 {
            font-size: 2rem;
            font-weight: bold;
            margin: 0 0 0.5rem 0;
            color: white;
          }
          
          .type-badge {
            span {
              background: rgba(255,255,255,0.1);
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.75rem;
              font-weight: bold;
              text-transform: uppercase;
            }
          }
        }
        
        .play-button {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          width: 48px;
          height: 48px;
          background: #1db954;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.3s ease;
          box-shadow: 0 8px 8px rgba(0,0,0,0.3);
          
          &:hover {
            transform: scale(1.05) translateY(0);
            background: #1ed760;
          }
          
          svg {
            font-size: 1.2rem;
            color: black;
            margin-left: 2px;
          }
        }
      }
      
      .top-songs {
        display: flex;
        flex-direction: column;
        
        h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: white;
        }
        
        .top-tracks-list {
          flex: 1;
          
          .track-row {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            position: relative;
            
            &:hover {
              background-color: rgba(255,255,255,0.1);
              
              .track-number .number {
                opacity: 0;
              }
              
              .play-hover {
                opacity: 1;
              }
            }
            
            &.playing {
              color: #1db954;
              
              .track-name {
                color: #1db954;
              }
            }
            
            .track-number {
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              margin-right: 1rem;
              
              .number {
                font-size: 0.9rem;
                color: #b3b3b3;
                transition: opacity 0.2s ease;
              }
              
              .play-hover {
                position: absolute;
                opacity: 0;
                transition: opacity 0.2s ease;
                
                svg {
                  font-size: 1rem;
                }
              }
              
              .playing-animation {
                display: flex;
                align-items: end;
                gap: 2px;
                height: 14px;
                
                span {
                  width: 2px;
                  background: #1db954;
                  border-radius: 1px;
                  animation: bounce 1.5s infinite;
                  
                  &:nth-child(1) {
                    height: 100%;
                    animation-delay: 0s;
                  }
                  
                  &:nth-child(2) {
                    height: 50%;
                    animation-delay: 0.1s;
                  }
                  
                  &:nth-child(3) {
                    height: 75%;
                    animation-delay: 0.2s;
                  }
                }
              }
            }
            
            .track-info {
              display: flex;
              align-items: center;
              flex: 1;
              min-width: 0;
              
              .track-image {
                width: 40px;
                height: 40px;
                margin-right: 1rem;
                
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  border-radius: 4px;
                }
              }
              
              .track-details {
                min-width: 0;
                
                .track-name {
                  display: block;
                  font-size: 1rem;
                  font-weight: 500;
                  color: white;
                  margin-bottom: 0.25rem;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                
                .track-artists {
                  font-size: 0.875rem;
                  color: #b3b3b3;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  
                  span:hover {
                    color: white;
                    text-decoration: underline;
                  }
                }
              }
            }
            
            .track-actions {
              display: flex;
              align-items: center;
              gap: 1rem;
              
              .heart-icon {
                font-size: 1rem;
                color: #b3b3b3;
                cursor: pointer;
                opacity: 0;
                transition: all 0.2s ease;
                
                &:hover {
                  color: white;
                  transform: scale(1.1);
                }
              }
              
              .duration {
                font-size: 0.875rem;
                color: #b3b3b3;
                min-width: 40px;
                text-align: right;
              }
            }
            
            &:hover .track-actions .heart-icon {
              opacity: 1;
            }
          }
        }
      }
    }
  }
  
  .section {
    margin-bottom: 3rem;
    
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      
      h2 {
        font-size: 1.5rem;
        font-weight: bold;
        color: white;
        margin: 0;
      }
      
      .show-all {
        background: none;
        border: none;
        color: #b3b3b3;
        font-size: 0.875rem;
        font-weight: bold;
        cursor: pointer;
        transition: color 0.2s ease;
        
        &:hover {
          color: white;
          text-decoration: underline;
        }
      }
    }
    
    .artists-grid,
    .playlists-grid,
    .albums-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem;
      
      .artist-card,
      .playlist-card,
      .album-card {
        background: #181818;
        border-radius: 8px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        
        &:hover {
          background: #282828;
          
          .play-button {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .card-image {
          position: relative;
          margin-bottom: 1rem;
          
          img {
            width: 100%;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          }
          
          .play-button {
            position: absolute;
            bottom: 8px;
            right: 8px;
            width: 48px;
            height: 48px;
            background: #1db954;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: translateY(8px);
            transition: all 0.3s ease;
            box-shadow: 0 8px 8px rgba(0,0,0,0.3);
            
            &:hover {
              transform: scale(1.05) translateY(0);
              background: #1ed760;
            }
            
            svg {
              font-size: 1.2rem;
              color: black;
              margin-left: 2px;
            }
          }
        }
        
        .card-info {
          h3 {
            font-size: 1rem;
            font-weight: bold;
            color: white;
            margin: 0 0 0.25rem 0;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          
          p {
            font-size: 0.875rem;
            color: #b3b3b3;
            margin: 0;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.3;
          }
        }
      }
      
      .artist-card .card-image img {
        border-radius: 50%;
      }
    }
  }
  
  @keyframes bounce {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.3); }
  }
`;