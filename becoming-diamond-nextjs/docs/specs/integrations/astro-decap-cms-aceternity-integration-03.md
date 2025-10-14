# PRD 001-03: Animations and Particle Effects

**Version:** 1.0
**Date:** 2025-10-01
**Parent PRD:** 001-astro-decap-cms-aceternity-integration
**Status:** Ready for Implementation
**Estimated Complexity:** High
**Duration:** 6-8 hours

---

## 1. Scope

This chunk adds all animations and visual effects to the landing page, including the SparklesCore particle system, Framer Motion animations, scroll-based parallax effects, and micro-interactions. This transforms the static landing page into the polished, animated experience specified in the parent PRD.

### What's Included
- Framer Motion integration
- SparklesCore particle system (using tsparticles)
- Scroll-based parallax effects for hero section
- Form entrance and exit animations
- Button hover and loading animations
- Input focus transitions
- Responsive animation performance optimizations
- Mobile performance considerations (reduced particles)

### What's NOT Included
- Additional pages beyond landing page
- Real authentication backend
- Production deployment (saved for chunk 04)
- Advanced effects (3D globe, complex timelines)

### Dependencies
**Requires:**
- PRD 001-00 (Project Foundation) - completed
- PRD 001-01 (Decap CMS Integration) - completed
- PRD 001-02 (React Integration and UI Components) - completed

**Blocks:** PRD 001-04 (Production Deployment)

---

## 2. Requirements

### 2.1 Additional Dependencies

Add to existing `package.json`:
```json
{
  "dependencies": {
    "@tsparticles/engine": "^3.9.1",
    "@tsparticles/react": "^3.0.0",
    "@tsparticles/slim": "^3.9.1",
    "framer-motion": "^12.23.12"
  }
}
```

### 2.2 SparklesCore Component (React Island)

**src/components/ui/SparklesCore.tsx:**
```tsx
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}

export default function SparklesCore({
  id = "tsparticles",
  className = "",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  speed = 1,
  particleColor = "#FFFFFF",
  particleDensity = 100,
}: SparklesCoreProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: background,
        },
      },
      fullScreen: {
        enable: false,
        zIndex: 1,
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: false,
          },
          onHover: {
            enable: false,
          },
          resize: {
            enable: true,
            delay: 0.5,
          } as any,
        },
      },
      particles: {
        color: {
          value: particleColor,
        },
        move: {
          enable: true,
          speed: speed,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "out",
          },
        },
        number: {
          value: particleDensity,
          density: {
            enable: true,
            width: 400,
            height: 400,
          },
        },
        opacity: {
          value: {
            min: 0.1,
            max: 1,
          },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
            startValue: "random",
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: {
            min: minSize,
            max: maxSize,
          },
        },
      },
      detectRetina: true,
    }),
    [background, minSize, maxSize, speed, particleColor, particleDensity]
  );

  if (!init) {
    return null;
  }

  return (
    <Particles
      id={id}
      className={className}
      options={options}
    />
  );
}
```

### 2.3 Sparkles Astro Wrapper

**src/components/ui/sparkles.astro:**
```astro
---
import SparklesCore from './SparklesCore';

interface Props {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}

const {
  id = "tsparticles",
  className = "",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  speed = 1,
  particleColor = "#FFFFFF",
  particleDensity = 100,
} = Astro.props;
---

<SparklesCore
  id={id}
  className={className}
  background={background}
  minSize={minSize}
  maxSize={maxSize}
  speed={speed}
  particleColor={particleColor}
  particleDensity={particleDensity}
  client:load
/>
```

### 2.4 Updated HeroSection with Parallax and Sparkles

**src/components/landing/HeroSection.astro:**
```astro
---
import Sparkles from '../ui/sparkles.astro';
---

<section class="relative flex items-center justify-center min-h-screen px-4 overflow-hidden">
  <!-- Sparkles Background -->
  <div class="absolute inset-0 w-full h-full">
    <Sparkles
      id="hero-sparkles"
      className="w-full h-full"
      background="transparent"
      minSize={0.4}
      maxSize={1.0}
      speed={0.5}
      particleColor="#9333ea"
      particleDensity={50}
    />
  </div>

  <!-- Gradient Overlay -->
  <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none"></div>

  <!-- Content -->
  <div id="hero-content" class="relative z-10 text-center max-w-2xl mx-auto">
    <h1 class="text-5xl md:text-6xl lg:text-8xl font-bold mb-6 text-white">
      Aceternity AI
    </h1>
    <p class="text-lg md:text-xl text-gray-400 mb-8">
      Modern web experiences with elegant design
    </p>
  </div>
</section>

<script>
  // Parallax scroll effect
  if (typeof window !== 'undefined') {
    const heroContent = document.getElementById('hero-content');

    const handleScroll = () => {
      if (!heroContent) return;

      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      // Calculate opacity and transform based on scroll
      const opacity = Math.max(1 - (scrollY / heroHeight) * 1.5, 0.3);
      const translateY = scrollY * 0.5;

      heroContent.style.opacity = opacity.toString();
      heroContent.style.transform = `translateY(${translateY}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    document.addEventListener('astro:before-swap', () => {
      window.removeEventListener('scroll', handleScroll);
    });
  }
