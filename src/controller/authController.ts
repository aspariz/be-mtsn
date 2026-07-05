import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/db";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nama, email, password } = req.body;


    if (!nama || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Email sudah digunakan",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: "Register berhasil",
      data: {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
      },
    });


  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });


  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "2d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
      },
    });


  } catch (error) {
    console.error("Login Error:", error);


    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });


  }
};

export const me = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;


    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error(error);


    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });


  }
};
