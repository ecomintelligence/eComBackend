"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const store_controller_1 = require("./store.controller");
const router = express_1.default.Router();
router.post('/signup', store_controller_1.AuthControllers.signup);
exports.AuthRouter = router;
