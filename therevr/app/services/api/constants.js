// export const BASE_URL = 'http://localhost:8000/';
export const BASE_URL = window.location.protocol + '//' + window.location.host + '/';
// Replace the first line with this one when you want to push to herokue deployement
// export const BASE_URL = 'https://therevr.herokuapp.com/';

export const API = 'api/';

export const API_URL = BASE_URL + API;

const endPointKeys = ['login', 'changeStatus', 'updateRecent', 'uploadPic'];
const endPoints = ['users', 'change_status', 'update_recent', 'upload_file'];
const urls = {};

for (let i = 0; i < endPoints.length; i += 1) {
  urls[endPointKeys[i]] = API_URL + endPoints[i];
}

export { urls };
