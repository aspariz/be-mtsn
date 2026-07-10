import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import beritaRoutes from "./routes/beritaRoute";
import categoryRoutes from "./routes/categoryRoute";
import uploadRoutes from "./routes/uploadRoutes";

import guruRoutes from "./routes/GuruRoutes";
import karyawanRoutes from "./routes/KaryawanRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://www.mtsnkotategal.site/',
        'mtsnkotategal.site/' // URL Frontend produksi Anda
    ],
    credentials: true
}));
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
    res.send("Server MTSN Kota Tegal is Running...");
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Kategori Routes
app.use("/api/kategori", categoryRoutes);

// Berita Routes
app.use("/api/berita", beritaRoutes);

// Sajikan folder public/uploads sebagai file statis
app.use("/uploads", express.static("public/uploads"));

// Route upload
app.use("/api/upload", uploadRoutes);

// Route Guru
app.use("/api/guru", guruRoutes);

// Route Karyawan
app.use("/api/karyawan", karyawanRoutes);


// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app;
