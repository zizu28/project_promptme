"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@/components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    const fetchPrompt = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/prompts`);
      const data = await response.json();
      setPrompts(data);
    };
    if (session?.user.id) fetchPrompt();
  }, [session?.user.id]);

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

        if (response.ok) router.push("/");
      } catch (error) {
        console.error(error);
      }
      const filteredPost = prompts.filter((p) => p._id !== prompt._id);
      setPrompts(filteredPost);
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={prompts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
