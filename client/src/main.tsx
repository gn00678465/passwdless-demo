import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './MainLayout.tsx';
import WebAuthnContext from './WebAuthnContent.tsx';
import ErrorPage from './404.tsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <WebAuthnContext />
      </MainLayout>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: '/home',
    element: (
      <MainLayout>
        <p>Home</p>
      </MainLayout>
    ),
    errorElement: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
