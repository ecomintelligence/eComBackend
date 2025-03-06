"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const verifyJWT_1 = require("../../utils/verifyJWT");
const masterUser_model_1 = require("../masterUser/masterUser.model");
const tenantDB_1 = require("../../database/tenantDB");
const mongoose_1 = __importDefault(require("mongoose"));
const signup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, phone, password, store_name } = payload;
    // master db name 
    const customObjectId = new mongoose_1.default.Types.ObjectId();
    const tenantId = `user_${customObjectId}`;
    // create master user 
    yield masterUser_model_1.MasterDBUser.create({ dbName: tenantId, userEmail: email });
    const tenantDbConnection = (0, tenantDB_1.getTenantConnection)(tenantId);
    // Reuse existing User Schema for this tenant
    const User = (0, user_model_1.getUserModel)(tenantDbConnection);
    const userData = {
        email,
        name,
        phone,
        store_name,
        password,
    };
    const newUser = yield User.create(userData);
    return newUser;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    const matchPassword = bcryptjs_1.default.compareSync(payload.password, user.password);
    //checking if the password is correct
    if (!matchPassword)
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password do not matched");
    //create token and sent to the  client
    const jwtPayload = {
        _id: user === null || user === void 0 ? void 0 : user._id.toString(),
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt.jwt_access_secret, config_1.default.jwt.jwt_access_expire_in);
    const refreshToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt.jwt_refresh_secret, config_1.default.jwt.jwt_refresh_expire_in);
    return {
        accessToken,
        refreshToken,
    };
});
const createAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verify = (0, verifyJWT_1.verifyToken)(refreshToken, config_1.default.jwt.jwt_refresh_secret || "default");
    if (!verify) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Invalid token");
    }
    const jwtPayload = {
        _id: verify === null || verify === void 0 ? void 0 : verify._id,
        name: verify === null || verify === void 0 ? void 0 : verify.name,
        email: verify.email,
        role: verify === null || verify === void 0 ? void 0 : verify.role,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt.jwt_access_secret, config_1.default.jwt.jwt_access_expire_in);
    return { accessToken };
});
exports.AuthServices = {
    signup,
    login,
    createAccessToken,
};
