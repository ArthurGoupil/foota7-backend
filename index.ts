import * as express from 'express';
import * as formidableMiddleware from 'express-formidable';
import * as cors from 'cors';
import { connect } from 'mongoose';

const app = express();
app.use(formidableMiddleware());
app.use(cors());

connect('mongodb://localhost/football-seven', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

import fsgtDataRoutes from './routes/fsgtData';
app.use(fsgtDataRoutes);

app.all('*', (req, res) => {
  res.json({ message: 'all routes' });
});

app.listen(3001, () => {
  console.log('Server has started');
});
