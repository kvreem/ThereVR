import io from 'socket.io-client';
import {
  changeFriendsStatus, callUser, endCall,
  acceptCallSuccess
} from 'containers/AuthHoc/actions';

var socket;

// I moved this out to get access to socket
// if (env == 'development') {
//   socket = io('127.0.0.1:8000'); // switch out for dev
// } else {
//   socket = io('https://therevr.herokuapp.com/');
// }
socket = io(window.location.host);

function connectSocket(dispatch) {
  socket.on('', () => {
  });

  socket.on('welcome', () => {
  });
//    //const socket = io('127.0.0.1:8000'); // switch out for dev
//    const socket = io('https://therevr.herokuapp.com/');
//    socket.on('', () => {

  socket.on('call:room', (user) => {
    dispatch(callUser(user));
  });

  socket.on('status:change', (user) => {
    dispatch(changeFriendsStatus(user.status, user.user_id));
  });

  socket.on('call:ended', (ids) => {
    dispatch(endCall(ids));
  });

  socket.on('rooms:accept', (room) => {
    dispatch(acceptCallSuccess(room));
  });

  socket.on('rooms:reject', (room) => {
    dispatch(acceptCallSuccess(room));
  });

  socket.on('rooms:create', (room) => {
    dispatch(acceptCallSuccess(room));
  });

  return socket;
}

export { connectSocket, socket };
