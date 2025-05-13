import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import { App } from './App';
import './main.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer
        autoClose={3 * 1000}
        closeOnClick={false}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover
        position="top-center"
        rtl={false}
        transition={Bounce}
        />
    </BrowserRouter>
  </StrictMode>,
);
