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


exports.favorites = function(req, res) {
  req.user.populate('favorites', function(err, user) {
    if (err) return badRequest(err, res);
    res.json(user.favorites);
  });
};


exports.addFavorite = function(req, res) {

  // Don't allow duplicate favorites
  if (req.user.favorites.indexOf(req.body.businessId) !== -1)
    return badRequest('You cannot favorite a business twice', res);

  Business.findById(req.body.businessId, function(err, business) {
    if (err) return badRequest(err, res);

    if (business == null)
      return badRequest('No business found with that ID', res);

    req.user.favorites.push(business);
    req.user.save(function(err, user) {
      if (err) return badRequest(err, res);
      res.json(business);
    });
  });
};


exports.removeFavorite = function(req, res) {

  var index = req.user.favorites.indexOf(req.body.businessId);
  if (index == -1)
    return badRequest('That business wasn\'t favorited', res);

  // Remove the business and save
  req.user.favorites.splice(index, 1);

  req.user.save(function(err, user) {
    if (err) return badRequest(err, res);
    res.json(user);
  });

};



