import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { SessionProvider, useSession } from './contexts/SessionContext.js'
import { SnackBarProvider } from './contexts/SnackbarContext.js'
import './style/main.css'
import { Footer } from './views/components/Footer.js'
import { NavBar } from './views/components/NavBar.js'
import { Catalog } from './views/pages/Catalog.js'
import { Login } from './views/pages/Login.js'
import { Signup } from './views/pages/Signup.js'
import { User } from './views/pages/User.js'

export function App() {
  return (
    <SessionProvider>
      <SnackBarProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Catalog />} />
              <Route path="/user/:id" element={<User />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SnackBarProvider>
    </SessionProvider>
  )
}

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  )
}

function PrivateRoute() {
  const session = useSession()

  if (!session) return <Navigate to="/login" />
  return <Outlet />
}
