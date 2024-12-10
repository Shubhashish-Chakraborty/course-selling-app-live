const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const adminSchema = new Schema({
    fullname: String,
    adminname: {type:String , unique:true},
    email: String,
    password: String
})

const AdminModel = mongoose.model("admins" , adminSchema);

module.exports = {
    AdminModel: AdminModel
}