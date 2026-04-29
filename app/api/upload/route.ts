import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

export async function GET(req: NextRequest) {
  const folder = req.nextUrl.searchParams.get('folder') || 'a1bk';
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(paramsToSign + API_SECRET).digest('hex');

  console.log('SECRET:', JSON.stringify(API_SECRET));
  console.log('STRING TO SIGN:', paramsToSign);
  console.log('SIGNATURE:', signature);

  return NextResponse.json({ cloudName: CLOUD_NAME, apiKey: API_KEY, timestamp, signature, folder });
}
