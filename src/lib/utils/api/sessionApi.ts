import { ApiResponse,SessionData } from "@@/types/api";
export default async function checkSession(): Promise<ApiResponse<SessionData>> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });
console.log(res)
    const data = await res.json().catch(() => {});

    if (!res.ok) {
      const errorData = data;
      return {
        success: false,
        error: errorData.message || "Session invalide ou non authentifiée.",
        data: { isAuthenticated:false,session: false },
      };
    }


    return {
      success: true,
      message: "Session authentifiée",
      data: {
        isAuthenticated:true,
        session: true,
        user: data.user,
      },
    };
  } catch (error: unknown) {
    const errMes = error instanceof Error ? error.message : String(error);
    console.error(
      "Erreur lors de la vérification de session côté client",
      error
    );
    return { success: false, error: errMes, data: { isAuthenticated:false,session: false } };
  }
}
