import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  email: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Pastikan header ada dan diawali dengan "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Akses ditolak. Token tidak ditemukan.",
      });
      return;
    }

    // 2. Ambil token dari header (memisahkan kata "Bearer" dan tokennya)
    const token = authHeader.split(" ")[1];

    // 3. PENGECEKAN KETAT: Tolak token yang kosong atau berupa string "null"/"undefined"
    if (!token || token === "null" || token === "undefined") {
      res.status(401).json({
        success: false,
        message: "Akses ditolak. Token tidak valid atau kosong.",
      });
      return;
    }

    // 4. Verifikasi token menggunakan secret key dari .env
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // 5. Simpan payload token (id & email) ke dalam request
    (req as any).user = decoded;

    // 6. Lanjut ke controller (misal: create guru/karyawan)
    next();

  } catch (error) {
    // Tangkap error jika token kadaluarsa (expired) atau formatnya salah (malformed)
    console.error("Auth Error:", (error as Error).message);

    res.status(401).json({
      success: false,
      message: "Sesi Anda telah habis atau token tidak valid. Silakan login kembali.",
    });
  }
};