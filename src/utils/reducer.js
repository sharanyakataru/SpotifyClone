import { reducerCases } from "./Constants";

export const initialState = {
  token: null,
  userInfo: null,
  playlists: [],
  currentPlaying: null,
  playerState: false,
  selectedPlaylist: null,
  selectedPlaylistId: null, // Changed from hardcoded ID to null for home view
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_TOKEN:
      return {
        ...state,
        token: action.payload, 
      };
    case reducerCases.SET_USER:
      return {
        ...state,
        userInfo: action.payload, 
      };
    case reducerCases.SET_PLAYLISTS:
      return {
        ...state,
        playlists: action.payload,
      };
    case reducerCases.SET_PLAYING:
      return {
        ...state,
        currentPlaying: action.payload, 
      };
    case reducerCases.SET_PLAYER_STATE:
      return {
        ...state,
        playerState: action.payload, 
      };
    case reducerCases.SET_PLAYLIST:
      return {
        ...state,
        selectedPlaylist: action.payload, 
      };
    case reducerCases.SET_PLAYLIST_ID:
      return {
        ...state,
        selectedPlaylistId: action.payload, 
        selectedPlaylist: null, // Clear previous playlist when selecting new ID
      };
    default:
      return state;
  }
};

export default reducer;