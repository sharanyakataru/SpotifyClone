import { reducerCases } from "./Constants";

export const initialState = {
  token: null,
  userInfo: null,
  playlists: [],
  currentPlaying: null,
  playerState: false,
  selectedPlaylist: null,
  selectedPlaylistId: null, // Changed from hardcoded ID to null for home view
  searchResults: null,
  searchQuery: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_TOKEN:
      return {
        ...state,
        token: action.payload, // Changed from action.token
      };
    case reducerCases.SET_USER:
      return {
        ...state,
        userInfo: action.payload, // Changed from action.userInfo
      };
    case reducerCases.SET_PLAYLISTS:
      return {
        ...state,
        playlists: action.payload, // Changed from action.playlists
      };
    case reducerCases.SET_PLAYING:
      return {
        ...state,
        currentPlaying: action.payload, // Changed from action.currentPlaying
      };
    case reducerCases.SET_PLAYER_STATE:
      return {
        ...state,
        playerState: action.payload, // Changed from action.playerState
      };
    case reducerCases.SET_PLAYLIST:
      return {
        ...state,
        selectedPlaylist: action.payload, // Changed from action.selectedPlaylist
      };
    case reducerCases.SET_PLAYLIST_ID:
      return {
        ...state,
        selectedPlaylistId: action.payload, // Changed from action.selectedPlaylistId
        selectedPlaylist: null, // Clear previous playlist when selecting new ID
        searchResults: null, // Clear search when selecting playlist
        searchQuery: "", // Clear search query
      };
    case reducerCases.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
        selectedPlaylist: null, // Clear playlist when searching
        selectedPlaylistId: null, // Clear playlist ID when searching
      };
    case reducerCases.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };
    case reducerCases.CLEAR_SEARCH:
      return {
        ...state,
        searchResults: null,
        searchQuery: "",
      };
    default:
      return state;
  }
};

export default reducer;