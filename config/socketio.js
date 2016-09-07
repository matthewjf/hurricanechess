import {server} from '../server';
import socketio from 'socket.io';
import session from './session';
import sharedsession from "express-socket.io-session";

var io = socketio.listen(server);
io.use(sharedsession(session));

module.exports = io;
