import React from 'react'
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import router from './routes/router'
import 'react-toastify/dist/ReactToastify.css';
import Aos from 'aos';
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'
import AuthProvider from './ultilities/providers/AuthProvider';

const queryClient = new QueryClient()



Aos.init();
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
 <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    
  </AuthProvider>
     
)
