import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import agentRoutes from "./src/routes/agent.routes.js";
import firmRoutes from "./src/routes/firm.routes.js";
import transportRoutes from "./src/routes/transport.routes.js";
import qualityRoutes from "./src/routes/quality.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

const app = express();  

app.use(express.json());
app.use(cookieParser());


const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true,               
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],  
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle OPTIONS requests





app.use("/api/auth", authRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/firm", firmRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/quality", qualityRoutes);
app.use("/api/order", orderRoutes);


app.use(express.static(path.join(__dirname, "./frontend/dist")));



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


app.listen(PORT, () => {
  console.log("Server listening on port:", PORT);
  connectDB();
});
