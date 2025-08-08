import axios from "axios";
import React, { useEffect } from "react";
import styled from "styled-components";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";

export default function Playlists() {
  const [{ token, playlists }, dispatch] = useStateProvider();
  
  useEffect(() => {
    const getPlaylistData = async () => {
      if (!token) return; // Safety check
      
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        
        console.log("Spotify response data: ", response.data);
        console.log("Token in playlists component:", token);

        const { items } = response.data;
        const playlists = items.map(({ name, id }) => {
          return { name, id };
        });
        
        // Fixed: Use payload instead of playlists
        dispatch({ type: reducerCases.SET_PLAYLISTS, payload: playlists });
        console.log("Dispatched playlists:", playlists);

      } catch (error) {
        console.error("Error fetching playlists:", error);
        // Set empty array on error to prevent undefined
        dispatch({ type: reducerCases.SET_PLAYLISTS, payload: [] });
      }
    };
    
    getPlaylistData();
  }, [token, dispatch]);

  const changeCurrentPlaylist = (selectedPlaylistId) => {
    // Fixed: Use payload instead of selectedPlaylistId
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, payload: selectedPlaylistId });
  };

  return (
    <Container>
      <ul>
        {playlists && playlists.length > 0 ? (
          playlists.map(({ name, id }) => {
            return (
              <li key={id} onClick={() => changeCurrentPlaylist(id)}>
                {name}
              </li>
            );
          })
        ) : (
          <li>No playlists found</li>
        )}
      </ul>
    </Container>
  );
}

const Container = styled.div`
  color: #b3b3b3;
  height: 100%;
  overflow: hidden;
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: 55vh;
    max-height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.7rem;
      &-thumb {
        background-color: rgba(255, 255, 255, 0.6);
      }
    }
    li {
      transition: 0.3s ease-in-out;
      cursor: pointer;
      &:hover {
        color: white;
      }
    }
  }
`;