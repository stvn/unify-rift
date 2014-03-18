var search = module.exports = {
  search: {
    help: 'HELP STRING',
    // path relative to API root
    url: '/rel/path',
    // the http method type: get, post, put, del
    method: 'get'
  },
  user: {
    get: {
      help: 'Get user by ID',
      url: '/user/:id',
      method: 'get'
    }
  }
};
