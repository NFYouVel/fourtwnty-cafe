// ==========================================
// ForgotPasswordPage.tsx
// FULL FLOW:
// 1. Input Email
// 2. Verify Code
// 3. Reset Password
// ==========================================

import { useState } from "react";
import "../styles/forgotPassword.css";

const BASE_URL = "http://localhost:5000/api/auth";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // STEP 1
    const handleSendCode = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await fetch(
                `${BASE_URL}/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        email
                    })
                }
            );

            const data = await res.json();

            if (!res.ok)
                throw new Error(data.message);

            setMessage(
                "Verification code sent to email ✉️"
            );
            setStep(2);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    // STEP 2
    const handleVerifyCode = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await fetch(
                `${BASE_URL}/verify-reset-code`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        code
                    })
                }
            );

            const data = await res.json();

            if (!res.ok)
                throw new Error(data.message);

            setMessage("Code verified ✅");
            setStep(3);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setMessage(error.message);
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
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        code,
                        password
                    })
                }
            );

            const data = await res.json();

            if (!res.ok)
                throw new Error(data.message);

            setMessage(
                "Password changed successfully 🎉"
            );

            setTimeout(() => {
                window.location.href =
                    "/";
            }, 1500);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page">
            <div className="forgot-card">

                <h1>Forgot Password</h1>
                <p>
                    Reset your account password
                </p>

                {/* STEP INDICATOR */}
                <div className="steps">
                    <span
                        className={
                            step >= 1
                                ? "active"
                                : ""
                        }
                    >
                        1
                    </span>

                    <span
                        className={
                            step >= 2
                                ? "active"
                                : ""
                        }
                    >
                        2
                    </span>

                    <span
                        className={
                            step >= 3
                                ? "active"
                                : ""
                        }
                    >
                        3
                    </span>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target
                                        .value
                                )
                            }
                        />

                        <button
                            onClick={
                                handleSendCode
                            }
                        >
                            {loading
                                ? "Sending..."
                                : "Send Code"}
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter Code"
                            value={code}
                            onChange={(e) =>
                                setCode(
                                    e.target
                                        .value
                                )
                            }
                        />

                        <button
                            onClick={
                                handleVerifyCode
                            }
                        >
                            {loading
                                ? "Checking..."
                                : "Verify Code"}
                        </button>
                    </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target
                                        .value
                                )
                            }
                        />

                        <button
                            onClick={
                                handleResetPassword
                            }
                        >
                            {loading
                                ? "Saving..."
                                : "Reset Password"}
                        </button>
                    </>
                )}

                {message && (
                    <div className="msg">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
