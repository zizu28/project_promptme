"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Profile from "@/components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [prompts, setPrompts] = useState([]);
  const searchParams = useSearchParams();

  const name = searchParams.get("name");

  useEffect(() => {
    const fetchPrompt = async () => {
      const response = await fetch(`/api/users/`);
      const data = await response.json();
      const filteredPrompts = data.filter(
        (prompt) => prompt.creator.username === name
      );
      setPrompts(filteredPrompts);
    };
    if (session?.user.id) fetchPrompt();
  }, [session?.user.id]);

  // const altName = prompts.every(
  //   (p) => p.creator.username === session?.user.username
  // );

  const handleEdit = async (prompt) => {
    router.push(`/update-prompt?id=${prompt._id}`);
  };
  const handleDelete = async (prompt) => {
    const hasConfirmed = confirm(
      `Are you sure you want to proceed with deleting prompt ${prompt._id}?`
    );
    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/prompt/${prompt._id.toString()}`, {
          method: "DELETE",
        });

        if (response.ok) router.push();
      } catch (error) {
        console.error(error);
      }
      const filteredPost = prompts.filter((p) => p._id !== prompt._id);
      setPrompts(filteredPost);
    }
  };

  return (
    <Profile
      // name={altName ? "My" : name}
      name={name}
      desc="Welcome to your personalized profile page"
      data={prompts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
