'use strict';

import logger from '../utils/logger.js';
import userStore from '../models/user-store.js';
import { v4 as uuidv4 } from 'uuid';

// Create an accounts object
const accounts = {

  // Index function to render index page
  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  // Login function to render login page
  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  // Logout function to clear cookie and redirect to homepage
  logout(request, response) {
    response.cookie('playlist', '');
    response.redirect('/');
  },

  // Signup function to render signup page
  signup(request, response) {
    const viewData = {
      title: 'Register for the Service',
    };
    response.render('signup', viewData);
  },

  // Register function to add a new user and auto-login
  register(request, response) {
    const user = request.body;
    user.id = uuidv4();
    userStore.addUser(user);
    logger.info('Registering new user: ' + user.email);

    // Auto-login after signup
    response.cookie('playlist', user.email);
    response.redirect('/start');
  },

  // Authenticate function to validate login credentials
  authenticate(request, response) {
    const user = userStore.getUserByEmail(request.body.email);
    const inputPassword = request.body.password;

    if (user && user.password === inputPassword) {
      response.cookie('playlist', user.email);
      logger.info('Logging in: ' + user.email);
      response.redirect('/start');
    } else {
      logger.info('Failed login attempt for: ' + request.body.email);
      response.redirect('/login');
    }
  },

  // Utility function to get the current logged-in user
  getCurrentUser(request) {
    const userEmail = request.cookies.playlist;
    return userStore.getUserByEmail(userEmail);
  }
};

export default accounts;
