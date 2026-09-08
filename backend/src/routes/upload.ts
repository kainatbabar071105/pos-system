import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { put } from '@vercel/blob';
import { authenticate } from '../middleware/auth';

const router = Router();

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
const isVercel = process.env.VERCEL === '1';
const uploadDir = path.join(__dirname, '../../uploads');
if (!isVercel && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

// File filter (images only)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG images are allowed.'));
  }
};

const upload = multer({
  storage: blobToken || isVercel ? multer.memoryStorage() : storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// Upload single product image
router.post('/', authenticate, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (isVercel && !blobToken) {
      return res.status(503).json({
        error: 'Image uploads require BLOB_READ_WRITE_TOKEN in production',
      });
    }

    if (blobToken) {
      const blob = await put(`products/${req.file.filename}`, req.file.buffer, {
        access: 'public',
        contentType: req.file.mimetype,
        token: blobToken,
      });

      return res.json({
        success: true,
        imageUrl: blob.url,
        relativePath: blob.pathname,
        filename: req.file.filename,
        size: req.file.size,
      });
    }

    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol === 'https' ? 'https' : 'http';
    const relativeUrl = `/uploads/${req.file.filename}`;
    const fullUrl = `${protocol}://${host}${relativeUrl}`;

    res.json({
      success: true,
      imageUrl: fullUrl,
      relativePath: relativeUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
});

export default router;
