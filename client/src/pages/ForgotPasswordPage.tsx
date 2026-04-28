import { useState } from "react";
import "../styles/forgotpassword.css";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSendCode = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await fetch(
                `${BASE_URL}/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setMessage("Verification code sent to email");
            setStep(2);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await fetch(
                `${BASE_URL}/verify-reset-code`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, code })
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setMessage("Code verified ✅");
            setStep(3);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // STEP 3
    const handleResetPassword = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await fetch(
                `${BASE_URL}/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, code, password })
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setMessage("Password changed successfully 🎉");

            setTimeout(() => {
                window.location.href = "/";
            }, 1500);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page">
            <div className="forgot-card">

                <h1 className="forgot-title">Forgot Password</h1>
                <p className="forgot-subtitle">
                    Reset your account password
                </p>

                {/* STEP INDICATOR */}
                <div className="forgot-steps">
                    <span className={`forgot-step ${step >= 1 ? "active" : ""}`}>
                        1
                    </span>
                    <span className={`forgot-step ${step >= 2 ? "active" : ""}`}>
                        2
                    </span>
                    <span className={`forgot-step ${step >= 3 ? "active" : ""}`}>
                        3
                    </span>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <input
                            className="forgot-input"
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            className="forgot-btn"
                            onClick={handleSendCode}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Code"}
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <input
                            className="forgot-input"
                            type="text"
                            placeholder="Enter Code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button
                            className="forgot-btn"
                            onClick={handleVerifyCode}
                            disabled={loading}
                        >
                            {loading ? "Checking..." : "Verify Code"}
                        </button>
                    </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        <input
                            className="forgot-input"
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="forgot-btn"
                            onClick={handleResetPassword}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Reset Password"}
                        </button>
                    </>
                )}

                {message && (
                    <div className="forgot-msg">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}