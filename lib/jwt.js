const jwt = require('jsonwebtoken');
const opts = {};
opts.expiresIn = 60 * 60 * 24 * 7;
const config = process.env.DB_ENV || 'dev';
const secret =
  config == 'production' ? process.env.SERVER_SECRET_KEY : 'shinedme';

const createToken = (data) => jwt.sign(data, secret, opts);

const verifyToken = (token) => jwt.verify(token, secret);

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = secret;
jwtStrategy = new JwtStrategy(options, (jwt_payload, done) => {
  return done(null, jwt_payload);
});
passport.use(jwtStrategy);

const tokenRequired = passport.authenticate('jwt', { session: false });

module.exports = { createToken, verifyToken, tokenRequired };
