// Set up routes for the app

// Controllers
var index = require('../app/controllers/index'),
    auth = require('./auth'),
    requireUser = auth.requireUserToken,
    requireAppToken = auth.requireAppToken;

module.exports = function(app) {
  app.get('/', index.index);
  app.post('/user/register', requireAppToken, user.register);
  app.get('/user/login', requireAppToken, user.login);
};
