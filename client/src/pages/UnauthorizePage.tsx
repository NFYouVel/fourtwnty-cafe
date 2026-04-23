import { useNavigate } from "react-router";
import "../styles/unauthorized.css";

function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <div className="unauth-page">
            <div className="unauth-card">
                <h1>403</h1>
                <h2>Access Denied</h2>
                <p>
                    Sorry, you don't have permission
                    to access this page.
                </p>

                <div className="unauth-actions">
                    <button onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UnauthorizedPage;
