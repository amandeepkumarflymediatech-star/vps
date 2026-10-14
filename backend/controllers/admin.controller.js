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

export const getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const search = req.query.search ? req.query.search.trim() : "";
    const roleFilter = req.query.role ? req.query.role.trim() : "";

    const query = {};
    if (req.user?.id) {
      query._id = { $ne: req.user.id };
    }
    if (roleFilter) {
      query.role = roleFilter;
    }
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escaped, "i");
      query.$or = [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phone: { $regex: searchRegex } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit) || 1, 1);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        totalPages,
        limit,
        total,
      },
    });
  } catch (error) {
    console.error("getUsers error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
