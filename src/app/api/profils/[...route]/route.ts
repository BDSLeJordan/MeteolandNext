import { NextRequest, NextResponse } from "next/server";
import { profils } from "@@/services";
import { handleApiError, verifySessionJWT, CustomError } from "@/lib/utils/ssrUtils";

async function getProfilInformation(
  request: NextRequest
): Promise<NextResponse> {
  const response = new NextResponse();
  const decodedToken = await verifySessionJWT(request, response);
  const authenticateUserId = decodedToken.sub;

  if (!authenticateUserId) {
    throw new CustomError("ID Utilisateur non trouvé dans le token JWT", 401);
  }

  const {data:userInfos} = await profils.getUserOwnInfosService(
    decodedToken.accessToken as string,
    authenticateUserId
  );
  // console.log(userProfile)
  if (!userInfos) {
    throw new CustomError("Profil utilisateur non trouvé", 404);
  }
  const userProfile = {
    username:userInfos.username,
    lastname: userInfos.lastname,
    firstname: userInfos.firstname,
    birthday_date: userInfos.birthday_date,
    email: userInfos.email,
    number_phone: userInfos.number_phone,
    location: userInfos.location
  }

  return NextResponse.json(
    { ...userProfile },
    { status: 200, headers: response.headers }
  );
}

async function setProfilInformation(
  request: NextRequest
): Promise<NextResponse> {
  const response = new NextResponse();
  const decodedToken = await verifySessionJWT(request, response);
  const authenticatedUserId = decodedToken.sub;

  if (!authenticatedUserId) {
    throw new CustomError("ID utilisateur non trouvé dans le token JWT.", 401);
  }

  const { userInfos } = await request.json();

  if (!userInfos) {
    throw new CustomError(
      "Données de profil manquantes pour la mise à jour.",
      400
    );
  }

  const { message, changeConfirmed } = await profils.setUsersInformationService(
    userInfos,
    decodedToken.accessToken as string,
    authenticatedUserId
  );

  return NextResponse.json(
    {
      message: message,
      changeConfirmed: changeConfirmed,
    },
    { status: 200, headers: response.headers }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  try {
    const routePath = route.join("/");

    if (routePath === "me") {
      return await getProfilInformation(request);
    } else {
      throw new CustomError(
        `GET: Sous-route du profil non trouvée ou méthode non autorisée: /api/profils/${routePath}`,
        404
      );
    }
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  try {
    const routePath = route.join("/");

    if (routePath === "addinfos") {

      return await setProfilInformation(request);
    } else {

      throw new CustomError(
        `PUT: Sous-route du profil non trouvée ou méthode non autorisée: /api/profils/${routePath}`,
        404
      );
    }
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  try {
    const routePath = route.join("/");

    throw new CustomError(
      `POST: Méthode non autorisée sur /api/profils/${routePath}`,
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
      `DELETE: Méthode non autorisée sur /api/profils/${routePath}`,
      405
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