</script>

<style>
  #hero-content {
    transition: opacity 0.1s linear, transform 0.1s linear;
  }
</style>
```

### 2.5 Animated AuthForm Component (Updated)

**src/components/landing/AuthForm.tsx (with animations):**
```tsx
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
```

### 2.6 Mobile Performance Optimization

**src/components/landing/HeroSection.astro (with responsive particle density):**

Add this script to adjust particle density based on screen size:

```astro
<script>
  // Adjust particle performance for mobile
  if (typeof window !== 'undefined') {
    const updateParticleDensity = () => {
      const isMobile = window.innerWidth < 768;
      const heroSparkles = document.getElementById('hero-sparkles');

      if (heroSparkles && isMobile) {
        // Reduce opacity on mobile for better performance
        heroSparkles.style.opacity = '0.3';
      } else if (heroSparkles) {
        heroSparkles.style.opacity = '1';
      }
    };

    updateParticleDensity();
    window.addEventListener('resize', updateParticleDensity);

    document.addEventListener('astro:before-swap', () => {
      window.removeEventListener('resize', updateParticleDensity);
    });
  }
</script>
```

---

## 3. Implementation Details

### 3.1 Animation Specifications

**Scroll-based Parallax:**
- Hero content opacity: `1` → `0.3` as user scrolls
- Hero content Y-offset: `0` → `+50%` of scroll distance
- Smooth, linear transition tied to scroll position

**Form Animations:**
- Initial "Enter" button: Fade in with slight upward motion (0.5s)
- Form expansion: Fade in with upward motion (0.3s)
- Mode toggle: Crossfade between login/signup (0.3s)
- Field errors: Slide down with fade in (0.2s)
- Loading spinner: Continuous 360° rotation (1s per rotation)

**Micro-interactions:**
- Button hover: Subtle scale increase (1.02x)
- Button tap: Scale down (0.98x)
- Input focus: Subtle scale increase (1.01x)
- Link hover: Color transition (0.2s)

**Gradient Border Effect:**
- Purple-to-blue gradient on form container
- Slight blur effect for glow
- 20% opacity for subtle appearance

### 3.2 Performance Considerations

**Particle Optimization:**
- Desktop: 50 particles
- Mobile: Same count but reduced opacity (0.3)
- Use `@tsparticles/slim` instead of full package
- Disable interactivity (click, hover)
- Cap FPS at 60

**Animation Performance:**
- Use CSS transforms (GPU-accelerated)
- Avoid animating layout properties
- Use `will-change` sparingly
- Framer Motion uses hardware acceleration by default

**Scroll Performance:**
- Use passive event listeners
- Debounce scroll calculations if needed
- Use `requestAnimationFrame` for smooth updates

### 3.3 Testing Strategy

**Visual Testing:**
1. Verify sparkles render on hero section
2. Check gradient colors (purple #9333ea)
3. Scroll page and verify parallax effect
4. Click "Enter" button and verify form expansion
5. Toggle between login/signup modes
6. Submit form and verify loading animation
7. Test all hover states and micro-interactions

**Performance Testing:**
1. Check FPS during scroll (should maintain 60fps)
2. Monitor particle performance on mobile
3. Verify no layout shifts during animations
4. Check animation smoothness on low-end devices

---

## 4. Success Criteria

### Testing Checkpoints

1. **Installation**
   - [ ] `npm install` completes without errors
   - [ ] Framer Motion and tsparticles dependencies installed

2. **Sparkles Rendering**
   - [ ] Navigate to `/landing`
   - [ ] Purple sparkles visible in hero section
   - [ ] Particles move smoothly
   - [ ] No performance issues (60fps maintained)

3. **Parallax Effect**
   - [ ] Scroll down the page
   - [ ] Hero content fades out gradually
   - [ ] Hero content moves down with scroll
   - [ ] Transition is smooth and linear

4. **Form Animations - Initial State**
   - [ ] Form appears with fade-in animation
   - [ ] "Enter" button visible
   - [ ] Gradient border effect visible
   - [ ] Hover over "Enter" button shows scale animation

5. **Form Animations - Expansion**
   - [ ] Click "Enter" button
   - [ ] Button fades out smoothly
   - [ ] Form content fades in from below
   - [ ] Transition is smooth (no jank)

6. **Form Animations - Mode Toggle**
   - [ ] Switch from login to signup
   - [ ] First/last name fields slide in
   - [ ] Transition is smooth
   - [ ] Switch back to login
   - [ ] Fields slide out smoothly

7. **Input Animations**
   - [ ] Focus on email field
   - [ ] Subtle scale animation occurs
   - [ ] Focus ring appears
   - [ ] Same for all input fields

8. **Loading Animation**
   - [ ] Fill in valid form data
   - [ ] Click submit
   - [ ] Button shows loading spinner
   - [ ] Spinner rotates continuously
   - [ ] Button text changes to "Processing..."

9. **Error Animations**
   - [ ] Submit invalid form
   - [ ] Error messages slide down
   - [ ] Type in field to clear error
   - [ ] Error message fades out

10. **Mobile Performance**
    - [ ] Test on mobile viewport (< 768px)
    - [ ] Sparkles have reduced opacity
    - [ ] Animations still smooth
    - [ ] No lag or jank
    - [ ] Form fields stack correctly

11. **Cross-browser Testing**
    - [ ] Test in Chrome
    - [ ] Test in Firefox
    - [ ] Test in Safari
    - [ ] All animations work consistently

12. **No Errors**
    - [ ] No console errors
    - [ ] No console warnings
    - [ ] TypeScript check passes
    - [ ] Build completes successfully

---

## 5. Common Issues and Solutions

### Issue: Sparkles Not Rendering
**Symptom**: Hero section has no particles
**Solution**:
- Verify `client:load` directive on SparklesCore
- Check browser console for tsparticles errors
- Ensure @tsparticles dependencies are installed
- Check that component is imported correctly

### Issue: Poor Performance on Mobile
**Symptom**: Laggy scrolling or animations
**Solution**:
- Reduce `particleDensity` prop (try 30 instead of 50)
- Lower `maxSize` for particles
- Use `will-change: transform` on animated elements
- Disable sparkles entirely on very old devices

### Issue: Parallax Jumpy or Stuttering
**Symptom**: Hero content moves in jerky fashion
**Solution**:
- Use `requestAnimationFrame` for scroll calculations
- Add passive event listener flag
- Reduce calculation complexity
- Use CSS `transform` instead of `top/left`

### Issue: Form Animation Overlaps
**Symptom**: Expanding form shows both states briefly
**Solution**:
- Verify `AnimatePresence` is wrapping conditional content
- Use `mode="wait"` on AnimatePresence
- Check `key` props are unique and stable

### Issue: Framer Motion Build Errors
**Symptom**: Build fails with Framer Motion errors
**Solution**:
- Ensure React 19 compatibility
- Check Framer Motion version is 12.23.12+
- Verify component is using `client:load` directive

---

## 6. Defensive Programming Practices

### Client-Side Only Code
```typescript
// Always check for window before using browser APIs
if (typeof window !== 'undefined') {
  // Browser-only code here
}
```

### Cleanup Event Listeners
```typescript
document.addEventListener('astro:before-swap', () => {
  window.removeEventListener('scroll', handleScroll);
});
```

### Performance Guards
```typescript
// Reduce particles on mobile
const particleDensity = window.innerWidth < 768 ? 30 : 50;
```

### Graceful Degradation
- Animations enhance but aren't required
- Form still works if Framer Motion fails to load
- Sparkles are optional visual enhancement

---

## 7. Acceptance Criteria Summary

**This chunk is complete when:**

1. Sparkles render correctly on hero section with purple color
2. Scroll-based parallax effect works smoothly
3. Form expansion animation is smooth and polished
4. All micro-interactions (hover, focus, tap) work correctly
5. Loading animation displays during form submission
6. Error animations slide in/out properly
7. Mode toggle animation is smooth
8. Mobile performance is acceptable (no significant lag)
9. Animations work across Chrome, Firefox, and Safari
10. No console errors or warnings
11. Build and TypeScript checks pass

**Manual Testing Checklist:**
- [ ] Clean install and build
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile viewport
- [ ] Verify all animations spec requirements
- [ ] Check performance (60fps during scroll)
- [ ] Test form interactions with animations
- [ ] Verify sparkles render correctly
- [ ] Test parallax effect
- [ ] Verify no console errors
- [ ] Run `npm run check` - passes
- [ ] Run `npm run build` - succeeds

**Ready for Next Chunk:**
Once all animations are working smoothly and performance is acceptable, proceed to chunk 04 for production deployment configuration.

---

## 8. Mobile-Specific Considerations

### Viewport Meta Tag
Ensure in `Layout.astro`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Touch Interactions
- Framer Motion `whileTap` works on touch devices
- No hover state on mobile (use active states)
- Ensure buttons have sufficient touch targets (44x44px minimum)

### Performance Budget
- Hero sparkles: < 5% CPU usage
- Scroll animations: Maintain 60fps
- Form animations: < 300ms duration
- Total JavaScript: < 100KB (after gzip)

---

**End of PRD 001-03**
