import React, { useEffect } from "react";
import styled from "styled-components";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";

export default function PlayerControls() {
  const [{ token, playerState, shuffleState, repeatState }, dispatch] = useStateProvider();

  // Sync with Spotify's actual state on component mount and periodically
  useEffect(() => {
    if (token) {
      syncPlayerState();
      // Sync every 30 seconds to keep states in sync
      const interval = setInterval(syncPlayerState, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const syncPlayerState = async () => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.data) {
        // Update all player states to match Spotify's actual state
        dispatch({
          type: reducerCases.SET_PLAYER_STATE,
          payload: response.data.is_playing,
        });
        
        dispatch({
          type: reducerCases.SET_SHUFFLE_STATE,
          payload: response.data.shuffle_state,
        });
        
        dispatch({
          type: reducerCases.SET_REPEAT_STATE,
          payload: response.data.repeat_state,
        });

        // Update currently playing track info
        if (response.data.item) {
          const images = response.data.item.album.images;
          const imageUrl = images.length > 2 ? images[2].url : images[0]?.url || "";

          const currentPlaying = {
            id: response.data.item.id,
            name: response.data.item.name,
            artists: response.data.item.artists.map((artist) => artist.name),
            image: imageUrl,
          };
          
          dispatch({ 
            type: reducerCases.SET_PLAYING, 
            payload: currentPlaying
          });
        }
      }
    } catch (error) {
      console.error("Failed to sync player state:", error);
    }
  };

  const changeState = async () => {
    try {
      const state = playerState ? "pause" : "play";
      await axios.put(
        `https://api.spotify.com/v1/me/player/${state}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      
      // Wait a bit then sync to get actual state
      setTimeout(syncPlayerState, 300);
      
    } catch (error) {
      console.error("Failed to change playback state:", error);
      if (error.response?.status === 404) {
        alert("No active device found. Please start playing music on Spotify first.");
      } else if (error.response?.status === 403) {
        alert("Spotify Premium is required for playback control.");
      }
    }
  };

  const changeTrack = async (type) => {
    try {
      await axios.post(
        `https://api.spotify.com/v1/me/player/${type}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      // Wait for Spotify to process the change, then sync all states
      setTimeout(syncPlayerState, 800);

    } catch (error) {
      console.error(`Failed to ${type} track:`, error);
      if (error.response?.status === 404) {
        alert("No active device found. Please start playing music on Spotify first.");
      } else if (error.response?.status === 403) {
        alert("Spotify Premium is required for track control.");
      }
    }
  };

  const toggleShuffle = async () => {
    try {
      const newShuffleState = !shuffleState;
      await axios.put(
        `https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleState}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      
      // Wait for Spotify to process the change, then sync to get actual state
      setTimeout(syncPlayerState, 500);
      
    } catch (error) {
      console.error("Failed to toggle shuffle:", error);
      if (error.response?.status === 404) {
        alert("No active device found. Please start playing music on Spotify first.");
      } else if (error.response?.status === 403) {
        alert("Spotify Premium is required for shuffle control.");
      }
    }
  };

  const toggleRepeat = async () => {
    try {
      // Cycle through repeat modes: off -> context -> track -> off
      let newRepeatState;
      switch (repeatState) {
        case "off":
          newRepeatState = "context";
          break;
        case "context":
          newRepeatState = "track";
          break;
        case "track":
        default:
          newRepeatState = "off";
          break;
      }

      await axios.put(
        `https://api.spotify.com/v1/me/player/repeat?state=${newRepeatState}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      
      // Wait for Spotify to process the change, then sync to get actual state
      setTimeout(syncPlayerState, 500);
      
    } catch (error) {
      console.error("Failed to toggle repeat:", error);
      if (error.response?.status === 404) {
        alert("No active device found. Please start playing music on Spotify first.");
      } else if (error.response?.status === 403) {
        alert("Spotify Premium is required for repeat control.");
      }
    }
  };

  return (
    <Container>
      <div className={`shuffle ${shuffleState ? 'active' : ''}`}>
        <BsShuffle onClick={toggleShuffle} />
      </div>
      <div className="previous">
        <CgPlayTrackPrev onClick={() => changeTrack("previous")} />
      </div>
      <div className="state">
        {playerState ? (
          <BsFillPauseCircleFill onClick={changeState} />
        ) : (
          <BsFillPlayCircleFill onClick={changeState} />
        )}
      </div>
      <div className="next">
        <CgPlayTrackNext onClick={() => changeTrack("next")} />
      </div>
      <div className={`repeat ${repeatState !== 'off' ? 'active' : ''}`}>
        <FiRepeat onClick={toggleRepeat} />
        {repeatState === 'track' && <span className="repeat-indicator">1</span>}
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  svg {
    color: #b3b3b3;
    transition: 0.2s ease-in-out;
    cursor: pointer;
    &:hover {
      color: white;
    }
  }
  .state {
    svg {
      color: white;
    }
  }
  .previous,
  .next,
  .state {
    font-size: 2rem;
  }
  
  .shuffle,
  .repeat {
    position: relative;
    
    &.active {
      svg {
        color: #1db954;
      }
    }
  }
  
  .repeat {
    .repeat-indicator {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #1db954;
      color: black;
      font-size: 0.6rem;
      font-weight: bold;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;