import { config } from "@keystone-6/core";
import { lists } from "./schema";
import { withAuth, session } from "./auth";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env["S3_BUCKET_NAME"] as string;
const accessKeyId = process.env["S3_ACCESS_KEY_ID"] as string;
const secretAccessKey = process.env["S3_SECRET_ACCESS_KEY"] as string;
const endpoint = process.env["S3_ENDPOINT"] as string;

console.log({ bucketName, accessKeyId, secretAccessKey, endpoint });

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      url: process.env["DATABASE_URL"] as string,
    },
    lists,
    session,
    storage: {
      local: {
        kind: "local",
        type: "file",
        generateUrl: (path) => `http://localhost:3000/pub/${path}`,
        serverRoute: {
          path: "/pub",
        },
        storagePath: "public/files",
      },
      s3: {
        kind: "s3",
        type: "file",
        region: "us-east-1",
        bucketName,
        accessKeyId,
        secretAccessKey,
        endpoint,
        signed: { expiry: 3600 },
      },
    },
  })
);
