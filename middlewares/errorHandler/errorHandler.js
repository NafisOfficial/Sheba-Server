require('dotenv').config();



const errorHandler =(err, req, res, next)=>{
 const statusCode = err.statusCode || 500;
 const message = err.message || "Internal server error"

 const errorResponse = {
    success: false,
    message,
    error: {},
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
 }

 res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler