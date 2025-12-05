const ClosedUser = require("../Model/ClosedUserModel");

const getAllClosedUsers = async (req, res) => {
  try {
    const users = await ClosedUser.find();
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unable to fetch closed users" });
  }
};

const getClosedUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await ClosedUser.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllClosedUsers };
module.exports.getClosedUserById = getClosedUserById;
