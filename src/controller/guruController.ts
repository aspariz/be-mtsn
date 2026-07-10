import { Request, Response } from "express";
import { prisma } from "../lib/db";
import path from "path";
import fs from "fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Helper: hapus file foto lama dari disk
function deleteOldPhoto(fotoUrl: string | null) {
  if (!fotoUrl) return;
  const filename = path.basename(fotoUrl);
  const filePath = path.join(process.cwd(), "public", "uploads", filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export const GuruController = {

  // GET ALL
  getAll: async (_req: Request, res: Response) => {
    try {
      const guru = await prisma.guru.findMany({
        orderBy: { nama: "asc" },
      });
      return res.status(200).json({ success: true, data: guru });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
  },

  // GET BY ID
  getById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const guru = await prisma.guru.findUnique({ where: { id } });
      if (!guru) return res.status(404).json({ success: false, message: "Guru tidak ditemukan" });
      return res.status(200).json({ success: true, data: guru });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
  },

  // CREATE
  create: async (req: Request, res: Response) => {
    try {
      const { nama, mapel, biografi, tglLahir, gender } = req.body;

      if (!nama || !mapel || !gender) {
        // Hapus file yang sudah terupload jika validasi gagal
        if (req.file) deleteOldPhoto(`${BASE_URL}/uploads/${req.file.filename}`);
        return res.status(400).json({
          success: false,
          message: "Nama, mata pelajaran, dan gender wajib diisi",
        });
      }

      const fotoUrl = req.file
        ? `${BASE_URL}/uploads/${req.file.filename}`
        : null;

      const guru = await prisma.guru.create({
        data: {
          nama,
          mapel,
          biografi: biografi || null,
          tglLahir: tglLahir ? new Date(tglLahir) : null,
          gender,
          foto: fotoUrl,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Data guru berhasil ditambahkan",
        data: guru,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
  },

  // UPDATE
  update: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nama, mapel, biografi, tglLahir, gender } = req.body;

      const existing = await prisma.guru.findUnique({ where: { id } });
      if (!existing) {
        if (req.file) deleteOldPhoto(`${BASE_URL}/uploads/${req.file.filename}`);
        return res.status(404).json({ success: false, message: "Guru tidak ditemukan" });
      }

      // Kalau ada foto baru, hapus foto lama
      let fotoUrl = existing.foto;
      if (req.file) {
        deleteOldPhoto(existing.foto);
        fotoUrl = `${BASE_URL}/uploads/${req.file.filename}`;
      }

      // Kalau client kirim hapus_foto=true, hapus foto
      if (req.body.hapus_foto === "true" && existing.foto) {
        deleteOldPhoto(existing.foto);
        fotoUrl = null;
      }

      const guru = await prisma.guru.update({
        where: { id },
        data: {
          ...(nama && { nama }),
          ...(mapel && { mapel }),
          biografi: biografi ?? existing.biografi,
          tglLahir: tglLahir ? new Date(tglLahir) : existing.tglLahir,
          gender: gender ?? existing.gender,
          foto: fotoUrl,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Data guru berhasil diperbarui",
        data: guru,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
  },

  // DELETE
  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const existing = await prisma.guru.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ success: false, message: "Guru tidak ditemukan" });

      // Hapus foto dari disk
      deleteOldPhoto(existing.foto);

      await prisma.guru.delete({ where: { id } });
      return res.status(200).json({ success: true, message: "Data guru berhasil dihapus" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
  },
};