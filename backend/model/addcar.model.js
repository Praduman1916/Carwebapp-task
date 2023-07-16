const mongoose = require("mongoose")
const mycarSchema = new mongoose.Schema({
    car_name: { type: String, required: true },
    car_number: { type: String, required: true },
    made_date: { type: String, required: true },
    car_amount: { type: String, required: true },
    create_by:{ type: String ,trim: true},
    update_by:{ type: String ,trim: true},
    photo: { type: String }
})
module.exports = mongoose.model('Mycar', mycarSchema)