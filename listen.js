const app = require('./app/app.js')
const { PORT = 9000 } = process.env

app.listen(PORT , () => console.log(`listening on ${PORT}...`))