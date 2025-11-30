// src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { getSession, sessionOptions } from "@@/config";
import { verifySessionJWT } from "@/lib/utils/ssrUtils";

// Extrait les attributs du cookie directement de votre configuration Iron Session
const COOKIE_NAME = sessionOptions.cookieName;
const COOKIE_PATH = sessionOptions.cookieOptions?.path || "/"; // Utilise le path défini ou '/' par défaut
const COOKIE_SECURE = sessionOptions.cookieOptions?.secure; // Dépend de NODE_ENV en production
const COOKIE_SAMESITE = sessionOptions.cookieOptions?.sameSite; // Utilise le sameSite défini
const COOKIE_DOMAIN_FROM_CONFIG = sessionOptions.cookieOptions?.domain; // Récupère le domaine s'il est défini

const protectedPages = ["/favorites", "/profil","subscribe"];
const publicAuthPages = ["/signin","/finalizesignup", "/signup", "/forgetpassword", "/newpassword", "/confirmresetpassword","/premium",];

export async function middleware(request: NextRequest) {
  const responseBase = NextResponse.next(); 
  const { pathname } = request.nextUrl;
  let isAuthenticated = false;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/.well-known") ||
    pathname.startsWith("/weather") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next(); 
  }

  let sessionWasInvalid = false;
  const isPublicAuthPage = publicAuthPages.includes(pathname);
  if (!isPublicAuthPage) {
    try {
      await verifySessionJWT(request, responseBase);
      isAuthenticated = true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(
        `Middleware: Échec de la vérification du JWT pour "${pathname}" : ${errorMessage}.`
      );
      isAuthenticated = false;
      sessionWasInvalid = true;

      const session = await getSession(request, responseBase);
      if (session.accessToken || Object.keys(session).length > 0) {
        console.log(
          "Middleware: Destruction de la session par Iron Session (nettoyage côté serveur)."
        );
        session.destroy();
        await session.save();
      }
    }
  }else {
    isAuthenticated = false;
    try {
      await verifySessionJWT(request, responseBase);
      isAuthenticated = true;
    } catch (error) {
      console.log(error)
    }
  }

  let finalResponse: NextResponse;
  let redirectTo: string | null = null;

  if (isAuthenticated) {
    if (isPublicAuthPage) {
      console.log(
        `Middleware: Authentifié sur "${pathname}". Redirection vers /profil.`
      );
      redirectTo = "/profil";
    }
  } else { 
    if (protectedPages.includes(pathname)) {
      console.log(
        `Middleware: Non authentifié sur "${pathname}". Redirection vers /signin.`
      );
      redirectTo = "/signin";
    }
  }

  if (redirectTo) {
    finalResponse = NextResponse.redirect(new URL(redirectTo, request.url));

    if (!isAuthenticated || sessionWasInvalid) {
      let setCookieHeader = `${COOKIE_NAME}=; Max-Age=0; Path=${COOKIE_PATH}; Expires=${new Date(0).toUTCString()}`;
      
      if (COOKIE_SECURE) {
          setCookieHeader += '; Secure';
      }
      if (COOKIE_SAMESITE && COOKIE_SAMESITE !== 'none') {
        setCookieHeader += `; SameSite=${COOKIE_SAMESITE}`;
      } else if (COOKIE_SAMESITE === 'none' && COOKIE_SECURE) {
        setCookieHeader += `; SameSite=None`;
      }
      if (COOKIE_DOMAIN_FROM_CONFIG) { 
          setCookieHeader += `; Domain=${COOKIE_DOMAIN_FROM_CONFIG}`;
      }
      setCookieHeader += `; HttpOnly`; 

      console.log(`Middleware: Ajout manuel du Set-Cookie pour suppression: ${setCookieHeader}`);
      finalResponse.headers.set('Set-Cookie', setCookieHeader);
    }
  } else {
    finalResponse = responseBase;
  }

  return finalResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};