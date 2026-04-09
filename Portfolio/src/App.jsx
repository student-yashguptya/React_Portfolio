import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loader from './Components/Loader';
import { LottieCharacter } from './Components/LottieCharacter';

const Home     = lazy(() => import('./assets/Pages/Home').then(m => ({ default: m.Home })));
const NotFound = lazy(() => import('./assets/Pages/NotFound').then(m => ({ default: m.NotFound })));

const LOADER_DURATION = 3000;

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

  if (isLoading) return <Loader />;

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <LottieCharacter loaderDone={loaderDone} />
    </BrowserRouter>
  );
}

export default App;