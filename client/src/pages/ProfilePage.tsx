import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";
import "../styles/profilePage.css";

export default function ProfilePage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("userData") || "null");
    const isCustomer = user?.user_role === "Customer";

    // Profile state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // UI state
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
    const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });

    // Fetch profile
    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/profile/${user.id}`
                );
                const data = await res.json();

                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
                setRole(data.user_role);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    // Update Name (Customer only)
    const handleUpdateProfile = async () => {
        if (!name.trim()) {
            setProfileMsg({ text: "Name cannot be empty", type: "error" });
            return;
        }

        setLoadingProfile(true);
        setProfileMsg({ text: "", type: "" });

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/profile/update`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id,
                        name: name.trim()
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            // Update localStorage
            const updatedUser = { ...user, name: name.trim() };
            localStorage.setItem("userData", JSON.stringify(updatedUser));

            setProfileMsg({
                text: "Name updated successfully ✅",
                type: "success"
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                setProfileMsg({ text: error.message, type: "error" });
            }
        } finally {
            setLoadingProfile(false);
        }
    };

    // Change Password (Customer + Staff)
    const handleChangePassword = async () => {
        setPasswordMsg({ text: "", type: "" });

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMsg({ text: "All fields are required", type: "error" });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMsg({
                text: "New password must be at least 6 characters",
                type: "error"
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMsg({
                text: "New password and confirm password do not match",
                type: "error"
            });
            return;
        }

        if (currentPassword === newPassword) {
            setPasswordMsg({
                text: "New password must be different from current password",
                type: "error"
            });
            return;
        }

        setLoadingPassword(true);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/profile/change-password`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id,
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setPasswordMsg({
                text: "Password changed successfully 🔒",
                type: "success"
            });

            // Clear fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error: unknown) {
            if (error instanceof Error) {
                setPasswordMsg({ text: error.message, type: "error" });
            }
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <>
            <Header />
            <HeaderDashboard />

            <div className="profile-page">
                <div className="profile-container">

                    {/* =========================
                        PROFILE INFO CARD
                    ========================= */}
                    <div className="profile-card">
                        <h2 className="profile-card-title">My Profile</h2>
                        <p className="profile-card-subtitle">
                            Your account information
                        </p>

                        <div className="profile-info-grid">
                            <div className="profile-info-item">
                                <span className="profile-info-label">Email</span>
                                <span className="profile-info-value">{email}</span>
                            </div>

                            <div className="profile-info-item">
                                <span className="profile-info-label">Phone</span>
                                <span className="profile-info-value">{phone}</span>
                            </div>

                            <div className="profile-info-item">
                                <span className="profile-info-label">Role</span>
                                <span className="profile-role-badge">{role}</span>
                            </div>
                        </div>
                    </div>

                    {/* =========================
                        CHANGE NAME (Customer Only)
                    ========================= */}
                    {isCustomer && (
                        <div className="profile-card">
                            <h2 className="profile-card-title">Change Name</h2>
                            <p className="profile-card-subtitle">
                                Update your display name
                            </p>

                            <div className="profile-form-group">
                                <label className="profile-form-label">
                                    Full Name
                                </label>
                                <input
                                    className="profile-form-input"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <button
                                className="profile-btn profile-btn-primary"
                                onClick={handleUpdateProfile}
                                disabled={loadingProfile}
                            >
                                {loadingProfile ? "Saving..." : "Update Name"}
                            </button>

                            {profileMsg.text && (
                                <div className={`profile-msg ${profileMsg.type}`}>
                                    {profileMsg.text}
                                </div>
                            )}
                        </div>
                    )}

                    {/* =========================
                        CHANGE PASSWORD (All Roles)
                    ========================= */}
                    <div className="profile-card">
                        <h2 className="profile-card-title">Change Password</h2>
                        <p className="profile-card-subtitle">
                            Secure your account with a new password
                        </p>

                        <div className="profile-form-group">
                            <label className="profile-form-label">
                                Current Password
                            </label>
                            <input
                                className="profile-form-input"
                                type="password"
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                            />
                        </div>

                        <div className="profile-divider" />

                        <div className="profile-form-group">
                            <label className="profile-form-label">
                                New Password
                            </label>
                            <input
                                className="profile-form-input"
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                            />
                            <p className="profile-password-hint">
                                Minimum 6 characters
                            </p>
                        </div>

                        <div className="profile-form-group">
                            <label className="profile-form-label">
                                Confirm New Password
                            </label>
                            <input
                                className="profile-form-input"
                                type="password"
                                placeholder="Re-enter new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>

                        <button
                            className="profile-btn profile-btn-primary"
                            onClick={handleChangePassword}
                            disabled={loadingPassword}
                        >
                            {loadingPassword
                                ? "Changing..."
                                : "Change Password"
                            }
                        </button>

                        {passwordMsg.text && (
                            <div className={`profile-msg ${passwordMsg.type}`}>
                                {passwordMsg.text}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}