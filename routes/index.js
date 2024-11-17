import userRoutes from './users.js';
import authRoutes from './auth.js';

import {static as staticDir} from 'express';
const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('/auth', authRoutes);
  app.use('/public', staticDir('public'));
  app.use('*', (req, res) => {
    res.redirect('/');
  });
};

export default constructorMethod;