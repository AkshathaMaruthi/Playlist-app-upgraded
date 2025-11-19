'use strict';

import logger from "../utils/logger.js";
import playlistStore from "../models/playlist-store.js";
import { v4 as uuidv4 } from "uuid";
import accounts from './accounts.js';

const dashboard = {
  createView(request, response) {
    logger.info('Dashboard view rendering...');
    const loggedInUser = accounts.getCurrentUser(request);

    if (!loggedInUser) {
      return response.redirect('/');
    }

    const playlists = playlistStore.getUserPlaylists(loggedInUser.id);
    const viewData = {
      title: 'Playlist Dashboard',
      playlists,
      fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
    };

    logger.info('Rendering user playlists:', playlists);
    response.render('dashboard', viewData);
  },

  addPlaylist(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);

    if (!loggedInUser) {
      logger.warn('No logged-in user, redirecting to home.');
      return response.redirect('/');
    }

    // Basic validation
    const { title, category, rating } = request.body;
    if (!title || !category) {
      logger.warn('Missing title or category in playlist creation:', request.body);
      return response.redirect('/dashboard');
    }

    const newPlaylist = {
      userid: loggedInUser.id,
      id: uuidv4(),
      title,
      category,
      rating: rating || 'Unrated',
      songs: [],
      date: new Date(),
    };

    playlistStore.addPlaylist(newPlaylist);
    logger.info('New playlist added:', newPlaylist);
    response.redirect('/dashboard');
  },

  deletePlaylist(request, response) {
    const playlistId = request.params.id;
    logger.debug(`Deleting Playlist with ID: ${playlistId}`);
    playlistStore.removePlaylist(playlistId);
    response.redirect("/dashboard");
  },
};

export default dashboard;
