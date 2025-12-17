// @@/utils/handleApiError.util.ts
import { NextResponse } from 'next/server';

import { CustomError } from './';

export default function handleApiError(error: unknown): NextResponse {
  const statusCode = error instanceof CustomError ? error.statusCode : 500;
  const errorMessage = error instanceof Error ? error.message : String(error);

  console.error("💥 Erreur API:", error instanceof Error ? error.stack || errorMessage : error);


  return NextResponse.json({
    error: errorMessage,
    details: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
  }, { status: statusCode });
}