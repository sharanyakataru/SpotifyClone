import React from "react";
import styled from "styled-components";
import { MdHomeFilled, MdSearch } from "react-icons/md";
import { IoLibrary } from "react-icons/io5";
import Playlists from "./Playlists";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function Sidebar() {
  const [{ }, dispatch] = useStateProvider();

  const handleHomeClick = () => {
    // Clear selected playlist and search to go back to home view
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, payload: null });
    dispatch({ type: reducerCases.CLEAR_SEARCH });
  };

  const handleSearchClick = () => {
    // You can implement search functionality here
    // For now, let's just clear playlist selection
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, payload: null });
    // You might want to focus a search input or open a search modal
    console.log("Search clicked - implement search functionality");
  };

  const handleLibraryClick = () => {
    // Go to library view (similar to home but maybe with different layout)
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, payload: null });
    dispatch({ type: reducerCases.CLEAR_SEARCH });
    console.log("Library clicked - showing user's library");
  };

  return (
    <Container>
      <div className="top__links">
        <div className="logo">
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
            alt="spotify"
          />
        </div>
        <ul>
          <li onClick={handleHomeClick}>
            <MdHomeFilled />
            <span>Home</span>
          </li>
          <li onClick={handleSearchClick}>
            <MdSearch />
            <span>Search</span>
          </li>
          <li onClick={handleLibraryClick}>
            <IoLibrary />
            <span>Your Library</span>
          </li>
        </ul>
      </div>
      <Playlists />
    </Container>
  );
}

const Container = styled.div`
  background-color: black;
  color: #b3b3b3;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .top__links {
    display: flex;
    flex-direction: column;
    .logo {
      text-align: center;
      margin: 1rem 0;
      img {
        max-inline-size: 80%;
        block-size: auto;
      }
    }
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      li {
        display: flex;
        gap: 1rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: white;
        }
      }
    }
  }
`;