import { Navigate } from "react-router-dom";

export default function ProtectedRoute({userLoggedIn, children}){
    console.log(userLoggedIn);
    
    if (!userLoggedIn){
        return (
            <Navigate to="/login" replace />
        )
    }

    return children;
}