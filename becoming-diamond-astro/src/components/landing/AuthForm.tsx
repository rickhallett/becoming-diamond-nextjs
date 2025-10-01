import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    window.location.href = "/app";
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: ""
    });
  };

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* Gradient border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-20 blur"></div>

        <div className="relative bg-black/80 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              // Initial "Enter" button state
              <motion.div
                key="enter-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Ready to begin?
                </h2>
                <motion.button
                  onClick={() => setIsExpanded(true)}
                  className="w-full bg-purple-600 text-white font-medium py-4 px-8 rounded-lg relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="relative z-10">Enter</span>
                  <motion.div
                    className="absolute inset-0 bg-purple-700"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            ) : (
              // Expanded form state
              <motion.div
                key="auth-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {isLogin
                      ? "Enter your credentials to access your account"
                      : "Sign up to get started with Aceternity AI"}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Sign up only fields */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`
                              w-full px-4 py-3 rounded-lg
                              bg-white/5
                              border ${errors.firstName ? 'border-red-500' : 'border-white/10'}
                              text-white placeholder-gray-500
                              focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                              transition-all duration-200
                            `}
                            placeholder="John"
                          />
                          <AnimatePresence>
                            {errors.firstName && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-red-500 text-xs mt-1"
                              >
                                {errors.firstName}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`
                              w-full px-4 py-3 rounded-lg
                              bg-white/5
                              border ${errors.lastName ? 'border-red-500' : 'border-white/10'}
                              text-white placeholder-gray-500
                              focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                              transition-all duration-200
                            `}
                            placeholder="Doe"
                          />
                          <AnimatePresence>
                            {errors.lastName && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-red-500 text-xs mt-1"
                              >
                                {errors.lastName}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 rounded-lg
                        bg-white/5
                        border ${errors.email ? 'border-red-500' : 'border-white/10'}
                        text-white placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                        transition-all duration-200
                      `}
                      placeholder="you@example.com"
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Password field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 rounded-lg
                        bg-white/5
                        border ${errors.password ? 'border-red-500' : 'border-white/10'}
                        text-white placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                        transition-all duration-200
                      `}
                      placeholder="••••••••"
                    />
                    <AnimatePresence>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`
                      w-full bg-purple-600 hover:bg-purple-700
                      text-white font-medium py-3 px-6 rounded-lg
                      transition-colors duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-black
                      flex items-center justify-center
                    `}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Processing...
                      </>
                    ) : (
                      isLogin ? "Sign In" : "Sign Up"
                    )}
                  </motion.button>
                </form>

                {/* Toggle mode */}
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    {" "}
                    <motion.button
                      type="button"
                      onClick={toggleMode}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                      {isLogin ? "Sign Up" : "Sign In"}
                    </motion.button>
                  </p>
                </div>

                {/* Back button */}
                <div className="mt-4 text-center">
                  <motion.button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
                  >
                    ← Back
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
