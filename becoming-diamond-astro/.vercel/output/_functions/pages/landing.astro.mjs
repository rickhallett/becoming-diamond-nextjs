/* empty css                                 */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, n as renderScript } from '../chunks/astro/server_C1911K9M.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Cq7s04YD.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
/* empty css                                   */
import { motion, AnimatePresence } from 'framer-motion';
export { renderers } from '../renderers.mjs';

function SparklesCore({
  id = "tsparticles",
  className = "",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  speed = 1,
  particleColor = "#FFFFFF",
  particleDensity = 100
}) {
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);
  const options = useMemo(
    () => ({
      background: {
        color: {
          value: background
        }
      },
      fullScreen: {
        enable: false,
        zIndex: 1
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: false
          },
          onHover: {
            enable: false
          },
          resize: {
            enable: true,
            delay: 0.5
          }
        }
      },
      particles: {
        color: {
          value: particleColor
        },
        move: {
          enable: true,
          speed,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "out"
          }
        },
        number: {
          value: particleDensity,
          density: {
            enable: true,
            width: 400,
            height: 400
          }
        },
        opacity: {
          value: {
            min: 0.1,
            max: 1
          },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
            startValue: "random"
          }
        },
        shape: {
          type: "circle"
        },
        size: {
          value: {
            min: minSize,
            max: maxSize
          }
        }
      },
      detectRetina: true
    }),
    [background, minSize, maxSize, speed, particleColor, particleDensity]
  );
  if (!init) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    Particles,
    {
      id,
      className,
      options
    }
  );
}

