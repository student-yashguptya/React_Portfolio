import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./assets/Pages/Home").then(module => ({ default: module.Home })));
const NotFound = lazy(() => import("./assets/Pages/NotFound").then(module => ({ default: module.NotFound })));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-black text-white">Loading...</div>}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;