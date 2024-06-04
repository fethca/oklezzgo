import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { SessionProvider } from './contexts/SessionContext.js'
import { SnackBarProvider } from './contexts/SnackbarContext.js'
import './style/main.css'
import { Footer } from './views/components/Footer.js'
import { NavBar } from './views/components/NavBar.js'
import { Catalog } from './views/pages/Catalog.js'
import { Login } from './views/pages/Login.js'

export function App() {
  return (
    <SessionProvider>
      <SnackBarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Catalog />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SnackBarProvider>
    </SessionProvider>
  )
}

function PrivateRoute() {
  // const session = useContext(SessionContext)
  // if (!session) return <Navigate to="/login" />
  // if (!session.brands.length) return <AuthError />
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  )
}
