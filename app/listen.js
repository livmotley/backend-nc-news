const app = require('./app.js');

app.listen(8080, (err) => {
    err ? console.log(err) : console.log('listening on port 8080');
})