import userModel from "../models/user.js";
import { createToken7d, createToken15min } from "../helpers/createJwtToken.js";
import { hashPassword, matchPassword } from "../helpers/hashPassword.js";

class usercontroller {
  static userRegistration = async (req, res) => {
    try {
      const { name, email, password, password_confirmation, tc } = req.body;

      // Validations
      if (!name || !email || !password || !password_confirmation || !tc) {
        return res.status(400).send({
          success: false,
          message: "All Fields Are Required",
        });
      }
      if (password !== password_confirmation) {
        return res.status(400).send({
          success: false,
          message: "Passwords Not Matched",
        });
      }

      // Checking email
      const user = await userModel.findOne({ email });
      if (user) {
        return res.status(200).send({
          success: false,
          message: "Email Already Registered",
        });
      } else {
        const hashPass = await hashPassword(password);
        const newUser = userModel({
          name: name,
          email: email,
          tc: tc,
          password: hashPass,
        });
        await newUser.save();

        // Create Jwt token for the registered user
        const registered_user = await userModel.findOne({ email });
        // Generate jwt token
        const token = await createToken7d(registered_user._id);

        res.status(201).send({
          success: true,
          message: "User Saved Successfully",
          token,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      // validation
      if (!email || !password) {
        return res.status(400).send({
          success: false,
          message: "All Fields are Required",
        });
      }

      // Checking User Registered or not
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).send({
          success: false,
          message: "Email not Registered",
        });
      }

      // Matching Password
      const isMatch = await matchPassword(password, user.password);
      if (isMatch && email === user.email) {
        // Generate JWT Token
        const token = await createToken7d(user._id);

        res.status(200).send({
          success: true,
          message: "Login Successfully",
          token,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Email or Password not correct",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  static changePassword = async (req, res) => {
    const { password, updatedPassword } = req.body;
    if (!password || !updatedPassword) {
      return res.status(400).send({
        success: false,
        message: "Fill All the fields",
      });
    }

    if (password !== updatedPassword) {
      return res.status(400).send({
        success: false,
        message: "Passwords not Matched",
      });
    }

    // Hash and Save the new Password
    const newHashedPass = await hashPassword(password);
    await userModel.findByIdAndUpdate(req.user.id, {
      $set: { password: newHashedPass },
    });
    console.log(`Password Updated Successfully...`);
    res
      .status(200)
      .send({ status: true, message: "Password Changed Successfully" });
  };

  static loggedUser = async (req, res) => {
    try {
      res.status(200).send(req.user);
    } catch (error) {
      console.log(error);
    }
  };

  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "All Fields Required..." });
    } else {
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .send({ success: false, message: "Email Not Registered..." });
      } else {
        const secret = user._id + process.env.JWT_Secret_Key;
        const token = await createToken15min(secret);

        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;

        console.log(link);
        res.send({
          success: true,
          message: "Email Sent... Please CheckYour Email",
        });
      }
    }
  };
}

export default usercontroller;
