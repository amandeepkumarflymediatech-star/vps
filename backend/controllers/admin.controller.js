import User from "../models/User.js";
import Organization from "../models/organization.js";
import bcrypt from "bcryptjs";

export const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Organization name is required" });
    const org = await Organization.create({ name });
    return res.status(201).json(org);
  } catch (error) {
    console.error("createOrganization error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, organizationId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    // Optional: ensure organization exists when provided
    if (organizationId) {
      const org = await Organization.findById(organizationId);
      if (!org) return res.status(400).json({ message: "Invalid organizationId" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      organizationId,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error("createUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
