import Link from "next/link";
import HeaderSearchInput from "../HeaderSearchInput";
import { getAuthenticatedUserServerSide } from "@@/utils/ssrUtils";
import LogoutButton from "../LogoutButton";

export default async function Header() {
  const { isAuthenticated } = await getAuthenticatedUserServerSide();
  return (
    <header className="flex justify-between">
      <Link href="/">
        <h1 className="text-textColor text-[1.5625rem] my-4 font-bold tablet:text-[2.5rem] ">
          Météoland
        </h1>
      </Link>
      <div className="flex items-center justify-between gap-7">
        {/*<!-- SECTION 1 : Barre de recherche visible à partir de width:1024px -->*/}
        <div className="hidden lg:flex bg-background-grey rounded-3xl p-1">
          <HeaderSearchInput />
        </div>
        {/*<!------------------------------------------------->*/}
        <div className="flex gap-2.5 ml-4">
          {isAuthenticated ? (
            <>
              <Link href="/profil">
                <button className="px-2.5 tablet:py-2 py-1 rounded-full bg-button text-textColor text-[0.7rem] tablet:text-[1.2rem] font-medium no-underline">
                  Mon Profil
                </button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                className="px-2.5 py-1 tablet:py-2 rounded-full bg-button text-textColor text-[0.7rem] tablet:text-[1.2rem] font-medium no-underline"
                href="/signin"
              >
                Connexion
              </Link>
              <Link
                className="px-2.5 py-1 tablet:py-2 rounded-full bg-button text-textColor text-[0.7rem] tablet:text-[1.2rem] font-medium no-underline"
                href="/signup"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
