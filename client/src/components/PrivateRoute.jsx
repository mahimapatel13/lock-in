import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PrivateRoute(){
    const { loading, currentUser } = useAuth()

    console.log("Private route check... Current user is ? ..", currentUser)

    if (loading) return <div>Loading...</div>;

    return currentUser ? <Outlet/> : <Navigate to="/welcome" replace />;
}


 