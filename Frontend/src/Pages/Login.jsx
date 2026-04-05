import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Film, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../Services/authApi";
import { useAppLanguage } from "../i18n/useAppLanguage";

const loginText = {
  English: {
    subtitle: "Book tickets. Skip the queue.",
    email: "Email address",
    password: "Password",
    login: "Login",
    or: "OR",
    newHere: "New here?",
    createAccount: "Create an account",
    loginFailed: "Login failed",
  },
  Hindi: {
    subtitle: "टिकट बुक करें। लाइन से बचें।",
    email: "ईमेल पता",
    password: "पासवर्ड",
    login: "लॉगिन",
    or: "या",
    newHere: "नए यूज़र हैं?",
    createAccount: "अकाउंट बनाएं",
    loginFailed: "लॉगिन असफल रहा",
  },
  Marathi: {
    subtitle: "तिकीट बुक करा. रांगेत उभे राहू नका.",
    email: "ईमेल पत्ता",
    password: "पासवर्ड",
    login: "लॉगिन",
    or: "किंवा",
    newHere: "नवीन आहात?",
    createAccount: "अकाउंट तयार करा",
    loginFailed: "लॉगिन अयशस्वी",
  },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { appLanguage } = useAppLanguage();
  const text = loginText[appLanguage] || loginText.English;

  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });
      const { token, role, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      if (role === "theatreAdmin" && user.isTempPassword) {
        navigate("/change-password");
        return;
      }

      if (role === "admin") navigate("/admin");
      else if (role === "theatreAdmin") navigate("/theatre-admin");
      else navigate("/user");
    } catch (err) {
      alert(err.response?.data?.message || text.loginFailed);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
        <div className="flex flex-col items-center mb-6">
          <Film size={40} className="text-red-500 mb-2" />
          <h2 className="text-3xl font-bold tracking-wide">
            Movie<span className="text-red-500">Book</span>
          </h2>
          <p className="text-sm text-gray-300 mt-1">{text.subtitle}</p>
        </div>

        <input
          type="email"
          placeholder={text.email}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative w-full mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={text.password}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold tracking-wide transition"
        >
          {text.login}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-600"></div>
          <span className="px-3 text-gray-400 text-sm">{text.or}</span>
          <div className="flex-grow h-px bg-gray-600"></div>
        </div>

        <p className="text-center text-sm text-gray-300">
          {text.newHere}{" "}
          <Link to="/register" className="text-red-400 hover:text-red-500 font-medium">
            {text.createAccount}
          </Link>
        </p>
      </div>
    </div>
  );
}
