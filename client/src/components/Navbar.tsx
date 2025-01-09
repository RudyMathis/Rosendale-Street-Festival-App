import { NavLink } from "react-router-dom";
import { useUserContext } from "./context/UserContext";
import { useRoleContext } from "./context/RoleContext";
import { useNavigate } from "react-router-dom";
import Label from "../labels/formLabels.json";

const Navbar: React.FC = () => {
    const { currentUser, setCurrentUser, isGuest } = useUserContext();
    const { differentDisplay } = useRoleContext();
    const navigate = useNavigate();


    function handleLogOut() {
        setCurrentUser({ name: "Guest", role: "guest", password: "" });
        navigate("/");
    }

    return (
        <section className="nav-container container-shadow">
            <nav className="nav-links">
                <NavLink to="/">
                    <h1>Rosendale Street Festival</h1>
                </NavLink>
                <NavLink to="/create">{differentDisplay}</NavLink>
            </nav>
            {currentUser && !isGuest ? (
                <div className="login-container">
                    <div className="nav-login-content">
                        <div>{currentUser.name}</div>
                        <div>({currentUser.role})</div>
                    </div>
                    <button className="logout-button" onClick={handleLogOut}>{Label.login.logout}</button>
                </div>
            ) : (
                <div className="nav-login-container">
                    <NavLink to="/login">{Label.login.login}</NavLink>
                </div>
            )}
        </section>
    );
};

export default Navbar;
