"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";

const Nav = () => {
  const [authProviders, setAuthProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const setProviders = async () => {
      const response = await getProviders();
      setAuthProviders(response);
    };
    setProviders();
  }, []);

  return (
    <nav className="w-full flex-between my-5">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="PromptMe logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">PromptMe</p>
      </Link>

      {/* Desktop navigation */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt" className="black_btn">
              Create Post
            </Link>
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="outline_btn"
            >
              Sign Out
            </button>
            <Link href="/profile" className="">
              <Image
                src={session?.user.image}
                alt="User profile picture"
                height={37}
                width={37}
                className="rounded-full"
              />
            </Link>
          </div>
        ) : (
          <>
            {authProviders &&
              Object.values(authProviders).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              alt="User profile picture"
              height={37}
              width={37}
              className="rounded-full"
              onClick={() => {
                setToggleDropdown((prev) => !prev);
              }}
            />
            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/create-prompt"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                    router.push("/");
                  }}
                  className="w-full mt-5 black_btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {authProviders &&
              Object.values(authProviders).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
