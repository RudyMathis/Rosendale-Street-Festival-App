import Button from "../util/Button";
import Label from "../labels/UILabel.json";
import "../styles/Login.css";
import useLogin from "../hooks/UseLogin";

const Login: React.FC = () => {
    const {
        name,
        setName,
        password,
        setPassword,
        error,
        handleLogin,
    } = useLogin();

    return (
        <section className="login-container card">
            <h2>{Label.login.login}</h2>
            <form
                className="login-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
            >
                <div className="login-content">
                    <label className="login-label">
                        {Label.login.name}:
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="on"
                            placeholder="Enter your name"
                        />
                    </label>
                    <label className="login-label">
                        {Label.login.password}:
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </label>
                    {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                </div>
                <Button
                    label={Label.actions.submit}
                    className="submit-button"
                    type="submit"
                />
            </form>
        </section>
    );
};

export default Login;
