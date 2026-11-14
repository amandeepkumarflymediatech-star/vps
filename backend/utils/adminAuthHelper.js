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

export function parseDurationToMs(durationStr) {
  if (!durationStr) return 7 * 24 * 60 * 60 * 1000;
  if (typeof durationStr === "number") return durationStr * 1000;
  const str = String(durationStr).trim().toLowerCase();
  const match = str.match(/^(\d+)([smhdwy]?)$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const val = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s": return val * 1000;
    case "m": return val * 60 * 1000;
    case "h": return val * 60 * 60 * 1000;
    case "d": return val * 24 * 60 * 60 * 1000;
    case "w": return val * 7 * 24 * 60 * 60 * 1000;
    case "y": return val * 365 * 24 * 60 * 60 * 1000;
    default: return val * 1000;
  }
}

export function getAdminEnvCredentials() {
  let email = cleanString(process.env.ADMIN_EMAIL);
  let username = cleanString(process.env.ADMIN_USERNAME);
  let password = cleanString(process.env.ADMIN_PASSWORD);
  let jwtSecret = cleanString(process.env.JWT_SECRET);
  let sessionSecret = cleanString(process.env.SESSION_SECRET);
  let jwtExpiresIn = cleanString(process.env.JWT_EXPIRES_IN);

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
            if (key === "JWT_SECRET") jwtSecret = cleanString(val);
            if (key === "SESSION_SECRET") sessionSecret = cleanString(val);
            if (key === "JWT_EXPIRES_IN") jwtExpiresIn = cleanString(val);
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
    jwtSecret: jwtSecret || "thisisaverysecuresecretkeyforjwt",
    sessionSecret: sessionSecret || "supersecretenglishraj",
    jwtExpiresIn: jwtExpiresIn || "7d",
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
