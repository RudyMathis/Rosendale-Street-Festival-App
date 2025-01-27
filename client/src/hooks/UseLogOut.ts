
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../types/RoleType";
import useLabels from "../hooks/UseLabels";
import Label from "../labels/UILabel.json"
import "../styles/Navbar.css";
import "../styles/Login.css";

// Logout logic
const useLogOut = (): { handleLogOut: () => void } => {
    const {setCurrentUser} = useUserContext(); // Access context state and setter
    const navigate = useNavigate();
    const serverLabel = useLabels();

    const handleLogOut = () => {

    // Reset currentUser state in context
    setCurrentUser({ name: Label?.displayRole.level1 as UserRole, role: serverLabel?.role.level1 as UserRole, password: "" });

    // Clear currentUser from localStorage and set loggedIn to false
    localStorage.removeItem("currentUser");
    localStorage.setItem("loggedIn", "false");

    // Navigate to homepage
    navigate("/");
    }
    return { handleLogOut };

}


export default useLogOut;