import { supabaseClient } from "@@/config";
import { CustomError } from "@@/utils/ssrUtils";

async function signupUserService(email: string, password: string) {
  const { data: authData, error: authError } =
    await supabaseClient.supabase.auth.signUp({
      email,
      password,
    });

  if (authError) {
    console.error("Erreur Supabase Signup:", authError.message);
    if (authError.message.toLowerCase().includes("user already registered")) {
      throw new CustomError("Email déjà utilisé", 409);
    }
    throw new CustomError(authError.message, 500);
  }

  const user = authData?.user;

  if (!user || !user.id) {
    throw new CustomError("Erreur lors de la création de l'utilisateur", 500);
  }

  const { data: freshUser, error: adminError } =
    await supabaseClient.supabaseAdmin.auth.admin.getUserById(user.id);

  if (adminError) {
    console.error("Erreur admin :", adminError.message);
    throw new CustomError("Erreur interne lors de la vérification", 500);
  }

  if (!freshUser?.user?.email_confirmed_at) {
    return { emailConfirmed: false };
  }

  return { emailConfirmed: true };
}

async function insertUserDataWithSessionService(
  accessToken: string,
  refreshToken: string,
  username: string,
  birthday_date: string,
  email: string
) {
  const supabaseToken =
    await supabaseClient.getSupabaseWithActiveSessionRefresh(
      accessToken,
      refreshToken
    );

  const {
    data: { user },
    error: userError,
  } = await supabaseToken.auth.getUser();

  if (userError || !user) {
    throw new CustomError("Utilisateur introuvable", 404);
  }

  if (email !== user.email) {
    throw new CustomError(
      "Email du body et du token ne correspondent pas",
      400
    );
  }


  const { data: existingUser } = await supabaseToken
    .from("Users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (existingUser) {
    throw new CustomError("Utilisateur déjà confirmé", 409);
  }


  const { error: insertError } = await supabaseToken.from("Users").insert([
    {
      id: user.id,
      username,
      birthday_date,
      email,
      created_at: new Date().toISOString(),
      last_active: user.last_sign_in_at,
    },
  ]);

  if (insertError) {
    console.error("🛑 Erreur Supabase insert:", insertError?.message);

    try {
      await deleteUserAuthService(user.id);
      console.log("🗑️ Utilisateur Auth supprimé après échec insertion.");
    } catch (cleanupError) {
      const cleanErrMsg =
        cleanupError instanceof Error
          ? cleanupError.message
          : String(cleanupError);
      console.error("Erreur suppression Auth :", cleanErrMsg);
    }

    throw new CustomError(
      "Erreur lors de l’insertion, utilisateur supprimé",
      500
    );
  }

  return {
    iduser: user.id,
  };
}

async function loginUserService(email: string, password: string) {
  const { data: authData, error: authError } =
    await supabaseClient.supabase.auth.signInWithPassword({ email, password });

  if (authError) {
    const message = authError.message.toLowerCase().includes("invalid login")
      ? "Email ou mot de passe incorrect"
      : authError.message;

    throw new CustomError(message, 401);
  }

  const user = authData.user;

  const access_token = authData.session?.access_token;

  if (!access_token) {
    throw new CustomError("Token de session introuvable", 500);
  }

  const { data: userProfile, error: profileError } =
    await supabaseClient.supabase
      .from("Users")
      .select("email,username")
      .eq("id", user.id)
      .single();

  if (profileError) {
    throw new CustomError(
      "Erreur lors de la récupération du profil utilisateur",
      500
    );
  }

  return { user, profile: userProfile, accessToken: access_token };
}

async function softDeleteUserService(userId: string) {
  const { error: deleteError } = await supabaseClient.supabaseAdmin
    .from("Users")
    .update({ is_deleted: true, delete_at: new Date().toISOString() })
    .eq("id", userId)
    .select();

  if (deleteError) {
    console.error("Erreur soft delete :", deleteError.message);
    throw new CustomError("Erreur lors de la suppression soft", 500);
  }

  const { error: logError } = await supabaseClient.supabaseAdmin
    .from("Cron_logs")
    .insert({
      user_id: userId,
      cron_name: "purge_users",
      status: "pending",
      message: "Suppression en attente",
    })
    .select();

  if (logError) {
    console.error("❌ Erreur création log :", logError.message);
    throw new CustomError(
      "Erreur lors de la création du log de suppression",
      500
    );
  }

  return { message: "Utilisateur marqué comme supprimé et log créé" };
}

async function deleteUserAuthService(userId: string) {
  const { error: deleteError } =
    await supabaseClient.supabaseAdmin.auth.admin.deleteUser(userId);

  if (deleteError) {
    console.error("🗑️ Erreur suppression Auth :", deleteError.message);
    throw new CustomError(
      "Erreur lors de la suppression de l'utilisateur",
      500
    );
  }

  return { message: "Utilisateur Supabase Auth supprimé avec succès" };
}

async function sendEmailResetPasswordService(email: string) {
  const { error: sendEmailError } = await
    supabaseClient.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://172.29.157.133/forgetpassword",
    });

  if (sendEmailError) {
    console.error("Erreur send Email reset password :", sendEmailError.message);
    throw new CustomError("Erreur de l'envoie de l'email à l'utilisateur", 500);
  }

  return {
    message: "Email de réinitialtion du mot de passe envoyé avec succès",
  };
}

async function confirmEmailOtpService(token_hash: string, type: string) {
  const { data: sessionData, error: verifyError } =
    await supabaseClient.supabase.auth.verifyOtp({
      type:type as "recovery",
      token_hash,
    });

  if (verifyError || !sessionData?.session?.access_token) {
    const verifyErrMsg =
      verifyError instanceof Error ? verifyError.message : String(verifyError);

    console.error("❌ Erreur verifyOtp Supabase :", verifyErrMsg);
    throw new CustomError("Token invalide ou expiré", 401);
  }

  console.log(
    "Session récupéré :",
    sessionData.session.access_token,
    sessionData.session.refresh_token
  );

  return sessionData.session;
}

async function updatePasswordService(
  accessToken: string,
  refreshToken: string,
  password: string
) {
  const supabaseWithSession =
    await supabaseClient.getSupabaseWithActiveSessionRefresh(
      accessToken,
      refreshToken
    );

  const { error: updateError } = await supabaseWithSession.auth.updateUser({
    password: password,
  });

  if (updateError) {
    console.error("🛑 Erreur Supabase update password :", updateError.message);
    throw new CustomError("Erreur lors de la mise à jour du mot de passe", 500);
  }

  return { message: "Mot de passe mis à jour" };
}

async function verifyUserTokenSignUpService(token_hash: string) {
  const { data, error } = await supabaseClient.supabase.auth.verifyOtp({
    type: "signup",
    token_hash,
  });

  if (error || !data.user) {
    console.error("Erreur vérification OTP :", error?.message);
    throw new CustomError("Token invalide ou expiré", 400);
  }

  return {
    user: data.user,
    accessToken: data.session?.access_token,
    refreshToken: data.session?.refresh_token,
  };
}

export {
  signupUserService,
  insertUserDataWithSessionService,
  loginUserService,
  softDeleteUserService,
  sendEmailResetPasswordService,
  confirmEmailOtpService,
  updatePasswordService,
  verifyUserTokenSignUpService,
};