const $$Astro = createAstro();
const $$Sparkles = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Sparkles;
  const {
    id = "tsparticles",
    className = "",
    background = "transparent",
    minSize = 0.6,
    maxSize = 1.4,
    speed = 1,
    particleColor = "#FFFFFF",
    particleDensity = 100
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "SparklesCore", SparklesCore, { "id": id, "className": className, "background": background, "minSize": minSize, "maxSize": maxSize, "speed": speed, "particleColor": particleColor, "particleDensity": particleDensity, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/components/ui/SparklesCore", "client:component-export": "default" })}`;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/components/ui/sparkles.astro", void 0);

const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="relative flex items-center justify-center min-h-screen px-4 overflow-hidden" data-astro-cid-zypivoos> <!-- Sparkles Background --> <div class="absolute inset-0 w-full h-full" data-astro-cid-zypivoos> ${renderComponent($$result, "Sparkles", $$Sparkles, { "id": "hero-sparkles", "className": "w-full h-full", "background": "transparent", "minSize": 0.4, "maxSize": 1, "speed": 0.5, "particleColor": "#9333ea", "particleDensity": 50, "data-astro-cid-zypivoos": true })} </div> <!-- Gradient Overlay --> <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" data-astro-cid-zypivoos></div> <!-- Content --> <div id="hero-content" class="relative z-10 text-center max-w-2xl mx-auto" data-astro-cid-zypivoos> <h1 class="text-5xl md:text-6xl lg:text-8xl font-bold mb-6 text-white" data-astro-cid-zypivoos>
Aceternity AI
</h1> <p class="text-lg md:text-xl text-gray-400 mb-8" data-astro-cid-zypivoos>
Modern web experiences with elegant design
</p> </div> </section> ${renderScript($$result, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/components/landing/HeroSection.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/components/landing/HeroSection.astro", void 0);

function AuthForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });
  const [errors, setErrors] = useState({});
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateForm = () => {
    const newErrors = {};
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
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
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "easeOut" },
      className: "relative",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-20 blur" }),
        /* @__PURE__ */ jsx("div", { className: "relative bg-black/80 backdrop-blur-sm rounded-lg p-8 border border-white/10", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: !isExpanded ? (
          // Initial "Enter" button state
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              transition: { duration: 0.3 },
              className: "text-center",
              children: [
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-white mb-4", children: "Ready to begin?" }),
                /* @__PURE__ */ jsxs(
                  motion.button,
                  {
                    onClick: () => setIsExpanded(true),
                    className: "w-full bg-purple-600 text-white font-medium py-4 px-8 rounded-lg relative overflow-hidden group",
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    transition: { type: "spring", stiffness: 400, damping: 17 },
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "relative z-10", children: "Enter" }),
                      /* @__PURE__ */ jsx(
                        motion.div,
                        {
                          className: "absolute inset-0 bg-purple-700",
                          initial: { x: "-100%" },
                          whileHover: { x: 0 },
                          transition: { duration: 0.3 }
                        }
                      )
                    ]
                  }
                )
              ]
            },
            "enter-button"
          )
        ) : (
          // Expanded form state
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -10 },
              transition: { duration: 0.3 },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-white mb-2", children: isLogin ? "Welcome Back" : "Create Account" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: isLogin ? "Enter your credentials to access your account" : "Sign up to get started with Aceternity AI" })
                ] }),
                /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
                  /* @__PURE__ */ jsx(AnimatePresence, { children: !isLogin && /* @__PURE__ */ jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: "auto" },
                      exit: { opacity: 0, height: 0 },
                      transition: { duration: 0.3 },
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs("label", { htmlFor: "firstName", className: "block text-sm font-medium text-gray-300 mb-2", children: [
                            "First Name ",
                            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                          ] }),
                          /* @__PURE__ */ jsx(
                            motion.input,
                            {
                              whileFocus: { scale: 1.01 },
                              type: "text",
                              id: "firstName",
                              name: "firstName",
                              value: formData.firstName,
                              onChange: handleChange,
                              className: `
                              w-full px-4 py-3 rounded-lg
                              bg-white/5
                              border ${errors.firstName ? "border-red-500" : "border-white/10"}
                              text-white placeholder-gray-500
                              focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                              transition-all duration-200
                            `,
                              placeholder: "John"
                            }
                          ),
                          /* @__PURE__ */ jsx(AnimatePresence, { children: errors.firstName && /* @__PURE__ */ jsx(
                            motion.p,
                            {
                              initial: { opacity: 0, y: -5 },
                              animate: { opacity: 1, y: 0 },
                              exit: { opacity: 0, y: -5 },
                              className: "text-red-500 text-xs mt-1",
                              children: errors.firstName
                            }
                          ) })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs("label", { htmlFor: "lastName", className: "block text-sm font-medium text-gray-300 mb-2", children: [
                            "Last Name ",
                            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                          ] }),
                          /* @__PURE__ */ jsx(
                            motion.input,
                            {
                              whileFocus: { scale: 1.01 },
                              type: "text",
                              id: "lastName",
                              name: "lastName",
                              value: formData.lastName,
                              onChange: handleChange,
                              className: `
                              w-full px-4 py-3 rounded-lg
                              bg-white/5
                              border ${errors.lastName ? "border-red-500" : "border-white/10"}
                              text-white placeholder-gray-500
                              focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                              transition-all duration-200
                            `,
                              placeholder: "Doe"
                            }
                          ),
                          /* @__PURE__ */ jsx(AnimatePresence, { children: errors.lastName && /* @__PURE__ */ jsx(
                            motion.p,
                            {
                              initial: { opacity: 0, y: -5 },
                              animate: { opacity: 1, y: 0 },
                              exit: { opacity: 0, y: -5 },
                              className: "text-red-500 text-xs mt-1",
                              children: errors.lastName
                            }
                          ) })
                        ] })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-300 mb-2", children: [
                      "Email Address ",
                      /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      motion.input,
                      {
                        whileFocus: { scale: 1.01 },
                        type: "email",
                        id: "email",
                        name: "email",
                        value: formData.email,
                        onChange: handleChange,
                        className: `
                        w-full px-4 py-3 rounded-lg
                        bg-white/5
                        border ${errors.email ? "border-red-500" : "border-white/10"}
                        text-white placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                        transition-all duration-200
                      `,
                        placeholder: "you@example.com"
                      }
                    ),
                    /* @__PURE__ */ jsx(AnimatePresence, { children: errors.email && /* @__PURE__ */ jsx(
                      motion.p,
                      {
                        initial: { opacity: 0, y: -5 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -5 },
                        className: "text-red-500 text-xs mt-1",
                        children: errors.email
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-300 mb-2", children: [
                      "Password ",
                      /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      motion.input,
                      {
                        whileFocus: { scale: 1.01 },
                        type: "password",
                        id: "password",
                        name: "password",
                        value: formData.password,
                        onChange: handleChange,
                        className: `
                        w-full px-4 py-3 rounded-lg
                        bg-white/5
                        border ${errors.password ? "border-red-500" : "border-white/10"}
                        text-white placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                        transition-all duration-200
                      `,
                        placeholder: "••••••••"
                      }
                    ),
                    /* @__PURE__ */ jsx(AnimatePresence, { children: errors.password && /* @__PURE__ */ jsx(
                      motion.p,
                      {
                        initial: { opacity: 0, y: -5 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -5 },
                        className: "text-red-500 text-xs mt-1",
                        children: errors.password
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsx(
                    motion.button,
                    {
                      type: "submit",
                      disabled: isLoading,
                      whileHover: { scale: 1.01 },
                      whileTap: { scale: 0.99 },
                      className: `
                      w-full bg-purple-600 hover:bg-purple-700
                      text-white font-medium py-3 px-6 rounded-lg
                      transition-colors duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-black
                      flex items-center justify-center
                    `,
                      children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(
                          motion.div,
                          {
                            className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2",
                            animate: { rotate: 360 },
                            transition: { duration: 1, repeat: Infinity, ease: "linear" }
                          }
                        ),
                        "Processing..."
                      ] }) : isLogin ? "Sign In" : "Sign Up"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-sm", children: [
                  isLogin ? "Don't have an account?" : "Already have an account?",
                  " ",
                  /* @__PURE__ */ jsx(
                    motion.button,
                    {
                      type: "button",
                      onClick: toggleMode,
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 },
                      className: "text-purple-400 hover:text-purple-300 font-medium transition-colors",
                      children: isLogin ? "Sign Up" : "Sign In"
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsx(
                  motion.button,
                  {
                    type: "button",
                    onClick: () => setIsExpanded(false),
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    className: "text-gray-500 hover:text-gray-400 text-sm transition-colors",
                    children: "← Back"
                  }
                ) })
              ]
            },
            "auth-form"
          )
        ) }) })
      ]
    }
  ) });
}

const $$AuthSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="flex items-center justify-center min-h-[50vh] px-4 pb-20"> <div class="w-full max-w-md"> <div class="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10"> <h2 class="text-2xl font-semibold mb-6 text-center">Get Started</h2> ${renderComponent($$result, "AuthForm", AuthForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/components/landing/AuthForm", "client:component-export": "default" })} </div> </div> </section>`;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/components/landing/AuthSection.astro", void 0);

const $$Landing = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Aceternity AI" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-black text-white"> ${renderComponent($$result2, "HeroSection", $$HeroSection, {})} ${renderComponent($$result2, "AuthSection", $$AuthSection, {})} </main> ` })}`;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/pages/landing.astro", void 0);

const $$file = "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/pages/landing.astro";
const $$url = "/landing";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Landing,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
