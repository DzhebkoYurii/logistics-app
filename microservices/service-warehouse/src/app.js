const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/routes');
const errorHandler = require('./middleware/errorHandler');

const sequelize = require('./config/database');
require('./models/index');
require('./models/Warehouse');

sequelize.sync({ alter: true }) 
  .then(() => console.log('Database synced successfully'))
  .catch(err => console.error('Database sync error:', err));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found', status: 404 } });
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;