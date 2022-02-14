const mongoose = require('mongoose')
const uri = "mongodb+srv://youssef:youssef123@cluster0.sbrme.mongodb.net/BookStore?retryWrites=true&w=majority"

module.exports = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        await mongoose.connect(
            uri,
            connectionParams
        )
        console.log("connected successfuly.")
    } catch (error) {
        console.log("Couldn't connect to database.", error)
    }
}