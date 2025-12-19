// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { RestaurantApp, ModulesProvider } from "@M-M-Tech-House/enode-restaurant-client-package"
import "@M-M-Tech-House/enode-restaurant-client-package/style.css";

function App() {
  return (
    <ModulesProvider>
      <RestaurantApp config={{
        authHost: import.meta.env.VITE_AUTH_HOST,
        withCredentials: JSON.parse(import.meta.env.VITE_WITH_CREDENTIALS),
        defaultCurrencyType: import.meta.env.VITE_DEFAULT_CURRENCY_TYPE,
        defaultCurrencyLocal: import.meta.env.VITE_DEFAULT_CURRENCY_LOCAL
      }} />
    </ModulesProvider>
  )
}

export default App
