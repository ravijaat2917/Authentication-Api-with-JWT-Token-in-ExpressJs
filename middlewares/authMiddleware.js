import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

const checkUserAuth = async (req, res, next) => {
  var token;
  // Access token from req header
  const authorization = req.headers["authorization"];
  //   console.log(authorization);
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = authorization.split(" ")[1];
      if (!token) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized User , No Token",
        });
      }

      // Verify the token that generated on login time
      const { userID } = jwt.verify(token, process.env.JWT_Secret_Key);
      //   console.log(userID);

      // Get user from token
      req.user = await userModel.findById(userID).select("-password");
      //   console.log(req.user);
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).send({
        success: false,
        message: "Unauthorized User",
      });
    }
  } else {
    return res.status(401).send({
      success: false,
      message: "Authorization Not Valid For User",
    });
  }
};

export default checkUserAuth;
