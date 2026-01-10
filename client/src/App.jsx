import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from "@/layouts/DashboardLayout";
import Room from "@/components/Room";
import AuthPage from "@/components/login/AuthPage";
import PrivateRoute from "@/components/PrivateRoute";
import { RoomProvider } from "@/context/RoomContext";
import Layout from './layouts/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<AuthPage />} />
        
        <Route element={<PrivateRoute />}>
          <Route element={<RoomProvider><Layout/></RoomProvider>}>
            <Route path="/home" element={null} /> 
            <Route path="/room/:roomID" element={<Room />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;