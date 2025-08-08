// src/utils/clonePlaylist.js
import axios from "axios";

export async function clonePlaylist(token, selectedPlaylist, dispatch, reducerCases) {
  if (!token || !selectedPlaylist) return;

  try {
    // 1. Get current user's ID
    const userRes = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + token },
    });
    const userId = userRes.data.id;

    // 2. Create new playlist for user
    const newPlaylistRes = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: selectedPlaylist.name + " copy",
        description: selectedPlaylist.description || "",
        public: false,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );

    const newPlaylistId = newPlaylistRes.data.id;

    // 3. Add tracks to the new playlist (Spotify API limits 100 per request)
    const trackUris = selectedPlaylist.tracks.map(
      (track) => `spotify:track:${track.id}`
    );

    for (let i = 0; i < trackUris.length; i += 100) {
      const chunk = trackUris.slice(i, i + 100);

      await axios.post(
        `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
        { uris: chunk },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Optionally update global state to select the new playlist
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, payload: newPlaylistId });

    return { success: true, newPlaylistId };
  } catch (error) {
    console.error("Error cloning playlist:", error);
    return { success: false, error };
  }
}


export async function addTracksToPlaylist(token, playlistId, trackUris) {
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: trackUris },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // snapshot_id
  } catch (error) {
    console.error("Error adding tracks:", error.response?.data || error.message);
    throw error;
  }
}

export async function removeTracksFromPlaylist(token, playlistId, trackUris) {
  try {
    const response = await axios({
      method: "delete",
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        tracks: trackUris.map(uri => ({ uri })),
      },
    });
    return response.data; // snapshot_id
  } catch (error) {
    console.error("Error removing tracks:", error.response?.data || error.message);
    throw error;
  }
}