import { Navigate, Outlet } from "react-router";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
    role: string;
};

type Props = {
    allowedRoles: string[];
};

export default function ProtectedRoute({ allowedRoles }: Props) {
    const token = Cookies.get("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    let role = "";

    try {
        const decoded = jwtDecode<TokenPayload>(token);
        role = decoded.role;
    } catch {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    
    return <Outlet />;
}
