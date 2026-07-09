import { Request, Response } from "express";
import { prisma } from "../lib/db";
import path from "path";
import fs from "fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function deleteOldPhoto(fotoUrl: string | null) {
    if (!fotoUrl) return;
    const filename = path.basename(fotoUrl);
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export const KaryawanController = {

    // GET ALL
    getAll: async (_req: Request, res: Response) => {
        try {
            const karyawan = await prisma.karyawan.findMany({
                orderBy: { nama: "asc" },
            });
            return res.status(200).json({ success: true, data: karyawan });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
        }
    },

    // GET BY ID
    getById: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const karyawan = await prisma.karyawan.findUnique({ where: { id } });
            if (!karyawan) return res.status(404).json({ success: false, message: "Karyawan tidak ditemukan" });
            return res.status(200).json({ success: true, data: karyawan });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
        }
    },

    // CREATE
    create: async (req: Request, res: Response) => {
        try {
            const { nama, jabatan, biografi, tglLahir, gender } = req.body;

            if (!nama || !jabatan || !gender) {
                if (req.file) deleteOldPhoto(`${BASE_URL}/uploads/${req.file.filename}`);
                return res.status(400).json({
                    success: false,
                    message: "Nama, jabatan, dan gender wajib diisi",
                });
            }

            const fotoUrl = req.file ? `${BASE_URL}/uploads/${req.file.filename}` : null;

            const karyawan = await prisma.karyawan.create({
                data: {
                    nama,
                    jabatan,
                    biografi: biografi || null,
                    tglLahir: tglLahir ? new Date(tglLahir) : null,
                    gender,
                    foto: fotoUrl,
                },
            });

            return res.status(201).json({
                success: true,
                message: "Data karyawan berhasil ditambahkan",
                data: karyawan,
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
            const { nama, jabatan, biografi, tglLahir, gender } = req.body;

            const existing = await prisma.karyawan.findUnique({ where: { id } });
            if (!existing) {
                if (req.file) deleteOldPhoto(`${BASE_URL}/uploads/${req.file.filename}`);
                return res.status(404).json({ success: false, message: "Karyawan tidak ditemukan" });
            }

            let fotoUrl = existing.foto;
            if (req.file) {
                deleteOldPhoto(existing.foto);
                fotoUrl = `${BASE_URL}/uploads/${req.file.filename}`;
            }
            if (req.body.hapus_foto === "true" && existing.foto) {
                deleteOldPhoto(existing.foto);
                fotoUrl = null;
            }

            const karyawan = await prisma.karyawan.update({
                where: { id },
                data: {
                    ...(nama && { nama }),
                    ...(jabatan && { jabatan }),
                    biografi: biografi ?? existing.biografi,
                    tglLahir: tglLahir ? new Date(tglLahir) : existing.tglLahir,
                    gender: gender ?? existing.gender,
                    foto: fotoUrl,
                },
            });

            return res.status(200).json({
                success: true,
                message: "Data karyawan berhasil diperbarui",
                data: karyawan,
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
            const existing = await prisma.karyawan.findUnique({ where: { id } });
            if (!existing) return res.status(404).json({ success: false, message: "Karyawan tidak ditemukan" });

            deleteOldPhoto(existing.foto);
            await prisma.karyawan.delete({ where: { id } });
            return res.status(200).json({ success: true, message: "Data karyawan berhasil dihapus" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
        }
    },
};