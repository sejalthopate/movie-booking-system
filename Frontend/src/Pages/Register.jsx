import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Eye, EyeOff } from "lucide-react";
import { registerUser } from "../Services/authApi";
import { useAppLanguage } from "../i18n/useAppLanguage";

const registerText = {
  English: {
    subtitle: "Create your account to book tickets",
    name: "Full Name",
    email: "Email Address",
    phone: "Mobile Number",
    password: "Password",
    createAccount: "Create Account",
    or: "OR",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Login here",
    registrationSuccessful: "Registration successful",
    registrationFailed: "Registration failed",
  },
  Hindi: {
    subtitle: "टिकट बुक करने के लिए अपना अकाउंट बनाएं",
    name: "पूरा नाम",
    email: "ईमेल पता",
    phone: "मोबाइल नंबर",
    password: "पासवर्ड",
    createAccount: "अकाउंट बनाएं",
    or: "या",
    alreadyHaveAccount: "क्या आपका अकाउंट पहले से है?",
    loginHere: "यहां लॉगिन करें",
    registrationSuccessful: "रजिस्ट्रेशन सफल रहा",
    registrationFailed: "रजिस्ट्रेशन असफल रहा",
  },
  Marathi: {
    subtitle: "तिकीट बुक करण्यासाठी तुमचे अकाउंट तयार करा",
    name: "पूर्ण नाव",
    email: "ईमेल पत्ता",
    phone: "मोबाइल नंबर",
    password: "पासवर्ड",
    createAccount: "अकाउंट तयार करा",
    or: "किंवा",
    alreadyHaveAccount: "आधीच अकाउंट आहे?",
    loginHere: "इथे लॉगिन करा",
    registrationSuccessful: "नोंदणी यशस्वी झाली",
    registrationFailed: "नोंदणी अयशस्वी झाली",
  },
};

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { appLanguage } = useAppLanguage();
  const text = registerText[appLanguage] || registerText.English;

  const handleRegister = async () => {
    try {
      await registerUser(form);
      alert(text.registrationSuccessful);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || text.registrationFailed);
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
          type="text"
          placeholder={text.name}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder={text.email}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="text"
          placeholder={text.phone}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <div className="relative w-full mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={text.password}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
          onClick={handleRegister}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold tracking-wide transition"
        >
          {text.createAccount}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-600"></div>
          <span className="px-3 text-gray-400 text-sm">{text.or}</span>
          <div className="flex-grow h-px bg-gray-600"></div>
        </div>

        <p className="text-center text-sm text-gray-300">
          {text.alreadyHaveAccount}{" "}
          <Link to="/login" className="text-red-400 hover:text-red-500 font-medium">
            {text.loginHere}
          </Link>
        </p>
      </div>
    </div>
  );
}
