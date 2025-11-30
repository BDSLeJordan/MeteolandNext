import { ApiResponse } from "@@/types/api";
async function signupUser(
  email: string,
): Promise<ApiResponse<{ emailConfirmed: boolean; emailSent: boolean }>> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email}),
    });

    const data = await res.json().catch(() => {});
    console.log(data);
    if (!res.ok) {
      const erroData = data;
      return {
      success: false,
      error: erroData.message,
      };
    }

    return {
      success: true,
      message: data.message,
      data: {emailConfirmed:data.emailConfirmed,emailSent:data.emailSent},
    };
  } catch (error: unknown) {
    const errMes = error instanceof Error ? error.message : String(error);
    console.error("Erreur lors de l'inscription côté client. ", error);
    return { success: false, error: errMes };
  }
}

async function finalizeSignUp(
  infos: object,
  accessToken: string,
  refreshToken: string
): Promise<ApiResponse<void>> {
  try {
    const res = await fetch("/api/auth/finalizesignup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...infos, accessToken, refreshToken }),
    });

    const data = await res.json().catch(() => {});

    if (!res.ok) {
      const erroData = data;
      return {
        success: false,
        error:
          erroData.error ||
          "Erreur inconnue lors de la finalisation de l'inscription.",
      };
    }

    console.log(data);
    return { success: true, message: data.message };
  } catch (error: unknown) {
    const errMes = error instanceof Error ? error.message : String(error);
    console.error(
      "Erreur lors de la finalisation de l'inscription côté client. ",
      errMes
    );
    return { success: false, error: errMes };
  }
}

async function signinUser(
  email: string,
  password: string
): Promise<ApiResponse<void>> {
  try {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => {});

    if (!res.ok) {
      const erroData = data;
      return {
        success: false,
        error: erroData.error || "Erreur inconnue lors de la connexion.",
      };
    }

    return { success: true, message: data.message };
  } catch (error: unknown) {
    const errMes = error instanceof Error ? error.message : String(error);
    console.error("Erreur lors de la connexion côté front. ", errMes);
    return {
      success: false,
      error: errMes,
    };
  }
}

async function sendResetPasswordEmail(
  email: string
): Promise<ApiResponse<void>> {
  try {
    const res = await fetch("/api/auth/forgetpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await res.json().catch(() => {});

    if (!res.ok) {
      const erroData = result;
      return {
        success: false,
        error:
          erroData.error ||
          "Erreur inconnue lors de l'envoie de l'email de reset du password.",
      };
    }

    return { success: true, message: result.message };
  } catch (error: unknown) {
    const errMes = error instanceof Error ? error.message : String(error);
    console.error(
      "Erreur lors de l'envoie d'email de reset du password côté front. ",
      errMes
    );
    return { success: false, error: errMes };
  }
}

async function newPasswordUser(
  accessToken: string,
  refreshToken: string,
  password: string
): Promise<ApiResponse<void>> {
  try {
    const res = await fetch("/api/auth/newpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken, password }),
    });

    const result = await res.json().catch(() => {});

    if (!res.ok) {
      const erroData = result;
      return {
        success: false,
        error:
          erroData.error || "Erreur inconnue lors du changement du password.",
      };
    }

    console.log(result);
    return { success: true, message: result.message };
  } catch (error: unknown) {
    const errMes = error instanceof Error ? error.message : String(error);
    console.error("Erreur lors du changement du password côté front. ", errMes);
    return { success: false, error: errMes };
  }
}

async function signoutUser(): Promise<ApiResponse<void>> {
  try {
    const res = await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "include",
    });

    const result = await res.json().catch(() => {});

    if (!res.ok) {
      const erroData = result;
      return {
        success: false,
        error: erroData.error || "Erreur inconnue lors de la déconnexion.",
      };
    }

    return { success: true, message: result.message };
  } catch (error: unknown) {
    const errMes = error instanceof Error ? error.message : String(error);
    console.error("Erreur lors de la déconnexion côté front. ", errMes);
    return { success: false, error: errMes };
  }
}

async function deleteAccountUser(): Promise<ApiResponse<void>> {
  try {
    const res = await fetch("/api/auth/deleteuser", {
      method: "POST",
      credentials: "include",
    });

    const result = await res.json().catch(() => {});

    if (!res.ok) {
      const erroData = result;
      return {
        success: false,
        error:
          erroData.error || "Erreur inconnue lors de la suppresion du compte.",
      };
    }

    return { success: true, message: result.message };
  } catch (error: unknown) {
    const errMes = error instanceof Error ? error.message : String(error);
    console.error(
      "Erreur lors de la suppression du compte côté front. ",
      errMes
    );
    return { success: false, error: errMes };
  }
}

async function checkUsernameAvailability(
  username: string
): Promise<ApiResponse<{ isAvailable: boolean }>> {
  try {
    const res = await fetch("/api/auth/checkusername", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(username),
    });

    const data = await res.json().catch(() => {});

    if (!res.ok) {
      const erroData = data;
      return {
        success: false,
        error:
          erroData.error ||
          "Erreur inconnue lors de la vérification de la disponibilité du nom d'utilisateur.",
      };
    }

    return {
      success: true,
      message: data.message,
      data: { isAvailable: data.isAvailable },
    };
  } catch (error: unknown) {
    const errMes = error instanceof Error ? error.message : String(error);
    console.error(
      "Erreur lors de la vérification de la disponibilité du nom d'utilisateur côté front. ",
      errMes
    );
    return { success: false, error: errMes };
  }
}

export {
  signupUser,
  finalizeSignUp,
  signinUser,
  sendResetPasswordEmail,
  newPasswordUser,
  signoutUser,
  deleteAccountUser,
  checkUsernameAvailability
};
