import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Auth.css";

function Auth({
  authMode,
  setAuthMode,
  setFormData,
  formData,
  auth,
  statusMessage,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    auth();
  };

  return (
    /* LOGIN AND REGISTRATION VIEW */
    <div className="auth-container">
      <div className="auth-box">
        <h2>{authMode === "login" ? "LOGIN" : "NEW TRAINER ? "}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="TRAINER NAME"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="PASSWORD"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {statusMessage && <p className="status-msg">{statusMessage}</p>}

          <button type="submit">VALIDATE</button>
        </form>

        <p
          className="auth-link"
          onClick={() =>
            setAuthMode(authMode === "login" ? "register" : "login")
          }
        >
          {authMode === "login" ? "Register" : "Already a trainer?"}
        </p>
      </div>
    </div>
  );
}

export default Auth;
