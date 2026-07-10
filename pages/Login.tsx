import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from '../components/seo/SEO';

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === "Dtalestech" && password === "Dt@lestech2023") {
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin/dashboard');
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-[#0020BF] to-black px-6">
      <SEO title="Admin Login | DTALES Tech" description="Authorized admin login for DTALES Tech." noindex />
      {/* Animated background blur circles */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(28px) saturate(160%)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
          className="p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Admin Login
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300"
            >
              DTales Tech Management Portal
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white mb-2"
              >
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0020BF] focus:border-transparent transition-all"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0020BF] focus:border-transparent transition-all"
                />
              </div>
            </motion.div>

            {/* Login Button */}
            <motion.button
              type="submit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#0020BF] text-white py-3 rounded-xl font-semibold hover:bg-[#0A2CFF] transition-all shadow-lg hover:shadow-[0_0_30px_rgba(0,32,191,0.5)] flex items-center justify-center gap-2 group"
            >
              Login
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
          </form>

          {/* Warning Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-6 border-t border-white/10 text-center"
          >
            <p className="text-gray-400 text-xs">
              ⚠️ Authorized access only. Unauthorized attempts are logged.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
