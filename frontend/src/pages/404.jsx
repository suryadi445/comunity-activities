import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div
            style={{
                backgroundColor: "#0f172a",
                color: "#fff",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Stars background */}
            {[...Array(30)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: "2px",
                        height: "2px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        animation: `twinkle ${1 + Math.random() * 2}s infinite ease-in-out`,
                    }}
                />
            ))}

            <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ animation: "pulse 1.5s infinite ease-in-out", animationDelay: "0s" }}>4</span>
                <span style={{ animation: "pulse 1.5s infinite ease-in-out", animationDelay: "0.5s" }}>0</span>
                <span style={{ animation: "pulse 1.5s infinite ease-in-out", animationDelay: "1s" }}>4</span>
            </div>

            <p style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                Oops! Page Not Found
            </p>
            <p style={{ maxWidth: "500px", opacity: 0.8 }}>
                The page you’re trying to reach doesn’t exist or is currently unavailable.
            </p>
            <Link
                to="/dashboard"
                style={{
                    marginTop: "30px",
                    padding: "12px 24px",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "500",
                }}
            >
                🚀 Return to Base
            </Link>

            <style>
                {`
                    span {
                        font-size: 6rem;
                        color: #38bdf8;
                        text-shadow: 0px 0px 15px #0ea5e9;
                        display: inline-block;
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.4); }
                    }
                    @keyframes twinkle {
                        0%, 100% { opacity: 0.2; }
                        50% { opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
}
