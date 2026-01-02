import User from "../models/User.js";
import Organization from "../models/Organization.js";
import bcrypt from "bcryptjs";

export const createOrganization = async (req, res) => {
  const org = await Organization.create({ name: req.body.name });
  res.json(org);
};

export const createUser = async (req, res) => {
  const { name, email, password, role, organizationId } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
    organizationId,
  });

  res.json(user);
};
