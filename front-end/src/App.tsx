import React, {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from 'react';
import './index.css'
import './App.css';
import 'antd/dist/antd.css';
import Router from './pages/index'
import {Customer} from "./types/types";
import {instance as axios} from "./request/axios";

type AppProps = {
  auth: { me: Customer | undefined, authenticated: boolean }
}

const defaultValue = {
  auth: { me: undefined, authenticated: false }
}

const Context = createContext<AppProps>(defaultValue)

type ContextProviderProps = PropsWithChildren<Partial<AppProps>>

const ContextProvider: FC<ContextProviderProps> = ({ children, ...props }) => {
  const [me, setMe] = useState<Customer|undefined>(undefined)

  useEffect(() => {
    axios.get('me')
        .then(res => setMe(res.data))
        .catch(err => console.log(err))
  }, [])

  return <Context.Provider value={{ ...defaultValue, auth: { me, authenticated: true } }}>
    {children}
  </Context.Provider>
}

function App() {
  return <ContextProvider>
    <Router/>
  </ContextProvider>
}

const useApp = () => useContext<AppProps>(Context)

export { App as default, useApp };
