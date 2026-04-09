import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loader from "./Components/Loader";

const Home = lazy(() => import("./assets/Pages/Home").then(module => ({ default: module.Home })));
const NotFound = lazy(() => import("./assets/Pages/NotFound").then(module => ({ default: module.NotFound })));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure the loader stays for at least 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
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