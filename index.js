"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cors_config_1 = __importDefault(require("./config/cors.config"));
const database_config_1 = __importDefault(require("./config/database.config"));
const router_config_1 = __importDefault(require("./config/router.config"));
require("dotenv").config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware for parsing application/json
app.use(body_parser_1.default.json());
// Middleware for parsing application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(cors_config_1.default));
(0, router_config_1.default)(app);
(0, database_config_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
