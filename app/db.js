
var mongoose = require('mongoose'),
  config = require('../config/config'),
  Schema = mongoose.Schema,
  uuid = require('node-uuid'),
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

mongoose.connect(config.db.uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Successfully connected to database!');
});

var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: String,
  name: String,
});

// Add GeoJSON index
businessSchema.index({loc: '2dsphere'});

// Generate user API token
userSchema.pre('save', function(next) {
  // Maybe make this pre init
  // If no user API token already added
  if (!this.token || this.token.length != 36) {
    this.token = uuid.v4();
  }

  next();
});

// Bcrypt middleware for hashing password
userSchema.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};


// Don't return token of any user
// specify the transform schema option
if (!userSchema.options.toJSON) userSchema.options.toJSON = {};
userSchema.options.toJSON.transform = function (doc, ret, options) {
  delete ret._id;
  delete ret.token;
  delete ret.__v;
  delete ret.password;
  delete ret.contacts;
}

// Don't send password hash on register.
if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = function (doc, ret, options) {
  delete ret.password;
}


module.exports = {
  User: mongoose.model('User', userSchema),
  Business: mongoose.model('Business', businessSchema)
};

