"use client";

import React, { useState, FormEvent, useCallback } from "react";
import { X, Mail, Lock, User, Phone, Building2, Church } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type AccountType = "user" | "hotelier" | "monasteryAdmin";
type AuthMode = "login" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundImagePath?: string;
}

export function AuthModal({ isOpen, onClose, backgroundImagePath }: AuthModalProps) {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [accountType, setAccountType] = useState<AccountType>("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleSuccess = useCallback(() => {
    onClose();
    router.push("/");
  }, [onClose, router]);

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await signIn("google", { accountType, redirect: false });
      if (result?.ok) {
        handleSuccess();
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (error: unknown) {
      console.error(error);
      setError("Failed to login with Google (Mocked)");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailLogin = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await signIn("email", { redirect: false });
      if (result?.ok) {
        setError("Magic Link sent! Please check your email (Mocked).");
      } else if (result?.error) {
        setError(result.error);
      } else {
        setError("Magic Link sent! Please check your email (Mocked).");
      }
    } catch (error: unknown) {
      console.error(error);
      setError("Failed to send login email (Mocked)");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCredentialsLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!loginEmail || !loginPassword) {
      setError("Please enter both email and password.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        accountType,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        handleSuccess();
      } else {
        setError("Invalid credentials (Mock Error). Please try again.");
      }
    } catch (error: unknown) {
      console.error(error);
      setError("An unexpected error occurred during login (Mocked).");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = {
      username: signupName,
      email: signupEmail,
      password: signupPassword,
      type: accountType,
    };

    if (!formData.username || !formData.email || !formData.password || !formData.type) {
      setError("Please fill all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed.");
        setIsSubmitting(false);
        return;
      }

      const user = data.user;
      console.log("Signup success:", user);

      const loginResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        accountType: formData.type,
      });

      if (loginResult?.error) {
        setError("Account created but auto-login failed.");
        setIsSubmitting(false);
        return;
      }

      if (user.type === "user") router.push("/");
      else if (user.type === "hotelier") router.push("/hotel-admin");
      else if (user.type === "monasteryAdmin") router.push("/monastery-admin");
      else router.push("/");

    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAccountTypeLabel = (type: AccountType): string => {
    switch (type) {
      case "user":
        return "USER ACCOUNT";
      case "hotelier":
        return "HOTELIER ACCOUNT";
      case "monasteryAdmin":
        return "MONASTERY ADMIN";
      default:
        return "";
    }
  };

  const getAccountTypeIcon = (type: AccountType) => {
    switch (type) {
      case "user":
        return <User className="w-5 h-5" />;
      case "hotelier":
        return <Building2 className="w-5 h-5" />;
      case "monasteryAdmin":
        return <Church className="w-5 h-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-1000 p-4 font-inter"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Left Side - Background Image */}
        <div
          className="md:w-1/2 p-8 flex flex-col items-center justify-center relative bg-cover bg-center"
          style={{ backgroundImage: backgroundImagePath ? `url(${backgroundImagePath})` : undefined }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8 overflow-y-auto">
          {/* Account Type Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl shadow-inner">
            {(["user", "hotelier", "monasteryAdmin"] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setAccountType(type); setError(null); }}
                disabled={isSubmitting}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 border ${
                  accountType === type
                    ? "bg-blue-600 text-white shadow-md border-blue-600"
                    : "bg-transparent text-gray-600 hover:bg-gray-200 border-transparent"
                } disabled:opacity-70`}
              >
                {getAccountTypeIcon(type)}
                <span className="hidden sm:inline">{type === "user" ? "Traveler" : type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <span className="sm:hidden">{type === "user" ? "Traveler" : type.charAt(0).toUpperCase()}</span>
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            {authMode === "login" ? "Welcome Back!" : "Create Account"} ({getAccountTypeLabel(accountType)})
          </h3>

          {/* Login/Signup Toggle */}
          <div className="flex justify-start gap-6 mb-6 border-b border-gray-200">
            <button
              onClick={() => { setAuthMode("login"); setError(null); }}
              className={`pb-2 font-semibold transition duration-200 ${
                authMode === "login"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setAuthMode("signup"); setError(null); }}
              className={`pb-2 font-semibold transition duration-200 ${
                authMode === "signup"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-300 rounded-lg p-3 animate-fadeIn">
              <p className="text-red-800 text-sm font-medium flex items-start gap-2">
                <X className="w-5 h-5 mt-0.5" />
                <span>{error}</span>
              </p>
            </div>
          )}

          {/* Form Content (Login or Signup) */}
          {authMode === "login" ? (
            <form onSubmit={handleCredentialsLogin} className="space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="login-email"
                    type="email"
                    name="login-email"
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 disabled:bg-gray-50 bg-white text-gray-900 placeholder-gray-500"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoFocus
                    tabIndex={0}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="login-password"
                    type="password"
                    name="login-password"
                    placeholder="Enter your password"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 disabled:bg-gray-50 bg-white text-gray-900 placeholder-gray-500"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    tabIndex={0}
                  />
                </div>
                <button type="button" className="text-xs text-blue-600 hover:text-blue-800 mt-2 block w-full text-right font-medium">Forgot Password?</button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg shadow-blue-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-name"
                    type="text"
                    name="signup-name"
                    placeholder="Enter your name"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 disabled:bg-gray-50 bg-white text-gray-900 placeholder-gray-500"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    tabIndex={0}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-email"
                    type="email"
                    name="signup-email"
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 disabled:bg-gray-50 bg-white text-gray-900 placeholder-gray-500"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    tabIndex={0}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-password"
                    type="password"
                    name="signup-password"
                    placeholder="Create a password (min 8 chars)"
                    required
                    minLength={8}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 disabled:bg-gray-50 bg-white text-gray-900 placeholder-gray-500"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    tabIndex={0}
                  />
                </div>
              </div>

              {/* Phone Input - Optional */}
              <div>
                <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-2">Mobile Number <span className="text-gray-500 text-xs">(Optional)</span></label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    <span className="text-xl">🇮🇳</span>
                    <span className="text-sm font-medium text-gray-700">+91</span>
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="signup-phone"
                      type="tel"
                      name="signup-phone"
                      placeholder="Enter mobile number (10 digits)"
                      pattern="[0-9]{10}"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 disabled:bg-gray-50 bg-white text-gray-900 placeholder-gray-500"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      tabIndex={0}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg shadow-blue-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">Or {authMode === "login" ? "Login" : "Signup"} With</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 disabled:bg-gray-100 disabled:opacity-70 font-medium text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={handleEmailLogin}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 disabled:bg-gray-100 disabled:opacity-70 font-medium text-gray-700"
            >
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Magic Link</span>
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By proceeding, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Privacy Policy
            </a>
            ,{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              User Agreement
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              T&Cs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
