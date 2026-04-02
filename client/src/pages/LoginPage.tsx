import { useState } from "react"
import { useNavigate } from "react-router";
import { loginRequest } from "../services/api";

import BackgroundLogin from "../components/BackgroundLogin";

import "../styles/login.css"

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Navigate
    const navigate = useNavigate();
    // Selector
    // const userDetails = useSelector((state: RootState) => state.auth.user);
    // Dispatch
    // const dispatch = useAppDispatch();

    const handleLogin = async () => {
        try {
            const res = await loginRequest(email, password);
            // dispatch(authAction.setUser(res));
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRegisterNavigation = () => {
        navigate("/register")
    }

    return (
        <div className="login-page">
            <BackgroundLogin />
            <div className="wrapper-login">
                <div className="container-coffee"></div>
                <div className="wrapper-form">
                    <div className="wrapper-login-logo">
                        <div className="login-logo"></div>
                    </div>
                    <div className="wrapper-login-form">
                        <div className="form-login">
                            <input
                                type="email"
                                placeholder="ENTER EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="YOUR PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>


                    <div className="login-actions">
                        <a className="logincard-navigation" onClick={handleRegisterNavigation}>REGISTER NOW</a>
                        <button onClick={handleLogin} className="button-login">ENTER</button>
                        <a className="logincard-navigation">FORGOT PASSWORD?</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;