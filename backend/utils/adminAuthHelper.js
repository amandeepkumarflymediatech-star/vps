import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export function cleanString(str) {
  if (!str) return "";
  let cleaned = String(str).trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.substring(1, cleaned.length - 1).trim();
  }
  return cleaned;
}

export function getAdminEnvCredentials() {
  let email = cleanString(process.env.ADMIN_EMAIL);
  let username = cleanString(process.env.ADMIN_USERNAME);
  let password = cleanString(process.env.ADMIN_PASSWORD);

  try {
    const envPaths = [
      path.join(process.cwd(), ".env"),
      path.join(process.cwd(), "backend", ".env"),
      path.resolve("D:\\vps\\backend\\.env"),
      path.resolve("D:\\vps\\admin\\.env"),
      path.resolve("D:\\vps\\.env"),
    ];

    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf8");
        const lines = content.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim();
            if (key === "ADMIN_EMAIL") email = cleanString(val);
            if (key === "ADMIN_USERNAME") username = cleanString(val);
            if (key === "ADMIN_PASSWORD") password = cleanString(val);
          }
        }
        if (password) break;
      }
    }
  } catch (err) {
    console.error("Error reading admin credentials from .env:", err);
  }

  return {
    email: email || "admin@theenglishraj.com",
    username: username || "admin",
    password: password || "admin@123",
  };
}

export async function syncAdminUser(targetEmail, newPlainPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPlainPassword, 10);

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      user = await User.findOne({ role: "ADMIN" });
    }

    if (user) {
      user.email = targetEmail;
      user.password = hashedPassword;
      user.role = "ADMIN";
      user.status = "ACTIVE";
      user.isVerified = true;
      await user.save();
      console.log(`Synced admin credentials in DB for user id: ${user._id}, email: ${targetEmail}`);
    } else {
      user = await User.create({
        name: "System Admin",
        email: targetEmail,
        phone: "0000000000",
        password: hashedPassword,
        role: "ADMIN",
        status: "ACTIVE",
        isVerified: true,
      });
      console.log(`Created new admin user in DB with email: ${targetEmail}`);
    }
    return user;
  } catch (err) {
    console.error("Failed to sync admin user in DB:", err);
    return {
      _id: "admin-env",
      name: "System Admin",
      email: targetEmail,
      role: "ADMIN",
      status: "ACTIVE",
      isVerified: true,
    };
  }
}
