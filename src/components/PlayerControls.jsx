import React from "react";
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
  const [{ token, playerState }, dispatch] = useStateProvider();

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
      
      // FIXED: Use 'payload' instead of 'playerState'
      dispatch({
        type: reducerCases.SET_PLAYER_STATE,
        payload: !playerState,  // Changed from playerState: !playerState
      });
    } catch (error) {
      console.error("Failed to change playback state:", error);
      // Optionally, don't update state if API call fails
      // This prevents UI state from getting out of sync with actual playback
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

      // FIXED: Use 'payload' instead of 'playerState'
      dispatch({ 
        type: reducerCases.SET_PLAYER_STATE, 
        payload: true  // Changed from playerState: true
      });

      const response1 = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response1.data && response1.data.item) {
        const images = response1.data.item.album.images;
        const imageUrl =
          images.length > 2 ? images[2].url : images[0]?.url || "";

        const currentPlaying = {
          id: response1.data.item.id,
          name: response1.data.item.name,
          artists: response1.data.item.artists.map((artist) => artist.name),
          image: imageUrl,
        };
        
        // FIXED: Use 'payload' instead of 'currentPlaying'
        dispatch({ 
          type: reducerCases.SET_PLAYING, 
          payload: currentPlaying  // Changed from currentPlaying
        });
      } else {
        // FIXED: Use 'payload' instead of 'currentPlaying'
        dispatch({ 
          type: reducerCases.SET_PLAYING, 
          payload: null  // Changed from currentPlaying: null
        });
      }
    } catch (error) {
      console.error("Failed to change track or fetch current playing:", error);
    }
  };

  return (
    <Container>
      <div className="shuffle">
        <BsShuffle />
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
      <div className="repeat">
        <FiRepeat />
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
`;