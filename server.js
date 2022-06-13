const path = require('path');
//const helpers = require('./utils/helpers');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
//const hbs = exphbs.create({helpers});
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const sess = {
  secret: process.env.DB_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  storeL: new SequelizeStore({
    db: sequelize
  })
};

//app.engine('handlebars', hbs.engine);
//app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));

//app.use(routes);

sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log(`Server is LIVE at localhost:${PORT}`))
})