var db = require('../app/db'),
    User = db.User,
    config = require('./config'),
    errors = require('../app/errors'),
    unauthorizedError = errors.unauthorizedError;

// Middleware for authentication
module.exports = {

  requireUserToken: function requireUserToken(req, res, next) {
    var token = req.body.userToken || req.query.userToken;
    if (!token) return unauthorizedError(null, res);
    User.findOne({
      token: token
    }, function(err, user) {
      if (err) return next(err);
      // If no user found
      if (!user) return unauthorizedError(null, res);
      // User was found
      req.user = user;
      next();
    });
  },

  requireAppToken: function requireAppToken(req, res, next) {
    var token = req.body.apiToken || req.query.apiToken;
    if (!token || token != config.appToken) return unauthorizedError(null, res);
    next();
  }

};

