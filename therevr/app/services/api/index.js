import { urls } from './constants';
import { formatLogin } from './formats';

function makePostInit(body) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

function apiPost(url, body) {
  const init = makePostInit(body);

  const request = fetch(url, init)
  .then((response) => response.json())
  .then((json) => json);

  return request;
}

function loginUser(body) {
  const request = apiPost(urls.login, formatLogin(body));

  return request;
}

function changeStatus(body) {
  const request = apiPost(urls.changeStatus, body);

  return request;
}

function updateApiRecents(body) {
  const request = apiPost(urls.updateRecent, body);

  return request;
}

function uploadPic(body) {
  const request = apiPost(urls.uploadPic, body);

  return request;
}

export { loginUser, changeStatus, updateApiRecents, uploadPic };
