"use server";

// actions
import getCurrentUser from "@/app/actions/getCurrentUser";
// s3
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { uuid } from "uuidv4";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// file upload rules
const acceptedFileTypes = ["image/jpg", "image/jpeg", "image/png"]; // file types match the accept prop on file input in client form
const maxFileSize = 2 * 1024 * 1024; // 2mb

export async function getSignedS3Url(
  fileKey: string,
  type: string,
  size: number,
  checkSum: string
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Not authenticated");
  }

  if (size > maxFileSize) {
    throw new Error("File too large");
  }

  if (!acceptedFileTypes.includes(type)) {
    throw new Error("Invalid file type");
  }

  const PutS3ObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey + uuid(),
    ContentLength: size,
    ChecksumSHA256: checkSum,
    Metadata: {
      userId: currentUser.id!,
    },
  });

  const signedS3Url = await getSignedUrl(s3, PutS3ObjectCommand, {
    expiresIn: 60,
  });

  return signedS3Url;
}
