function makeResponse(success, content) {
  if (success) return { success: true, content };

  return { success: false, err: content };
}

module.exports = makeResponse;
