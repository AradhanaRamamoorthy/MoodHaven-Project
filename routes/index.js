import userRoutes from './users.js'; 
import authRoutes from './auth.js';
import moodsRoute from './moods.js';
import interestsRoute from './interests.js';  
import placesRoute from './places.js';
import reviewRoute from './review.js';

import { static as staticDir } from 'express';

const constructorMethod = (app) => {
  app.use('/', userRoutes);  
  app.use('/auth', authRoutes); 
  app.use('/moods', moodsRoute);  
  app.use('/interests', interestsRoute); 
  app.use('/reviews',reviewRoute); 
  app.use('/places',placesRoute);
  app.use('/public', staticDir('public'));  
  app.use('*', (req, res) => {
    res.redirect('/');  
  });
};

export default constructorMethod;
