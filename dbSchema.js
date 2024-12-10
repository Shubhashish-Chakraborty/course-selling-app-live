const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const adminSchema = new Schema({
    fullname: String,
    adminname: {type:String , unique:true},
    email: String,
    password: String
})

const userSchema = new Schema({
    fullname: String,
    username: {type:String , unique:true},
    email: String,
    password: String
})

const AdminModel = mongoose.model("admins" , adminSchema);
const UserModel = mongoose.model("users" , userSchema);

module.exports = {
    AdminModel: AdminModel,
    UserModel: UserModel
}