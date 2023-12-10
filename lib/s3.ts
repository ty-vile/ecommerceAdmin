"use server";

// actions
import getCurrentUser from "@/app/actions/getCurrentUser";
// s3
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedS3Url(fileKey: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Not authenticated");
  }

  const PutS3ObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
  });

  const signedS3Url = await getSignedUrl(s3, PutS3ObjectCommand, {
    expiresIn: 60,
  });

  return signedS3Url;
}
