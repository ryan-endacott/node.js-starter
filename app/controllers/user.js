var db = require('../db'),
    User = db.User,
    Business = db.Business,
    errors = require('../errors'),
    badRequest = errors.badRequestError,
    unauthorizedError = errors.unauthorizedError;

// Action to register a new user.
exports.register = function(req, res) {

  var user = new User(req.body.user);
  user.save(function(err, user) {
    if (err) return badRequest(err, res);
    res.json(user.toObject()); // Send toObject to include user's token
  });

};

// Action to login
exports.login = function(req, res) {

  User.findOne({ email: req.query.email }, function(err, user) {
    if (err) return badRequest(err);

    if (!user) return unauthorizedError(null, res); // No user found

    user.comparePassword(req.query.password, function(err, isMatch) {
      if (err) return badRequest(err);
      if (isMatch) {
        res.json(user.toObject()); // Send toObject to include token
      }
      else {
        return unauthorizedError(null, res); // no match
      }
    });
  });
};

