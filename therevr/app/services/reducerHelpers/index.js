function filterRecents(recents, foundUser, action) {
  // If recents is empty add contact
  if (recents.length === 0) {
    recents.unshift(foundUser);
    return recents;
  }

  // If the id exists delete it, so the contact can be pushed to top.
  for (let i = 0; i < recents.length; i += 1) {
    if (recents[i].user_id === action.userId) delete recents[i];
  }

  // Shift the contact to the top.
  recents.unshift(foundUser);

  // Filter undefines
  const filterUndefines = recents.filter((item) => {
    if (item !== undefined) return item;
  });

  return filterUndefines;
}

// Returns the user in the array
function findUser(arrTosearch, obj) {
  return arrTosearch.filter((friend) => {
    if (friend.user_id === obj.userId) return friend;
  })[0];
}

function saveToStorage(currentUser) {
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}
export { filterRecents, findUser, saveToStorage };
