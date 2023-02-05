import { FC, lazy, memo } from 'react'
import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Layout } from '../components/layout'
import {MyOrderListLayout} from "../components/layout/MyOrderListLayout";
import {AuthLayout} from "../components/layout/AuthLayout";

const Home = lazy<FC>(() => import('./home'))
const Catalog = lazy<FC>(() => import('./catalog'))
const Order = lazy<FC>(() => import('./order'))
const AddOrder = lazy<FC>(() => import('./add-order'))
const WishList = lazy<FC>(() => import('./wish-list'))
const Success = lazy<FC>(() => import('./success'))
const EditOrder = lazy<FC>(() => import('./edit-order'))
const MyPurchases = lazy<FC>(() => import('./my-purchases'))
const Registration = lazy<FC>(() => import('./registration'))


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
        element: <EditOrder />,
        path: 'edit-order/:id'
      },
      {
        element: <MyOrderListLayout />,
        path: '',
        children: [
          {
            element: <WishList />,
            path: 'wish-list'
          },
          {
            element: <MyPurchases />,
            path: 'my-purchases'
          },
        ]
      },
      {
        element: <AuthLayout/>,
        path: 'auth',
        children: [
          {
            element: <Registration />,
            path: 'registration'
          },
        ]
      },
      {
        element: <Success />,
        path: 'success'
      },
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