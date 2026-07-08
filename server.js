const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint for the contact form
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // In a real application, you would send an email here using nodemailer or similar.
    // For this portfolio demo, we'll just log the message and return a success response.
    console.log('--- New Contact Form Submission ---');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------------');
    
    // Send a JSON response indicating success
    res.status(200).json({ 
        success: true, 
        message: 'Your message has been received successfully!' 
    });
});

// Fallback route to serve index.html for any other requests (useful for SPA routing if needed later)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
