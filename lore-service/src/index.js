require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3002;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Lore service running on port ${PORT}`);
  });
});
