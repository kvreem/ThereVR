function formatLogin(obj) {
  const { id, name, picture, email, friends, location, birthday } = obj;

  const data = {
    user_id: id,
    fb_picture: picture.data.url,
    name,
    email,
    profile_picture: '',
    location,
    friends: friends.data || '',
    birthday: new Date(birthday),
    status: 'online',
    recent: [],
  };

  return data;
}

export { formatLogin };
