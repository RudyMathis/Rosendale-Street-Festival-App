import { NavLink } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useRoleContext } from "../context/RoleContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../types/RoleType";
import useLabels from "../hooks/UseLabels";
import Button from "../util/Button";
import Label from "../labels/UILabel.json"
import "../styles/Navbar.css";
import "../styles/Login.css";

const Navbar: React.FC = () => {
    const { currentUser, setCurrentUser } = useUserContext(); // Access context state and setter
    const { differentDisplay } = useRoleContext();
    const navigate = useNavigate();
    const serverLabel = useLabels();

    // Logout logic
    function handleLogOut() {
        // Reset currentUser state in context
        setCurrentUser({ name: Label?.displayRole.level1 as UserRole, role: serverLabel?.role.level1 as UserRole, password: "" });

        // Clear currentUser from localStorage and set loggedIn to false
        localStorage.removeItem("currentUser");
        localStorage.setItem("loggedIn", "false");

        // Navigate to homepage
        navigate("/");
    }

    return (
        <section className="nav-container container-shadow" >
            <nav className="nav-links">
                <NavLink to="/">
                    <h1 className="link">Rosendale Street Festival</h1>
                </NavLink>
                <NavLink className="link" to="/create">{differentDisplay}</NavLink>
                {currentUser && currentUser.role === serverLabel.role.level4
                    ? 
                    <NavLink className="link" to="/members">Members Page</NavLink> 
                    : "" 
                }
            </nav>
            {currentUser && currentUser.role !== serverLabel?.role.level1 ? (
                <div className="nav-login-container">
                    <div className="nav-login-role-text">
                        <div className={`current-user-name ${currentUser.role}`}>
                            {currentUser.name}
                            <div className="popup-role">{currentUser.role}</div>
                        </div>
                    </div>
                    <Button 
                        label={Label.login.logout}
                        onClick={handleLogOut}
                        className="logout-button"
                        type="button"
                    />
                </div>
            ) : (
                <button className="nav-login-container">
                    <NavLink to="/login">{Label.login.login}</NavLink>
                </button>
            )}
        </section>
    );
};

export default Navbar;