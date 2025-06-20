

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        const err = new Error("Internal server error");
        err.statusCode = 500;
        err.error = error;
        next(err);
    })
}


module.exports = asyncHandler;