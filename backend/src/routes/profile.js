const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();
const bcrypt = require("bcrypt")

profileRouter.get("/profile/view", userAuth, async(req, res) => {
    try {
        const user = req.user;
        res.send(user);

    } catch (error) {
        res.status(400).send("ERROR" + error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser
        })
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

profileRouter.patch("/profile/editpassword", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Step 1: Validate input presence
        if (!oldPassword || !newPassword || !confirmPassword) {
            throw new Error("All password fields are required");
        }

        // Step 2: Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("Old password is incorrect");
        }

        // Step 3: Validate new passwords match
        if (newPassword !== confirmPassword) {
            throw new Error("New passwords do not match");
        }

        // Optional: Add validation rules (length, strength, etc.)
        if (newPassword.length < 6) {
            throw new Error("New password must be at least 6 characters long");
        }

        // Step 4: Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Step 5: Save updated user
        await user.save();

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});


module.exports = profileRouter;