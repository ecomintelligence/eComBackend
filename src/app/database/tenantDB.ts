import mongoose, { Connection } from "mongoose";
import config from "../config";

// Tenant Connection Cache
const tenantConnections: { [key: string]: Connection } = {};

// **Reusable Function to Get or Create Tenant DB Connection**
export const getTenantConnection = (tenantId: string): Connection => {
  if (!tenantConnections[tenantId]) {
    const tenantDbUri = `${config.db.base_db_url}/${tenantId}`;
    console.log(`🔗 Connecting to: ${tenantDbUri}`);

    const connection = mongoose.createConnection(tenantDbUri);
    
    connection.on("connected", () => console.log(`✅ Connected to DB: ${tenantId}`));
    connection.on("error", (err) => console.error(`❌ DB Error (${tenantId}):`, err));

    tenantConnections[tenantId] = connection;
  }
  return tenantConnections[tenantId];
};