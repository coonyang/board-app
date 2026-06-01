import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const jsonResponse = await handleUpload({
    body,
    request: req,
    onBeforeGenerateToken: async () => {
      return {
        allowedContentTypes: ["image/*"],
      };
    },
  });

  return NextResponse.json(jsonResponse);
}
