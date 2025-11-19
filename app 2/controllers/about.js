'use strict';

import logger from "../utils/logger.js";
import playlistStore from "../models/playlist-store.js";
import accounts from './accounts.js';

const about = {
  createView(request, response) {
    logger.info("About page loading...");
    const loggedInUser = accounts.getCurrentUser(request);

    if (!loggedInUser) {
      return response.redirect('/');
    }

    // ✅ Use only this user's playlists
    const playlists = playlistStore.getUserPlaylists(loggedInUser.id);

    const numPlaylists = playlists.length;
    const numSongs = playlists.reduce((sum, playlist) => sum + playlist.songs.length, 0);
    const averageSongs = numPlaylists > 0 ? (numSongs / numPlaylists).toFixed(2) : 0;

    // Sort playlists by song count to find largest/smallest
    const sortedPlaylists = [...playlists].sort((a, b) => b.songs.length - a.songs.length);

    const largestPlaylistTitle = sortedPlaylists[0]?.title || 'None';
    const smallestPlaylistTitle = sortedPlaylists[sortedPlaylists.length - 1]?.title || 'None';

    const viewData = {
      title: "About the Playlist App",
      fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      displayNumPlaylists: numPlaylists,
      displayNumSongs: numSongs,
      averageSongs,
      largestPlaylistTitle,
      smallestPlaylistTitle,
    };

    logger.info("Sending about viewData:", viewData);
    response.render("about", viewData);
  }
};

export default about;
