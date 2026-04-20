import { useState } from "react"
import { useNavigate } from "react-router";
import { getUser, loginRequest } from "../services/api";
// import IconButton from "@mui/material/IconButton";
// import InputAdornment from "@mui/material/InputAdornment";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
import BackgroundLogin from "../components/BackgroundLogin";

import "../styles/login.css"
import TextField from "@mui/material/TextField";
import { Link } from "react-router";
import { Button } from "@mui/material";
// import { useSelector } from "react-redux";
// import type { RootState } from "../hooks/store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { authAction } from "../hooks/authSlice";
// import { useSelector } from "react-redux";
// import type { RootState } from "../hooks/store";

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // const userDetails = useSelector((state: RootState) => state.auth.user);

    // Navigate
    const navigate = useNavigate();

    // Dispatch
    const dispatch = useAppDispatch();

    const handleLogin = async () => {
        try {
            const res = await loginRequest(email, password);

            dispatch(authAction.setUser(res));
            localStorage.setItem("token", res.token);

            const resUserDetails = await getUser(email);
            dispatch(authAction.setUserDetails(resUserDetails));

            if (resUserDetails.user_role === "Customer") {
                navigate("/home");
            } else {
                navigate("/menu-list");
            }

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
                        <p>Welcome back, Twntiers</p>
                        <span>Log in to explore our cafe features and enjoy your experience</span>
                    </div>

                    {/* Form */}
                    <div className="wrapper-login-form">
                        <div className="form-login">
                            <TextField
                                label="E-Mail"
                                variant="outlined"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    marginBottom: "20px",
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
                                variant="outlined"
                                type="password"
                                // type={showPassword ? "text" : "password"}
                                fullWidth
                                required
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

                            // InputProps={{
                            //     endAdornment: (
                            //         <InputAdornment position="end">
                            //             <IconButton
                            //                 onClick={() => setShowPassword(!showPassword)}
                            //                 edge="end"
                            //                 sx={{ color: "#f5e6d3" }}
                            //             >
                            //                 {showPassword ? <VisibilityOff /> : <Visibility />}
                            //             </IconButton>
                            //         </InputAdornment>
                            //     ),
                            // }}
                            />

                        </div>
                    </div>
                    <div className="user-services">
                        <div className="wrapper-remember-me">
                            <input type="checkbox" name="remember-me" className="remember-me" />
                            <p>Remember me</p>
                        </div>
                        <p className="forgot-password"><Link to={"/forgot-password"}>Forgot Password?</Link></p>
                    </div>

                    <div className="login-actions">
                        <div className="wrapper-login-button">
                            <Button
                                variant="contained"
                                onClick={handleLogin}
                                className="button-login"
                                sx={{
                                    transition: "all 0.2s ease",
                                    backgroundColor: "white",
                                    color: "black",
                                    borderRadius: "10px",
                                    "&:hover": {
                                        transform: "scale(1.03)",
                                        backgroundColor: "var(--pumpkin-essence)"
                                    }
                                }}
                            >
                                Sign In
                            </Button>
                        </div>
                        <p className="title-register">Don't have an account?&nbsp;<a className="register-navigation" onClick={handleRegisterNavigation}> REGISTER NOW</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;