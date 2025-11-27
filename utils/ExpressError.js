class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // Correct way to call base Error class
        this.statusCode = statusCode; // ✅ Corrected from `this.status`
        this.message = message;
    }
}

module.exports = ExpressError;
