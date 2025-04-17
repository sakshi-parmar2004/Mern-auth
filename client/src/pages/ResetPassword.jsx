import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  axios.defaults.withCredentials = true;

  const [newpassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { backendURL } = useContext(AppContext);
  const inputRefs = React.useRef([]);
  const Navigate = useNavigate();

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 5); // Get the first 5 characters from the clipboard
    const pasteArray = paste.split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const sendResetOtp = async () => {
    try {
      const { data } = await axios.post(backendURL + "/api/auth/reset-otp", {
        email,
      });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsEmailSent(true);
    sendResetOtp();
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const otp = otpArray.join("");
    setOtp(otp);
    setIsOtpSent(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Email:", email, "OTP:", otp, "Password:", newpassword);
      const { data } = await axios.post(backendURL + "/api/auth/reset-password", {
        email,
        otp,
        newpassword,
      });
      if (data.success) {
        toast.success(data.message);
        Navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error.mesage);
      toast.error(error.message || "An error occurred while resetting the password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => Navigate("/")}
        className="absolute left-5 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      {!isEmailSent && (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 className="font-bold  text-gray-600 text-center mb-6">Enter Your Email</h1>
          <form onSubmit={handleSubmitEmail}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {isEmailSent && !isOtpSent && (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <p className="text-gray-600 text-center mb-6">Enter Your Otp</p>
          <form onSubmit={handleSubmitOtp}>
            <div className="flex justify-between" onPaste={handlePaste}>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <input
                    className="w-12 h-12 text-center text-black rounded-md bg-gray-200 border border-gray-600"
                    type="text"
                    maxLength={1}
                    ref={(e) => (inputRefs.current[index] = e)}
                    key={index}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all cursor-pointer "
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {isOtpSent && (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Reset Your Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                value={newpassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all cursor-pointer"
            >
              Reset Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
