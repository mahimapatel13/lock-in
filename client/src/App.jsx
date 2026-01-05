import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import DashboardLayout from "@/layouts/DashboardLayout"
import Room from "@/components/Room"
import AuthPage from "@/components/login/AuthPage"
import PrivateRoute from "@/components/PrivateRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={<AuthPage />} />

        {/* Protected Dashboard Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            {/* These children fill the <Outlet /> in DashboardLayout */}
            <Route path="/home" element={<div></div>} />
            <Route path="/room/create" element={<Room />} />
            <Route path="/room/:roomID" element={<Room />} />
            
            {/* Redirect / to /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>

    </BrowserRouter>
  )
}

export default App