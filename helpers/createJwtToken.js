import jwt from "jsonwebtoken";

const createToken7d = async (ID) => {
  const token = jwt.sign({ userID: ID }, process.env.JWT_Secret_Key, {
    expiresIn: "7d",
  });
  return token;
};

const createToken15min = async (ID) => {
  const token = jwt.sign({ userID: ID }, process.env.JWT_Secret_Key, {
    expiresIn: "15m",
  });
  return token;
};

export { createToken7d, createToken15min };
