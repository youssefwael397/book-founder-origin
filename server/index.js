const cors = require('cors')
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const connection = require('./config/db')
const arabicBooks = require('./routes/arabic-books')
const englishbooks = require('./routes/english-books')
const admins = require('./routes/admins')


// connect to db
connection()

// miidlewares
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/xwww-form-urlencoded
app.use(cors());
app.use('/api/books/arabic', arabicBooks);
app.use('/api/books/english', englishbooks);
app.use('/api/admin/', admins);


// creating a server
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`server listening on port ${port}...`))