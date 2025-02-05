"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Header from "@/components/header";

const VerifyOTPPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "") {
      const nextElement = element.nextElementSibling as HTMLInputElement;
      if (nextElement) {
        nextElement.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    console.log("Verifying OTP:", otpString);

    if (otpString === "123456") {
      router.push("/dashboard");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };
  const handleResendOTP = () => {
    // TODO: Implement resend OTP logic
    setTimeLeft(30);
    console.log("Resending OTP");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Header />
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white px-8 py-10 shadow-sm border border-gray-200 rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-gray-600 mb-2">
                Verify Your Email
              </h2>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Enter OTP Code
              </h1>
              <p className="text-lg text-gray-600">
                We've sent a code to your email
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-4 mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              >
                Verify Email
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?{" "}
                {timeLeft > 0 ? (
                  <span className="text-gray-500">Resend in {timeLeft}s</span>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
        <div>
          <p>OTP for now 123345</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
