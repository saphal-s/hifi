import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

const Home = () => {
  const [active, setActive] = useState(false);
  return (
    <div className="main">
      <div className="video-background">
        <video autoPlay loop muted>
          <source src="./vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay">
          {active ? (
            <Login setActive={setActive} />
          ) : (
            <>
              <h1 className="text-5xl font-bold mb-8">Welcome to HiFi.</h1>
              <Register setActive={setActive} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
