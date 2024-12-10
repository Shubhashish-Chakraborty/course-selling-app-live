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

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    adminId: ObjectId
})

const AdminModel = mongoose.model("admins" , adminSchema);
const UserModel = mongoose.model("users" , userSchema);
const CourseModel = mongoose.model("courses" , courseSchema);

module.exports = {
    AdminModel: AdminModel,
    UserModel: UserModel,
    CourseModel: CourseModel
}