import { supabaseClient } from "@@/config";
import { CustomError } from "@@/utils/ssrUtils";

async function getUserOwnInfosService(token: string, iduser: string) {
  const supabaseToken = await supabaseClient.getSupabaseWithToken(token);

  const { data, error } = await supabaseToken
    .from("Users")
    .select("*")
    .eq("id", iduser)
    .single();

  if (error) {
    throw new CustomError("Erreur model récupération info user", 500);
  }

  return { data };
}

async function setUsersInformationService(
  userInfos: Record<string, string>,
  token: string,
  iduser: string
) {
  const supabaseToken = await supabaseClient.getSupabaseWithToken(token);
  const { data: emailchange, error: changeError } = await supabaseToken
    .from("Users")
    .select("birthday_date")
    .eq("id", iduser)
    .single();

  // console.log(changeError)
  if (changeError)
    throw new CustomError(
      "Erreur lors de la récupération de la date de naissance",
      500
    );

  let changeConfirmed = false;
  const updateObj: Record<string, string> = {};
  if ("username" in userInfos) updateObj.username = userInfos.username;
  if ("lastname" in userInfos) updateObj.lastname = userInfos.lastname;
  if ("firstname" in userInfos) updateObj.firstname = userInfos.firstname;

  if (
    "birthdayDate" in userInfos &&
    emailchange.birthday_date !== userInfos.birthdayDate
  ) {
    updateObj.birthday_date = userInfos.birthdayDate;
  }

  if ("phoneNumber" in userInfos)
    updateObj.number_phone = userInfos.phoneNumber;
  if ("location" in userInfos) updateObj.location = userInfos.location;


  if (Object.keys(updateObj).length === 0) {
    throw new Error("Aucune donnée à mettre à jour");
  } else {
    changeConfirmed = true;
  }

  const { error } = await supabaseToken
    .from("Users")
    .update(updateObj)
    .eq("id", iduser)
    .single();

  if (error) {
    console.error("Erreur model modification user infos :", error.message);
    throw new Error("Erreur modification user infos");
  }

  return {
    message: "Modification réussit !",
    changeConfirmed: changeConfirmed,
  };
}

export {getUserOwnInfosService,setUsersInformationService}
