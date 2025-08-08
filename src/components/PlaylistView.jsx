import React from "react";
import styled from "styled-components";
import { AiFillClockCircle } from "react-icons/ai";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";

export default function PlaylistView({ 
  selectedPlaylist, 
  playTrack, 
  msToMinutesAndSeconds,
  currentPlaying,
  playerState 
}) {
  if (!selectedPlaylist) return null;

  const isTrackPlaying = (trackId) => {
    return currentPlaying?.id === trackId && playerState;
  };

  return (
    <Container>
      <div className="playlist-header">
        <div className="playlist-image">
          <img 
            src={selectedPlaylist.image || "/placeholder-playlist.png"} 
            alt="selected playlist" 
          />
        </div>
        <div className="playlist-details">
          <span className="type">PLAYLIST</span>
          <h1 className="title">{selectedPlaylist.name}</h1>
          {selectedPlaylist.description && (
            <p className="description">{selectedPlaylist.description}</p>
          )}
          <div className="playlist-meta">
            <span className="track-count">
              {selectedPlaylist.tracks?.length || 0} songs
            </span>
          </div>
        </div>
      </div>
      
      <div className="playlist-controls">
        <div className="play-button-large">
          <BsPlayFill />
        </div>
        <div className="other-controls">
          <AiOutlineHeart className="heart-icon" />
        </div>
      </div>
      
      <div className="tracks-list">
        <div className="tracks-header">
          <div className="col number">#</div>
          <div className="col title">Title</div>
          <div className="col album">Album</div>
          <div className="col duration">
            <AiFillClockCircle />
          </div>
        </div>
        
        <div className="tracks">
          {selectedPlaylist.tracks?.map((track, index) => {
            const {
              id,
              name,
              artists,
              image,
              duration,
              album,
              context_uri,
              track_number,
            } = track;
            
            return (
              <div
                className={`track-row ${isTrackPlaying(id) ? 'playing' : ''}`}
                key={id}
                onClick={() =>
                  playTrack(
                    id,
                    name,
                    artists,
                    image || "/placeholder-track.png",
                    context_uri,
                    track_number
                  )
                }
              >
                <div className="col number">
                  {isTrackPlaying(id) ? (
                    <div className="playing-animation">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <span className="track-number">{index + 1}</span>
                  )}
                  <div className="play-hover">
                    <BsPlayFill />
                  </div>
                </div>
                
                <div className="col title">
                  <div className="track-image">
                    <img src={image || "/placeholder-track.png"} alt="track" />
                  </div>
                  <div className="track-info">
                    <span className="track-name">{name}</span>
                    <div className="track-artists">
                      {Array.isArray(artists) 
                        ? artists.join(", ") 
                        : artists
                      }
                    </div>
                  </div>
                </div>
                
                <div className="col album">
                  <span>{album}</span>
                </div>
                
                <div className="col duration">
                  <AiOutlineHeart className="heart-icon" />
                  <span className="duration-text">
                    {msToMinutesAndSeconds(duration)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .playlist-header {
    display: flex;
    align-items: end;
    gap: 2rem;
    margin: 0 2rem 2rem;
    padding-bottom: 2rem;
    
    .playlist-image {
      img {
        width: 232px;
        height: 232px;
        object-fit: cover;
        border-radius: 4px;
        box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
      }
    }
    
    .playlist-details {
      flex: 1;
      
      .type {
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
        color: white;
        margin-bottom: 0.5rem;
        display: block;
      }
      
      .title {
        font-size: clamp(2rem, 8vw, 6rem);
        font-weight: 900;
        color: white;
        margin: 0;
        line-height: 1.2;
        letter-spacing: -0.04em;
      }
      
      .description {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.875rem;
        margin: 0.5rem 0 1rem 0;
        line-height: 1.4;
      }
      
      .playlist-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.7);
        
        .track-count {
          font-weight: 500;
        }
      }
    }
  }
  
  .playlist-controls {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin: 0 2rem 2rem;
    
    .play-button-large {
      width: 56px;
      height: 56px;
      background: #1db954;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: #1ed760;
        transform: scale(1.04);
      }
      
      svg {
        font-size: 1.5rem;
        color: black;
        margin-left: 2px;
      }
    }
    
    .other-controls {
      display: flex;
      align-items: center;
      gap: 2rem;
      
      .heart-icon {
        font-size: 2rem;
        color: #b3b3b3;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          color: white;
          transform: scale(1.04);
        }
      }
    }
  }
  
  .tracks-list {
    margin: 0 2rem;
    
    .tracks-header {
      display: grid;
      grid-template-columns: 60px 1fr 1fr 60px;
      gap: 1rem;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 1rem;
      position: sticky;
      top: 64px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 10;
      
      .col {
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
        color: #b3b3b3;
        display: flex;
        align-items: center;
        
        &.number {
          justify-content: center;
        }
        
        &.duration {
          justify-content: center;
        }
      }
    }
    
    .tracks {
      .track-row {
        display: grid;
        grid-template-columns: 60px 1fr 1fr 60px;
        gap: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        position: relative;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          
          .track-number {
            opacity: 0;
          }
          
          .play-hover {
            opacity: 1;
          }
          
          .heart-icon {
            opacity: 1;
          }
        }
        
        &.playing {
          .track-name {
            color: #1db954;
          }
          
          .track-number {
            display: none;
          }
          
          .playing-animation {
            display: flex;
          }
        }
        
        .col {
          display: flex;
          align-items: center;
          color: white;
          
          &.number {
            justify-content: center;
            position: relative;
            
            .track-number {
              font-size: 1rem;
              color: #b3b3b3;
              transition: opacity 0.2s ease;
            }
            
            .play-hover {
              position: absolute;
              opacity: 0;
              transition: opacity 0.2s ease;
              
              svg {
                font-size: 1rem;
                color: white;
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
          
          &.title {
            display: flex;
            align-items: center;
            
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
            
            .track-info {
              min-width: 0;
              
              .track-name {
                font-size: 1rem;
                font-weight: 500;
                color: white;
                margin-bottom: 0.25rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                transition: color 0.2s ease;
                display: block;
              }
              
              .track-artists {
                font-size: 0.875rem;
                color: #b3b3b3;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          
          &.album {
            span {
              font-size: 0.875rem;
              color: #b3b3b3;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          
          &.duration {
            justify-content: end;
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
            
            .duration-text {
              font-size: 0.875rem;
              color: #b3b3b3;
              min-width: 40px;
              text-align: right;
            }
          }
        }
      }
    }
  }
  
  @keyframes bounce {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.3); }
  }
`;