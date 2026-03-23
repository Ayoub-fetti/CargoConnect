export default () => ({
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cargoconnect',
  },
  port: parseInt(process.env.PORT || '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    prices: {
      monthly: process.env.STRIPE_PRICE_1_MONTH,
      quarterly: process.env.STRIPE_PRICE_3_MONTHS,
      yearly: process.env.STRIPE_PRICE_1_YEAR,
    },
  },
});
