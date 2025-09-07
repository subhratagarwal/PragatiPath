// client/src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password: pass });
      // server should respond with token and whether 2FA required
      if (res.data?.requires2FA) {
        setOtpMode(true);
        alert("2FA required. Enter OTP sent to your admin device.");
      } else {
        setUser({ ...res.data.user, token: res.data.token });
        navigate("/");
      }
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      setUser({ ...res.data.user, token: res.data.token });
      navigate("/dashboard");
    } catch (err) {
      alert("OTP invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
      <motion.div className="w-full max-w-md bg-white rounded-xl shadow p-6" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <h2 className="text-xl font-semibold mb-2">Sign in</h2>
        {!otpMode ? (
          <form onSubmit={login} className="space-y-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-md p-2 border" />
            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" className="w-full rounded-md p-2 border" />
            <button disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded">Sign in</button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <p className="text-sm text-gray-600">Enter the OTP sent to your registered device</p>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" className="w-full rounded-md p-2 border" />
            <button disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded">Verify OTP</button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
