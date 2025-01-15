import { NavLink } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useRoleContext } from "../context/RoleContext";
import { useNavigate } from "react-router-dom";
import useLabels from "../hooks/UseLabels";
import ErrorMessage from "../UI/ErrorMessage";
import "../styles/Navbar.css";
import "../styles/Login.css";

const Navbar: React.FC = () => {
    const { currentUser, setCurrentUser, isGuest } = useUserContext();
    const { differentDisplay } = useRoleContext();
    const navigate = useNavigate();
    const labels = useLabels();


    function handleLogOut() {
        setCurrentUser({ name: "Guest", role: "guest", password: "" });
        navigate("/");
    }

    if (!labels) {
        return <ErrorMessage />;
    }

    return (
        <section className="nav-container container-shadow" >
            <nav className="nav-links">
                <NavLink to="/">
                    <h1>Rosendale Street Festival</h1>
                </NavLink>
                <NavLink to="/create">{differentDisplay}</NavLink>
                {currentUser && currentUser.role === "admin" 
                    ? 
                    <NavLink to="/members">Members Page</NavLink> 
                    : "" 
                }
            </nav>
            {currentUser && !isGuest ? (
                <div className="login-container">
                    <div className="nav-login-content">
                        <div>{currentUser.name}</div>
                        <div>({currentUser.role})</div>
                    </div>
                    <button className="logout-button" onClick={handleLogOut}>{labels.login.logout}</button>
                </div>
            ) : (
                <div className="nav-login-container">
                    <NavLink to="/login">{labels.login.login}</NavLink>
                </div>
            )}
        </section>
    );
};

export default Navbar;
