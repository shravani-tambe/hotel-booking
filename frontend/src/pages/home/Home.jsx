import React from "react";
import Hero from "./Hero";
import Blogs from "../blogs/Blogs";

const Home = () => {
  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="bg-white text-primary shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
        <Hero />
        <Blogs />
      </div>
    </div>
  );
};

export default Home;
