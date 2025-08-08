import React, { useState } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { reducerCases } from "../utils/Constants";
import axios from "axios";

export default function Navbar({ navBackground }) {
  const [{ userInfo, token }, dispatch] = useStateProvider();
  const [searchInput, setSearchInput] = useState("");

  // Safety check and data validation
  const safeUserInfo = userInfo && typeof userInfo === 'object' && !userInfo.$typeof ? userInfo : null;
  const userName = safeUserInfo?.name && typeof safeUserInfo.name === 'string' ? safeUserInfo.name : "User";
  const userUrl = safeUserInfo?.userUrl && typeof safeUserInfo.userUrl === 'string' ? safeUserInfo.userUrl : null;

  const handleSearch = async (query) => {
    if (!query.trim()) {
      dispatch({ type: reducerCases.CLEAR_SEARCH });
      return;
    }

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist&limit=20`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      const searchResults = {
        tracks: response.data.tracks?.items || [],
        artists: response.data.artists?.items || [],
        albums: response.data.albums?.items || [],
        playlists: response.data.playlists?.items || [],
      };

      dispatch({ type: reducerCases.SET_SEARCH_RESULTS, payload: searchResults });
      dispatch({ type: reducerCases.SET_SEARCH_QUERY, payload: query });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Debounce search - search after user stops typing for 300ms
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      clearTimeout(window.searchTimeout);
      handleSearch(searchInput);
    }
  };

  return (
    <Container $navBackground={navBackground}>
      <div className="search__bar">
        <FaSearch />
        <input 
          type="text" 
          placeholder="Artists, songs, or podcasts" 
          value={searchInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="avatar">
        {userUrl ? (
          <a href={userUrl} target="_blank" rel="noopener noreferrer">
            <CgProfile />
            <span>{userName}</span>
          </a>
        ) : (
          <div>
            <CgProfile />
            <span>{userName}</span>
          </div>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  height: 15vh;
  position: sticky;
  top: 0;
  transition: 0.3s ease-in-out;
  background-color: ${({ $navBackground }) =>
    $navBackground ? "rgba(0,0,0,0.7)" : "none"};
  .search__bar {
    background-color: white;
    width: 30%;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    input {
      border: none;
      height: 2rem;
      width: 100%;
      &:focus {
        outline: none;
      }
    }
  }
  .avatar {
    background-color: black;
    padding: 0.3rem 0.4rem;
    padding-right: 1rem;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    a,
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: white;
      font-weight: bold;
      svg {
        font-size: 1.3rem;
        background-color: #282828;
        padding: 0.2rem;
        border-radius: 1rem;
        color: #c7c5c5;
      }
    }
  }
`;