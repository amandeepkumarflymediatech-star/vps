import Support from "../models/support.js";
import nodemailer from "nodemailer";

// Create email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Submit support request
export const submitSupportRequest = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Create support request
        const supportRequest = await Support.create({
            name,
            email,
            subject,
            message,
        });

        // Send email to admin
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `New Support Request: ${subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0852A1;">New Support Request</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">Request ID: ${supportRequest._id}</p>
        </div>
      `,
        };

        // Send confirmation email to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "We received your support request - The English Raj",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0852A1;">Thank you for contacting us!</h2>
          <p>Dear ${name},</p>
          <p>We have received your support request and our team will get back to you within 24-48 hours.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your Request Details:</strong></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>If you have any urgent queries, please contact us at:</p>
          <p>📧 Email: support@theenglishraj.com</p>
          <p>📞 Phone: +91 90413-23089</p>
          
          <p style="margin-top: 30px;">Best regards,<br/>The English Raj Team</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">Request ID: ${supportRequest._id}</p>
        </div>
      `,
        };

        // Send emails
        // We use Promise.allSettled to ensure that even if one email fails, the process continues
        // and we don't crash, but we should log errors.
        const results = await Promise.allSettled([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions),
        ]);

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Email sending failed for ${index === 0 ? 'Admin' : 'User'}:`, result.reason);
            }
        });

        res.status(201).json({
            success: true,
            message: "Support request submitted successfully. We'll get back to you soon!",
            data: supportRequest,
        });
    } catch (error) {
        console.error("Support request error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit support request. Please try again.",
            error: error.message,
        });
    }
};

// Get all support requests (Admin only)
export const getAllSupportRequests = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const requests = await Support.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });
    } catch (error) {
        console.error("Get support requests error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch support requests",
            error: error.message,
        });
    }
};

// Update support request status (Admin only)
export const updateSupportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const supportRequest = await Support.findByIdAndUpdate(
            id,
            { status, adminNotes },
            { new: true }
        );

        if (!supportRequest) {
            return res.status(404).json({
                success: false,
                message: "Support request not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Support request updated successfully",
            data: supportRequest,
        });
    } catch (error) {
        console.error("Update support status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update support request",
            error: error.message,
        });
    }
};
