const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Simple in-memory database (replace with real database in production)
let users = [];

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send password reset email
async function sendPasswordResetEmail(email, resetCode) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code - QuitBet AI',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #60a5fa;">QuitBet AI - Password Reset</h2>
                    <p>You requested to reset your password.</p>
                    <p style="font-size: 24px; color: #3b82f6; font-weight: bold;">Reset Code: ${resetCode}</p>
                    <p>Enter this code in the app to reset your password.</p>
                    <p style="color: #9ca3af;">This code will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        });
        console.log(`Reset code sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Register new user
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().isLength({ min: 2 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, name } = req.body;

        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            name,
            createdAt: new Date().toISOString()
        };

        users.push(user);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Request password reset
router.post('/forgot-password', [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            // Don't reveal if user exists for security
            return res.json({ 
                message: 'If account exists, reset code will be sent to email' 
            });
        }

        // Generate reset code
        const resetCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Store reset code (expires in 1 hour)
        if (!user.resetCode) {
            user.resetCode = {};
        }
        user.resetCode.code = resetCode;
        user.resetCode.expiresAt = Date.now() + 3600000; // 1 hour

        // Send email
        await sendPasswordResetEmail(email, resetCode);

        res.json({ 
            message: 'Password reset code sent to email',
            resetCode: process.env.NODE_ENV === 'development' ? resetCode : undefined
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset password with code
router.post('/reset-password', [
    body('email').isEmail().normalizeEmail(),
    body('code').notEmpty(),
    body('newPassword').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, code, newPassword } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user || !user.resetCode) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        // Check if code is valid and not expired
        if (user.resetCode.code !== code || Date.now() > user.resetCode.expiresAt) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        delete user.resetCode;

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

