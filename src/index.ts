import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import beritaRoutes from "./routes/beritaRoute";
import categoryRoutes from "./routes/categoryRoute";

// Inisialisasi dotenv agar bisa baca file .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Daftarkan Route Berita
// Jadi nanti aksesnya: http://localhost:3000/api/berita
app.use("/api", beritaRoutes);
app.use("/api", categoryRoutes);

// Jalankan Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Export app untuk kebutuhan Vercel (Serverless Functions)
export default app;