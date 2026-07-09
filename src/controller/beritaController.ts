import { Request, Response } from "express";
import { prisma } from "../lib/db";

export const BeritaController = {
// GET ALL BERITA
getAll: async (req: Request, res: Response) => {
try {
const berita = await prisma.berita.findMany({
include: {
kategori: true,
user: {
select: {
id: true,
nama: true,
email: true,
},
},
},
orderBy: {
createdAt: "desc",
},
});

  return res.status(200).json({
    success: true,
    data: berita,
  });
} catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan server",
  });
}


},

// GET BERITA BY SLUG
getBySlug: async (req: Request, res: Response) => {
try {
const { slug } = req.params;

  const berita = await prisma.berita.findUnique({
    where: {
      slug: slug as string,
    },
    include: {
      kategori: true,
      user: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  });

  if (!berita) {
    return res.status(404).json({
      success: false,
      message: "Berita tidak ditemukan",
    });
  }

  return res.status(200).json({
    success: true,
    data: berita,
  });
} catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan server",
  });
}

},

// CREATE BERITA
create: async (req: Request, res: Response) => {
try {
const {
judul,
ringkasan,
thumbnail,
isi,
kategoriId,
} = req.body;

  if (!judul || !isi || !kategoriId) {
    return res.status(400).json({
      success: false,
      message: "Judul, isi dan kategori wajib diisi",
    });
  }

  const slug = judul
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const userId = (req as any).user.id;

  const berita = await prisma.berita.create({
    data: {
      judul,
      slug,
      ringkasan,
      thumbnail,
      isi,
      kategoriId: Number(kategoriId),
      userId,
      published: true,
      publishedAt: new Date(),
    },
  });

  return res.status(201).json({
    success: true,
    message: "Berita berhasil dibuat",
    data: berita,
  });
} catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan server",
  });
}

},

// UPDATE BERITA
update: async (req: Request, res: Response) => {
try {
const id = Number(req.params.id);

  const {
    judul,
    ringkasan,
    thumbnail,
    isi,
    kategoriId,
  } = req.body;

  const slug = judul
    ? judul
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
    : undefined;

  const berita = await prisma.berita.update({
    where: {
      id,
    },
    data: {
      judul,
      slug,
      ringkasan,
      thumbnail,
      isi,
      kategoriId: kategoriId
        ? Number(kategoriId)
        : undefined,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Berita berhasil diupdate",
    data: berita,
  });
} catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan server",
  });
}

},

// DELETE BERITA
delete: async (req: Request, res: Response) => {
try {
const id = Number(req.params.id);

  await prisma.berita.delete({
    where: {
      id,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Berita berhasil dihapus",
  });
} catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan server",
  });
}


},
};
