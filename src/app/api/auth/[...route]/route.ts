import { NextRequest, NextResponse } from "next/server";
import { auth } from "@@/services/";
import { handleApiError, verifySessionJWT, CustomError } from "@/lib/utils/ssrUtils";
import { getSession } from "@@/config";

async function signup(request: NextRequest): Promise<NextResponse> {
  const { email, password } = await request.json();

  if (!email || !password) {
    throw new CustomError("Email ou mot de passe manquant", 400);
  }

  const result = await auth.signupUserService(email, password);

  return NextResponse.json(
    {
      message: "Inscription réussie, veuillez confirmer votre email",
      emailConfirmed: result.emailConfirmed,
    },
    { status: 200 }
  );
}

async function confirmSignUp(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const redirectUrl = searchParams.get("redirectUrl");

  if (!token_hash || type !== "signup" || !redirectUrl) {
    throw new CustomError("Paramètres manquants ou invalides", 400);
  }

  const { accessToken, refreshToken } = await auth.verifyUserTokenSignUpService(
    token_hash as string
  );
  console.log(
    `${redirectUrl}#access_token=${accessToken}&refresh_token=${refreshToken}`
  );

  return NextResponse.redirect(
    `${redirectUrl}#access_token=${accessToken}&refresh_token=${refreshToken}`,
    { status: 302 }
  );
}

async function confirmSignUpFinalize(
  request: NextRequest
): Promise<NextResponse> {
  const { username, birthday_date, email, accessToken, refreshToken } =
    await request.json();

  if (!username || !birthday_date || !email || !accessToken || !refreshToken) {
    throw new CustomError("Données manquantes", 400);
  }

  const user = await auth.insertUserDataWithSessionService(
    accessToken,
    refreshToken,
    username,
    birthday_date,
    email
  );

  if (!user || !user.iduser) {
    throw new CustomError("Erreur lors de la finalisation du compte.", 500);
  }

  const response = NextResponse.json({});

  const session = await getSession(request, response);

  session.iduser = user.iduser;
  session.email = email;
  session.username = username;
  session.accessToken = accessToken;
  await session.save();

  return NextResponse.json(
    {
      message: "Compte créé avec succès !",
      user: { iduser: user.iduser, email, username },
      sessions: { iduser: user.iduser, email, username },
    },
    { status: 201, headers: response.headers }
  );
}

async function signin(request: NextRequest): Promise<NextResponse> {
  const { email, password } = await request.json();

  if (!email || !password) {
    throw new CustomError("Email et mot de passe requis", 400);
  }

  const { user, profile, accessToken } = await auth.loginUserService(
    email,
    password
  );

  const response = NextResponse.json({});

  const session = await getSession(request, response);

  session.iduser = user.id;
  session.email = profile.email;
  session.username = profile.username;
  session.accessToken = accessToken;
  await session.save();

  return NextResponse.json(
    {
      message: "Compte connecté avec succès",
      user: {
        iduser: user.id,
        email: profile.email || null,
        username: profile.username || null,
      },
      session: {
        iduser: session.iduser,
        email: session.email,
        username: session.username,
      },
    },
    { status: 200, headers: response.headers }
  );
}

async function me(request: NextRequest): Promise<NextResponse> {
  const response = new NextResponse();
  const decodedToken = await verifySessionJWT(request, response);
  const authenticatedUserId = decodedToken.sub;

  if (!authenticatedUserId) {
    throw new CustomError(
      "ID utilisateur non trouvé ou invalide dans le token.",
      401
    );
  }

  if (decodedToken?.email && decodedToken?.username && authenticatedUserId) {
    return NextResponse.json(
      {
        user: {
          email: decodedToken.email,
          iduser: authenticatedUserId,
          username: decodedToken.username || null,
        },
      },
      { status: 200, headers: response.headers }
    );
  }
  throw new CustomError("Session Invalide ou non trouvé", 401);
}

async function signout(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({});

  const session = await getSession(request, response);

  await session.destroy();

  return NextResponse.json(
    { message: "Déconnexion avec succès" },
    { status: 200, headers: response.headers }
  );
}

async function deleteUser(request: NextRequest): Promise<NextResponse> {
  const responseForSession = NextResponse.json({});

  const decodedToken = await verifySessionJWT(request, responseForSession);
  const authenticatedUserId = decodedToken.sub;

  if (!authenticatedUserId) {
    throw new CustomError(
      "ID utilisateur non trouvé ou invalide dans le token.",
      401
    );
  }

  const result = await auth.softDeleteUserService(
    authenticatedUserId as string
  );

  const session = await getSession(request, responseForSession);
  await session.destroy();

  return NextResponse.json(
    { message: result.message || "Compte supprimé avec succès." },
    { status: 200, headers: responseForSession.headers }
  );
}

async function forgetpassword(request: NextRequest): Promise<NextResponse> {
  const { email } = await request.json();

  if (!email) {
    throw new CustomError("Email requis", 400);
  }

  await auth.sendEmailResetPasswordService(email);

  return NextResponse.json(
    { message: "Email de réinitialisation envoyé" },
    { status: 200 }
  );
}

async function confirmRecovery(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const redirectUrl = searchParams.get("redirectUrl");

  if (!token_hash || type !== "recovery" || !redirectUrl) {
    throw new CustomError("Paramètres manquants ou invalides", 400);
  }
  console.log("🔑 Token reçu pour vérification :", token_hash);
  const session = await auth.confirmEmailOtpService(
    token_hash as string,
    type as string
  );
  console.log("✅ Email vérifié avec succès.");
  return NextResponse.redirect(
    `${redirectUrl}?access_token=${session.access_token}&refresh_token=${session.refresh_token}`,
    { status: 302 }
  );
}

async function newpassword(request: NextRequest): Promise<NextResponse> {
  const { accessToken, refreshToken, password } = await request.json();

  if (!accessToken || !refreshToken || !password) {
    throw new CustomError("Tokens et mot de passe requis", 400);
  }

  const result = await auth.updatePasswordService(
    accessToken,
    refreshToken,
    password
  );

  return NextResponse.json(
    { message: "Mot de passe changé avec succès", result },
    { status: 200 }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  try {
    const routePath = route.join("/");

    switch (routePath) {
      case "me":
        return await me(request);
      case "confirmsignup":
        return await confirmSignUp(request);
      case "confirmrecovery":
        return await confirmRecovery(request);

      default:
        throw new CustomError(
          `GET: Sous-route de l'auth non trouvée ou méthode non autorisée: /api/auth/${routePath}`,
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

    switch (routePath) {
      case "signup":
        return await signup(request);
      case "finalizesignup":
        return await confirmSignUpFinalize(request);
      case "signin":
        return await signin(request);
      case "signout":
        return await signout(request);
      case "forgetpassword":
        return await forgetpassword(request);
      case "newpassword":
        return await newpassword(request);
      default:
        throw new CustomError(
          `POST: Sous-route de l'auth non trouvée ou méthode non autorisée: /api/auth/${routePath}`,
          404
        );
    }
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

    if (routePath === "deleteuser") {
      return await deleteUser(request);
    } else {
      throw new CustomError(
        `PUT: Sous-route de l'auth non trouvée ou méthode non autorisée: /api/auth/${routePath}`,
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
    throw new CustomError(
      `DELETE: Méthode non autorisée sur /api/auth/${routePath}`,
      405
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
