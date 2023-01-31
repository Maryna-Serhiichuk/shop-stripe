import { FC, lazy, memo } from 'react'
import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Layout } from '../components/layout'

const Home = lazy<FC>(() => import('./home'))
const Catalog = lazy<FC>(() => import('./catalog'))
const Order = lazy<FC>(() => import('./order'))
const AddOrder = lazy<FC>(() => import('./add-order'))
const ShoppingCart = lazy<FC>(() => import('./shopping-cart'))
const Success = lazy<FC>(() => import('./success'))

const routes: RouteObject[] = [
  {
    path: '',
    element: <Layout />,

    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        element: <Catalog />,
        path: 'catalog'
      },
      {
        element: <Order />,
        path: 'order/:id'
      },
      {
        element: <AddOrder />,
        path: 'add-order'
      },
      {
        element: <ShoppingCart />,
        path: 'shopping-cart'
      },
      {
        element: <Success />,
        path: 'success'
      }
    //   {
    //     element: <Post />,
    //     path: 'posts/:slug',
    //   },
    //   {
    //     element: <Home />,
    //     path: 'contact-us',
    //   },
    //   {
    //     element: <NotFound />,
    //     path: '*',
    //   },
    ],
  },
]

const Router = () => <RouterProvider router={createBrowserRouter(routes)} />

export default memo(Router)