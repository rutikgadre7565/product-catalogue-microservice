const app = require('./app');
const { sequelize } = require('./models');

const port = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Product API running on http://localhost:${port}`));
}).catch(error => {
  console.error('Database startup failed:', error);
  process.exit(1);
});
