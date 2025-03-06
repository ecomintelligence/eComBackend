"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
// import globalErrorHandler from './app/middlewares/globalErrorHandler'
// import routes from './app/routes'
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import notFound from './app/middlewares/notFound'
const config_1 = __importDefault(require("./app/config"));
const routes_1 = __importDefault(require("./app/routes"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const app = (0, express_1.default)();
// app.use((req, res, next) => {
//   const tenantId = req.headers['tenant-id'] || 'default'; // Use a header to identify tenant
//   req.tenantId = tenantId;
//   next();
// });
app.use((0, cors_1.default)({
    origin: [config_1.default.client_url],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Parser
// app.use(express.urlencoded({ extended: true }))
// app.use('/api/v1', express.json(), routes)
app.use('/api/v1', routes_1.default);
// Testing route
app.get('/', (req, res, next) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Welcome to the econintellicence API',
    });
});
// Global error handler
app.use(globalErrorhandler_1.default);
// Handle unmatched routes (404)
app.use('*', notFound_1.default);
exports.default = app;
