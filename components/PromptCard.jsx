"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const PromptCard = ({ prompt, handleTagClick, handleEdit, handleDelete }) => {
  const [copied, setCopied] = useState("");
  const router = useRouter();
  const pathName = usePathname();
  const { data: session } = useSession();

  const handleCopy = () => {
    setCopied(prompt.prompt);
    navigator.clipboard.writeText(prompt.prompt);
    setTimeout(() => setCopied(""), 3000);
  };

  const handleProfile = () => {
    router.push(
      `/profile/${prompt.creator._id}?name=${prompt.creator.username}`
    );
  };

  return (
    <div className="prompt_card">
      <div className="flex justify_between flex-start gap-5">
        <div className="flex justify-start items-center flex-1 gap-3 cursor-pointer">
          <Image
            src={prompt.creator.image}
            alt="user profile picture"
            width={40}
            height={40}
            className="rounded-full object-contain"
            onClick={handleProfile}
          />
          <div className="flex flex-col">
            <h3
              className="font-satoshi font-semibold text-gray-900"
              onClick={handleProfile}
            >
              {prompt.creator.username}
            </h3>
            <p
              className="font-inter text-sm text-gray-500"
              onClick={handleProfile}
            >
              {prompt.creator.email}
            </p>
          </div>
        </div>
        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={
              copied === prompt.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt="copy icon"
            width={12}
            height={12}
          />
        </div>
      </div>
      <p className="mt-5 font-satoshi text-sm text-gray-700">{prompt.prompt}</p>
      <p
        className="mt-2 font-inter cursor-pointer blue_gradient text-sm"
        onClick={handleTagClick}
      >
        {prompt.tag}
      </p>
      {session?.user.id === prompt.creator._id && pathName === "/profile" && (
        <div className="mt-5 flex-center gap-5 border-t border-gray-100 pt-3">
          <p
            className="font-inter green_gradient text-sm cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="font-inter orange_gradient text-sm cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
