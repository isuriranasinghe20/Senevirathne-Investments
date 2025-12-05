const User = require("../Model/UserModel");

//data display all users
const getAllUsers = async (req, res) => {

    let Users;

    try{
        users = await User.find();
    }catch(err){
        console.log(err);
    }

    //not found
    if(!users){
        return res.status(404).json({message: "No Users found"});
    }

    //Display all users
    return res.status(200).json({users});

};

//data insert all users
const addUsers = async (req, res) => {

    const { name, email } = req.body;

    let users;

    try{
        users = new User({name, email});
        await users.save();
    }catch(err){
        console.log(err);
    }

    //not found
    if(!users){
        return res.status(404).json({message: "No Users found"});
    }
    return res.status(200).json({users});
};

//get by Id
const getById = async (req, res) => {

    const id = req.params.id;

    let user;

    try{
        user = await User.findById(id);
    }catch(err){
        console.log(err);
    }

    //not found
    if(!user){
        return res.status(404).json({message: "User Not found"});
    }
    return res.status(200).json({user});
    
};

//update user details
const updateUser = async (req, res, next) => {

    const id = req.params.id;
    const { name, email } = req.body;

    let users;

    try{
        users = await User.findByIdAndUpdate(id, {name: name, email: email});
        users = await users.save();
    }catch{
        console.log(err);
    }

    
    //not found
    if(!users){
        return res.status(404).json({message: "Unable to update user details"});
    }
    return res.status(200).json({users});
}


//Delete user details
const deleteUser = async (req, res, next) => {

    const id = req.params.id;

    let user;

    try{
        user = await User.findByIdAndDelete(id);
    }catch(err){
        console.log(err);
    }

     if(!user){
        return res.status(404).json({message: "Unable to delete user details"});
    }
    return res.status(200).json({user});
};

exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
