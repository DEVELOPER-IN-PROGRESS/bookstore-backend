const mongoose = require('mongoose');
const connectionString = process.env.DATABASE;
mongoose.connect(connectionString).then( () => { console.log('mongoose connected')})
.catch( (err) => { console.log(`mongodb connection failed due to ${err}`) })


