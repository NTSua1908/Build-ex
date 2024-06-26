"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins = [
    "http://localhost:3000",
    "https://experiences-e35ed.web.app",
];
const corsOptions = {
    origin: (origin, callback) => {
        console.log("Request from: ", origin);
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
exports.default = corsOptions;
