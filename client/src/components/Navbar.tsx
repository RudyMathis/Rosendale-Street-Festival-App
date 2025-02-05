import { NavLink } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useRoleContext } from "../context/RoleContext";
import useLabels from "../hooks/UseLabels";
import useLogOut from "../hooks/UseLogOut";
import Button from "../util/Button";
import Label from "../labels/UILabel.json"
import "../styles/Navbar.css";
import "../styles/Login.css";

const Navbar: React.FC = () => {
    const { currentUser } = useUserContext(); // Access context state and setter
    const { differentDisplay } = useRoleContext();
    const serverLabel = useLabels();
    const { handleLogOut } = useLogOut();

    return (
        <section className="nav-container card">
            <nav className="nav-links">
                <NavLink to="/">
                    <h1 className="link">{Label.navBar.title}</h1>
                </NavLink>
                <NavLink className="link" to="/create">{differentDisplay}</NavLink>
                    {currentUser && (
                        <>
                            {currentUser.role === serverLabel.role.level3[0] && (
                                <NavLink className="link" to="/upload">{Label.navBar.upload}</NavLink>
                            )}
                            {currentUser.role === serverLabel.role.level4[0] && (
                                <>
                                    <NavLink className="link" to="/members">{Label.navBar.members}</NavLink>
                                    <NavLink className="link" to="/upload">{Label.navBar.upload}</NavLink>
                                </>
                            )}
                        </>
                    )}

            </nav>
            {currentUser && currentUser.role !== serverLabel?.role.level1[0] ? (
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