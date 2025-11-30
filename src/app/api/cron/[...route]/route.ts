
import { NextRequest, NextResponse } from "next/server";
import { handleApiError, CustomError } from "@/lib/utils/ssrUtils";

import { cleanupPendingUsersJob, purgeUsersJob } from "@@/services/crons";

const CRON_API_KEY = process.env.CRON_API_KEY;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  try {

    const authorizationHeader = request.headers.get("Authorization");

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new CustomError(
        "En-tête d'autorisation manquant ou mal formaté.",
        401
      );
    }

    const providedKey = authorizationHeader.split(" ")[1];
    if (!CRON_API_KEY || providedKey !== CRON_API_KEY) {
      throw new CustomError("Clé API de cron invalide.", 403);
    }

    const routePath = route.join("/");

    switch (routePath) {
      case "cleanup-pending-users":
        await cleanupPendingUsersJob();
        return NextResponse.json(
          { message: "Nettoyage des utilisateurs en attente déclenché." },
          { status: 200 }
        );
      case "purge-users":
        await purgeUsersJob();
        return NextResponse.json(
          { message: "Nettoyage des utilisateurs supprimés déclenché." },
          { status: 200 }
        );
      default:
        throw new CustomError(
          `POST: Tâche cron non trouvée pour /api/cron/${routePath}`,
          404
        );
    }
  } catch (error: unknown) {

    return handleApiError(error);
  }
}


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;

  const routePath = route.join("/");

  return handleApiError(
    new CustomError(
      `GET: Méthode non autorisée pour la tâche cron: /api/cron/${routePath}`,
      405
    )
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  try {
    const routePath = route.join("/");

    throw new CustomError(
      `PUT: Méthode non autorisée pour la tâche cron: /api/cron/${routePath}`,
      405
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;

  try {
    const routePath = route.join("/");
    throw new CustomError(
      `DELETE: Méthode non autorisée pour la tâche cron: /api/cron/${routePath}`,
      405
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
