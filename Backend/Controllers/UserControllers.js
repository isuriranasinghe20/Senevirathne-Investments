const User = require("../Model/UserModel");
const Activity = require("../Model/Activity");
const ClosedUser = require("../Model/ClosedUserModel");
const ClosedActivity = require("../Routes/ClosedActivityRoutes").ClosedActivity;

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

    const { indexNo, nic, name, phone, date, vehicleNumber, model, licenseDate, total, installment,period,customerType, status, existingDocs } = req.body;

    let users;
    const id = Date.now().toString() + Math.random().toString();

    try{
        users = new User({id, indexNo, nic, name, phone, date, vehicleNumber, model, licenseDate, total, installment,period,customerType, status,
          customerNicDocs: existingDocs?.customerNicDocs || [],
          guarantorNicDocs: existingDocs?.guarantorNicDocs || [],
          vehicleBookDocs: existingDocs?.vehicleBookDocs || [],
          vehicleLicenseDocs: existingDocs?.vehicleLicenseDocs || []
        });
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

 // <-- import ClosedUser model

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { isClosed, ...otherData } = req.body; // extract isClosed separately

  try {
    // Update the user with new data
    let user = await User.findByIdAndUpdate(id, { ...otherData, isClosed }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Unable to update customer details" });
    }

    // If the user is marked as closed, move to ClosedUser collection and delete from main User collection
    if (isClosed) {
      const closedUserData = {
        ...user.toObject(),
        isClosed: true,
        customerNicDocs: user.customerNicDocs ?? [],
        guarantorNicDocs: user.guarantorNicDocs ?? [],
        vehicleBookDocs: user.vehicleBookDocs ?? [],
        vehicleLicenseDocs: user.vehicleLicenseDocs ?? []

      };

      const activities = await Activity.find({ userId: id });

      // Move activities
      for (const a of activities) {
        const closedActivity = new ClosedActivity({
          userId: id,
          no: a.no,
          date: a.date,
          paidAmount: a.paidAmount,
          paid: a.paid
        });
        await closedActivity.save();
      }

      // Delete activity rows from normal table
      await Activity.deleteMany({ userId: id });

      const closedUser = new ClosedUser(closedUserData);
      await closedUser.save();
      await User.findByIdAndDelete(id);
    }

    // If not closed, return updated user
    res.status(200).json({ message: "User updated successfully", user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unable to update user" });
  }
};




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

// ---------------------------
// Upload Documents
// ---------------------------
exports.uploadDocuments = async (req, res) => {
  try {
    const { id, type } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const filePaths = req.files.map((f) => f.path);

    switch (type) {
      case "customerNic":
        user.customerNicDocs.push(...filePaths);
        break;
      case "guarantorNic":
        user.guarantorNicDocs.push(...filePaths);
        break;
      case "vehicleBook":
        user.vehicleBookDocs.push(...filePaths);
        break;
      case "vehicleLicense":
        user.vehicleLicenseDocs.push(...filePaths);
        break;
      default:
        return res.status(400).json({ message: "Invalid document type" });
    }

    await user.save();
    res.json({ message: "Files uploaded successfully", user });

  } catch (err) {
    res.status(500).json(err);
  }
};


// ---------------------------
// Delete File
// ---------------------------
exports.deleteFile = async (req, res) => {
  try {
    const { id, type, index } = req.params;
    const user = await User.findById(id);

    const docMap = {
      customerNic: user.customerNicDocs,
      guarantorNic: user.guarantorNicDocs,
      vehicleBook: user.vehicleBookDocs,
      vehicleLicense: user.vehicleLicenseDocs,
    };

    const array = docMap[type];

    if (!array) return res.status(400).json({ message: "Invalid type" });

    array.splice(index, 1);

    await user.save();
    res.json({ message: "File deleted", user });

  } catch (err) {
    res.status(500).json(err);
  }
};


exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
