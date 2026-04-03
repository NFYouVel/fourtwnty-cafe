import { useState } from "react"
import { useNavigate } from "react-router";
import { loginRequest } from "../services/api";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import BackgroundLogin from "../components/BackgroundLogin";

import "../styles/login.css"
import TextField from "@mui/material/TextField";

function Login() {

    const [email, setEmail] = useState("")
    const [showPassword, setShowPassword] = useState(false);
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
                {/* Left Container */}
                <div className="container-coffee"></div>

                {/* Right Container */}
                <div className="wrapper-form">
                    {/* Logo */}
                    <div className="wrapper-login-logo">
                        <div className="login-logo"></div>
                    </div>
                    {/* Title */}
                    <div className="title-login">
                        <p>Welcome back Twntiers. Please Login To See Our Cafe's Feature</p>
                    </div>

                    {/* Form */}
                    <div className="wrapper-login-form">
                        <div className="form-login">
                            <TextField
                                label="E-mail"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    marginBottom: "16px",
                                    input: { color: "#fff" },
                                    label: { color: "#f5e6d3" },
                                    "& label.Mui-focused": {
                                        color: "#f5e6d3",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: "rgba(255,255,255,0.05)",
                                        "& fieldset": {
                                            borderColor: "#d2b48c",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#f5e6d3",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#f5e6d3",
                                            borderWidth: "2px",
                                        },
                                    },
                                }}
                            />

                            <TextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{
                                    input: { color: "#fff" },
                                    label: { color: "#f5e6d3" },
                                    "& label.Mui-focused": {
                                        color: "#f5e6d3",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: "rgba(255,255,255,0.05)",
                                        "& fieldset": {
                                            borderColor: "#d2b48c",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#f5e6d3",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#f5e6d3",
                                            borderWidth: "2px",
                                        },
                                    },
                                }}

                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: "#f5e6d3" }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
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