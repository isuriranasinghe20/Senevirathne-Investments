const User = require("../Model/UserModel");

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

// Create a user (accepts all frontend fields)
const addUsers = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        
        // Extract only the fields defined in the schema
        let {
            indexNo, nic, name, phone, date, vehicleNumber, model, licenseDate,
            total, installment, period, customerType, status
        } = req.body;

        // Validate required field
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Name is required" });
        }

        // Convert numeric fields, handling empty strings
        const userData = {
            indexNo: indexNo || undefined,
            nic: nic || undefined,
            name: name.trim(),
            phone: phone || undefined,
            date: date ? new Date(date) : undefined,
            vehicleNumber: vehicleNumber || undefined,
            model: model || undefined,
            licenseDate: licenseDate ? new Date(licenseDate) : undefined,
            total: total && total !== "" ? Number(total) : undefined,
            installment: installment && installment !== "" ? Number(installment) : undefined,
            period: period && period !== "" ? Number(period) : undefined,
            customerType: customerType || undefined,
            status: status || "Moderate"
        };

        // Remove undefined values to avoid overwriting defaults
        Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key]);

        console.log("Creating user with data:", userData);
        const user = new User(userData);
        await user.save();
        console.log("User saved successfully:", user._id);
        return res.status(201).json({ users: user });
    } catch (err) {
        console.error("Error creating user:", err.message);
        console.error("Stack:", err.stack);
        return res.status(500).json({ message: "Unable to create user", error: err.message });
    }
};

// Get user by Id
const getById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User Not found" });
        return res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Update user details
const updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const updated = await User.findByIdAndUpdate(id, { ...req.body }, { new: true });
        if (!updated) return res.status(404).json({ message: "Unable to update user details" });
        return res.status(200).json({ users: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
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
        const filePaths = req.files.map(file => file.path);

        // Update user document with file paths
        const updated = await User.findByIdAndUpdate(
            userId,
            { $push: { [fieldName]: { $each: filePaths } } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`Uploaded ${filePaths.length} files for user ${userId}, docType: ${docType}`);
        return res.status(200).json({ message: "Files uploaded successfully", user: updated });
    } catch (err) {
        console.error("Error uploading documents:", err.message);
        return res.status(500).json({ message: "Unable to upload files", error: err.message });
    }
};

exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.uploadDocuments = uploadDocuments;
