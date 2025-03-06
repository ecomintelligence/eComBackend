"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
// Tenant Connection Cache
const tenantConnections = {};
// **Reusable Function to Get or Create Tenant DB Connection**
const getTenantConnection = (tenantId) => {
    if (!tenantConnections[tenantId]) {
        const tenantDbUri = `${config_1.default.db.base_db_url}/${tenantId}`;
        console.log(`🔗 Connecting to: ${tenantDbUri}`);
        const connection = mongoose_1.default.createConnection(tenantDbUri);
        connection.on("connected", () => console.log(`✅ Connected to DB: ${tenantId}`));
        connection.on("error", (err) => console.error(`❌ DB Error (${tenantId}):`, err));
        tenantConnections[tenantId] = connection;
    }
    return tenantConnections[tenantId];
};
exports.getTenantConnection = getTenantConnection;
