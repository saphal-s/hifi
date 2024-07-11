import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ChatHome from "./pages/ChatHome";

import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatHome />} />
          <Route path="/chat/:id" element={<ChatHome />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
