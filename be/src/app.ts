import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import routers from './routes';
import morgan from 'morgan'; 

const app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.urlencoded({extended: true, limit: '50mb'}));

app.use(cors());
app.options('*', cors());

import passport from 'passport';
import {jwtStrategy} from './config/passport';
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(morgan('dev'));

app.use((req, res, next) => {
    const { method, url } = req;
    console.log(`${method} request to ${url}`);
    next();
});

app.use('/api/v1', routers);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    message: 'URL Not Found',
  });
});

export default app;
