import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import DashboardLayout from "@/layouts/DashboardLayout"
import CreateRoom from "@/components/CreateRoom"
import Room from "@/components/Room"
import AuthForm from "@/components/login/AuthForm"
import PrivateRoute from "@/components/PrivateRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthForm />} />

        {/* Protected Dashboard Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            {/* These children fill the <Outlet /> in DashboardLayout */}
            <Route path="/home" element={<div>Home</div>} />
            <Route path="/room/create" element={<CreateRoom />} />
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