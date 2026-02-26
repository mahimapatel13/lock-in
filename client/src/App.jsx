import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Room from "@/components/Room";
import AuthPage from "@/components/login/AuthPage";
import PrivateRoute from "@/components/PrivateRoute";
import { RoomProvider } from "@/context/RoomContext";
import Layout from './layouts/Layout';
import Leaderboard from './components/Leaderboard';
import LeaderboardLayout from './layouts/LeaderboardLayout';
import Report from './components/Report';

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
          <Route element={<LeaderboardLayout/>}>
           <Route path="/leaderboard" element= {<Leaderboard/>} />
          </Route>
           <Route element={<LeaderboardLayout/>}>
           <Route path="/report" element= {<Report/>} />
          </Route>
           <Route element={<LeaderboardLayout/>}>
           <Route path="/community" element= {<Leaderboard/>} />
          </Route>
        </Route>

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;