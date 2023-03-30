import React from "react";
import VideoPlayer from "../components/VideoPlayer";

const Home = () => {
  return (
    <div>
      <h1 className="bg-blue-500 text-white font-bold p-4">Video Player</h1>
      <VideoPlayer />
    </div>
  );
};

export default Home;
