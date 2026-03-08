export default () => ({
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cargoconnect',
  },
  port: parseInt(process.env.PORT || '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  },
});
