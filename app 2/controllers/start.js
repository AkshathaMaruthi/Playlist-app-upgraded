'use strict';

import logger from "../utils/logger.js";
import appStore from "../models/app-store.js";
import playlistStore from "../models/playlist-store.js";
import userStore from "../models/user-store.js";
import accounts from './accounts.js';

const start = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.info("Start page loading!");

    if (!loggedInUser) {
      return response.redirect('/');
    }

    //  App-wide stats
    const allPlaylists = playlistStore.getAllPlaylists();
    const numPlaylists = allPlaylists.length;
    const numSongs = allPlaylists.reduce((sum, p) => sum + p.songs.length, 0);
    const numUsers = userStore.getAllUsers().length;
    const averageSongs = numPlaylists > 0 ? (numSongs / numPlaylists).toFixed(2) : 0;

    const viewData = {
      title: "Welcome to the Playlist App!",
      fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      numPlaylists,
      numSongs,
      numUsers,
      averageSongs,
    };

    response.render('start', viewData);
  }
};

export default start;
