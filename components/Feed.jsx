"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PromptCard from "./PromptCard";

const Feed = () => {
  const { data: session } = useSession();
  const [searchText, setSearchText] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPrompts(data);
      setFilteredPrompts(data);
    };

    fetchPrompts();
  }, []);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchText(searchTerm);

    if (searchTerm === "") {
      setFilteredPrompts(prompts);
    } else {
      const filteredTag = prompts.filter(
        (prompt) =>
          prompt.tag.toLowerCase().includes(searchTerm) ||
          prompt.prompt.toLowerCase().includes(searchTerm) ||
          prompt.creator.username.toLowerCase().includes(searchTerm)
      );
      setFilteredPrompts(filteredTag);
    }
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);
    const filteredPromptsTags = prompts.filter((p) =>
      p.tag.toLowerCase().includes(tag)
    );
    setFilteredPrompts(filteredPromptsTags);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username..."
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <div className="mt-16 prompt_layout">
        {filteredPrompts.map((prompt) => (
          <PromptCard
            key={prompt._id}
            prompt={prompt}
            handleTagClick={() => handleTagClick(prompt.tag)}
          />
        ))}
      </div>
    </section>
  );
};

export default Feed;
