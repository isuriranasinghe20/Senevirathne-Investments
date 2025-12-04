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
        return res.status(404).json({message: "No Customers found"});
    }

    //Display all users
    return res.status(200).json({users});

};

//data insert all users
const addUsers = async (req, res) => {

    const { indexNo, nic, name, phone, date, vehicleNumber, model, licenseDate, total, installment,period,customerType, status } = req.body;

    let users;
    const id = Date.now().toString() + Math.random().toString();

    try{
        users = new User({id, indexNo, nic, name, phone, date, vehicleNumber, model, licenseDate, total, installment,period,customerType, status});
        await users.save();
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Unable to add user"});
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
        return res.status(404).json({message: "Customer Not found"});
    }
    return res.status(200).json({user});
    
};

//update user details
const updateUser = async (req, res, next) => {

    const id = req.params.id;
    const { indexNo, nic, name, phone, date, vehicleNumber, model, licenseDate, total, installment,period,customerType, status } = req.body;

    let users;

    try{
        users = await User.findByIdAndUpdate(id, {indexNo: indexNo, nic: nic, phone: phone, date: date, vehicleNumber: vehicleNumber, model: model, licenseDate: licenseDate, total: total, installment: installment,period: period, name: name, customerType: customerType, status: status});
        users = await users.save();
    }catch(err){
        console.log(err);
    }

    
    //not found
    if(!users){
        return res.status(404).json({message: "Unable to update customer details"});
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
