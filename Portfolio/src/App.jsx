import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loader from './Components/loader';
import { LottieCharacter } from './Components/lottiecharacter';
import { LoaderCharacter } from './Components/loadercharacter';
import CustomCursor from './Components/customcursor';

const Home     = lazy(() => import('./assets/Pages/home').then(m => ({ default: m.Home })));
const NotFound = lazy(() => import('./assets/Pages/notfound').then(m => ({ default: m.NotFound })));

const LOADER_DURATION = 4500;

function App() {
  const [isLoading,  setIsLoading]  = useState(true);
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setIsLoading(false);
      const t2 = setTimeout(() => setLoaderDone(true), 120);
      return () => clearTimeout(t2);
    }, LOADER_DURATION);
    return () => clearTimeout(t1);
  }, []);

  return (
    <BrowserRouter>
      {isLoading && (
        <>
          <Loader />
          <LoaderCharacter isLoading={isLoading} />
        </>
      )}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <LottieCharacter loaderDone={loaderDone} />
      <CustomCursor />
    </BrowserRouter>
  );
}

export default App;