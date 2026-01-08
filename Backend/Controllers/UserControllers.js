const User = require("../Model/UserModel");
const ClosedUser = require("../Model/ClosedUserModel");
const Activity = require("../Model/Activity");
const ClosedActivity = require("../Model/ClosedActivityModel");
const fs = require("fs");
const path = require("path");

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No Users found" });
        }
        return res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

//data insert all users
const addUsers = async (req, res) => {

  const { 
    indexNo, nic, name, phone, date, vehicleNumber, model, licenseDate, 
    total, installment, period, customerType, status, existingDocs 
  } = req.body;

  let user;
  const id = Date.now().toString() + Math.random().toString();

  try {
    user = new User({
      id,
      indexNo,
      nic,
      name,
      phone,
      date,
      vehicleNumber,
      model,
      licenseDate,
      total,
      installment,
      period,
      customerType,
      status,

      // ⭐ Accept old documents (very important)
      customerNicDocs: existingDocs?.customerNicDocs || [],
      guarantorNicDocs: existingDocs?.guarantorNicDocs || [],
      vehicleBookDocs: existingDocs?.vehicleBookDocs || [],
      vehicleLicenseDocs: existingDocs?.vehicleLicenseDocs || []
    });

    await user.save();

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to add user" });
  }

  return res.status(200).json({ user });
};



// Update user details
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { isClosed, ...otherData } = req.body; // extract isClosed separately

  try {
    // Update the user with new data
    let user = await User.findByIdAndUpdate(id, { ...otherData, isClosed }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Unable to update customer details" });
    }

     // If closing user → move to closed collections
    if (isClosed) {
      // Move user to ClosedUser
      const closedUser = new ClosedUser({
        ...user.toObject(),
        isClosed: true
      });
      await closedUser.save();

      // Fetch activity rows
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

      // Delete from normal user table
      await User.findByIdAndDelete(id);
    }

    res.status(200).json({ message: "User updated", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating user" });
  }
};

//get by Id 
const getById = async (req, res) => { 
  const id = req.params.id; let user; 
  
  try{ 
    user = await User.findById(id); 
  }catch(err){ 
    console.log(err); } 
    
    //not found 
    if(!user){ 
      return res.status(404).json({message: "User Not found"});
    } 
    
    return res.status(200).json({user}); 
  };

// Delete user details
const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: "Unable to delete user details" });
        return res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Upload documents for a user
const uploadDocuments = async (req, res) => {
    const userId = req.params.id;
    const docType = req.params.docType; // customerNic, guarantorNic, vehicleBook, vehicleLicense
    
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        // Map docType to schema field name
        const docFieldMap = {
            customerNic: "customerNicDocs",
            guarantorNic: "guarantorNicDocs",
            vehicleBook: "vehicleBookDocs",
            vehicleLicense: "vehicleLicenseDocs",
        };

        const fieldName = docFieldMap[docType];
        if (!fieldName) {
            return res.status(400).json({ message: "Invalid document type" });
        }

        // Extract file paths
const   fileNames = req.files.map(file => file.filename);
        // Update user document with file paths
        const updated = await User.findByIdAndUpdate(
            userId,
            { $push: { [fieldName]: { $each: fileNames } } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`Uploaded ${fileNames.length} files for user ${userId}, type: ${docType}`);
        return res.status(200).json({ message: "Files uploaded successfully", user: updated });
    } catch (err) {
        console.error("Error uploading documents:", err.message);
        return res.status(500).json({ message: "Unable to upload files", error: err.message });
    }
};



// DELETE FILE CONTROLLER
exports.deleteFile = async (req, res) => {
  try {
    const { id, docType, index } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Dynamic field (ex: customerNicDocs)
    const field = docType + "Docs";

    if (!user[field] || !user[field][index]) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "..", "uploads", user[field][index]);

    // Remove file from server
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Remove from MongoDB array
    user[field].splice(index, 1);
    await user.save();

    return res.json({ message: "File deleted successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};


exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.uploadDocuments = uploadDocuments;
