import bcrypt from "bcrypt";

const hashPassword = async (PASSWORD) => {
  const salt = 10;
  return await bcrypt.hash(PASSWORD, salt);
};

const matchPassword = (Simple_Password, hashed_Password) => {
  return bcrypt.compare(Simple_Password, hashed_Password);
};

export { hashPassword, matchPassword };
