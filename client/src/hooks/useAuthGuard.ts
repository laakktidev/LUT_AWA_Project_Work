import { useAuth } from "../context/AuthContext";
import { isTokenExpired } from "../utils/isTokenExpired";
//import { useNavigate } from "react-router-dom";

export function useAuthGuard() {
  const { token, logout } = useAuth();
  //const navigate = useNavigate();

  function guard() {
    if (!token || isTokenExpired(token)) {
      //logout();
      //navigate("/login");
      //setTimeout(() => logout(), 5000); // delay logout
      throw new Error("TOKEN_EXPIRED");
    }
    return token;
  }

  return guard;
}
