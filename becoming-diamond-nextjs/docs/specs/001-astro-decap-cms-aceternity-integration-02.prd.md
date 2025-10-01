# PRD 001-02: React Integration and Core UI Components

**Version:** 1.0
**Date:** 2025-10-01
**Parent PRD:** 001-astro-decap-cms-aceternity-integration
**Status:** Ready for Implementation
**Estimated Complexity:** Medium
**Duration:** 4-6 hours

---

## 1. Scope

This chunk integrates React into the Astro project and creates the core UI components (Input, Label) and the interactive AuthForm component. The focus is on establishing React islands pattern and building the authentication UI without animations.

### What's Included
- React and React DOM integration
- Astro React adapter configuration
- Static UI components (Input, Label) as pure Astro components
- AuthForm as a React island component
- Basic form state management
- Form validation logic
- Landing page updates to use new components
- Responsive form layouts

### What's NOT Included
- Animations (saved for chunk 03)
- Sparkles/particle effects (saved for chunk 03)
- Framer Motion integration (saved for chunk 03)
- Real authentication backend (mock redirect only)
- Production deployment (saved for chunk 04)

### Dependencies
**Requires:**
- PRD 001-00 (Project Foundation) - completed
- PRD 001-01 (Decap CMS Integration) - completed

**Blocks:** PRD 001-03 (Animations and Effects)

---

## 2. Requirements

### 2.1 Additional Dependencies

Add to existing `package.json`:
```json
{
  "dependencies": {
    "@astrojs/react": "^4.3.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  }
}
```

### 2.2 Astro Configuration Update

**astro.config.mjs:**
```javascript
import { defineConfig } from "astro/config";
import decapCmsOauth from "astro-decap-cms-oauth";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react"; // Add React integration
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    decapCmsOauth({
      adminPath: '/admin',
      oauthLoginRoute: '/oauth'
    }),
    react(), // Enable React islands
    tailwind()
  ],
  server: {
    host: true,
    port: 4321,
    allowedHosts: ["localhost", "127.0.0.1"]
  }
});
```

### 2.3 Input Component (Pure Astro)

**src/components/ui/input.astro:**
```astro
---
interface Props {
  type?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  value?: string;
}

const {
  type = "text",
  id,
  name,
  placeholder,
  required = false,
  className = "",
  value = ""
} = Astro.props;
---

<input
  type={type}
  id={id}
  name={name}
  placeholder={placeholder}
  required={required}
  value={value}
  class={`
    w-full px-4 py-3 rounded-lg
    bg-white/5
    border border-white/10
    text-white placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
    transition-all duration-200
    ${className}
  `.trim()}
/>
```

### 2.4 Label Component (Pure Astro)

**src/components/ui/label.astro:**
```astro
---
interface Props {
  for?: string;
  className?: string;
  required?: boolean;
}

const {
  for: htmlFor,
  className = "",
  required = false
} = Astro.props;
---

<label
  for={htmlFor}
  class={`
    block text-sm font-medium text-gray-300 mb-2
    ${className}
  `.trim()}
>
  <slot />
  {required && <span class="text-red-500 ml-1">*</span>}
</label>
```

### 2.5 AuthForm Component (React Island)

**src/components/landing/AuthForm.tsx:**
```tsx
import { useState } from "react";

export default function AuthForm() {
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

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Sign up additional validations
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
    // Clear error for this field when user starts typing
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock successful authentication - redirect to /app
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
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
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
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
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
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
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
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
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
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full bg-purple-600 hover:bg-purple-700
              text-white font-medium py-3 px-6 rounded-lg
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-black
            `}
          >
            {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            {" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### 2.6 AuthSection Component

**src/components/landing/AuthSection.astro:**
```astro
---
import AuthForm from './AuthForm';
---

<section class="flex items-center justify-center min-h-[50vh] px-4 pb-20">
  <AuthForm client:load />
</section>
```

### 2.7 HeroSection Component

**src/components/landing/HeroSection.astro:**
```astro
---
// No props needed for this version
---

<section class="flex items-center justify-center min-h-screen px-4">
  <div class="text-center max-w-2xl mx-auto">
    <h1 class="text-5xl md:text-6xl lg:text-8xl font-bold mb-6 text-white">
      Aceternity AI
    </h1>
    <p class="text-lg md:text-xl text-gray-400 mb-8">
      Modern web experiences with elegant design
    </p>
  </div>
</section>
```

### 2.8 Updated Landing Page

**src/pages/landing.astro:**
```astro
---
import Layout from '../layouts/Layout.astro';
import HeroSection from '../components/landing/HeroSection.astro';
import AuthSection from '../components/landing/AuthSection.astro';
---

<Layout title="Aceternity AI">
  <main class="min-h-screen bg-black text-white">
    <HeroSection />
    <AuthSection />
  </main>
</Layout>
```

### 2.9 Placeholder App Page

**src/pages/app.astro:**
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="App - Aceternity AI">
  <main class="min-h-screen bg-black text-white flex items-center justify-center px-4">
    <div class="text-center max-w-2xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        Welcome to the App
      </h1>
      <p class="text-gray-400 mb-8">
        You have successfully authenticated!
      </p>
      <p class="text-gray-500 text-sm">
        This is a placeholder page. Real application features will be added in future phases.
      </p>
      <a
        href="/landing"
        class="inline-block mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
      >
        Back to Landing
      </a>
    </div>
  </main>
</Layout>
```

---

## 3. Implementation Details

### 3.1 React Islands Pattern

**Key Concepts:**
- Astro components are static by default (zero JavaScript)
- React components only hydrate when using `client:*` directives
- `client:load` hydrates component on page load
- Use React only for interactive components (forms, buttons with state)
- Keep presentational components as pure Astro

**When to use React vs Astro:**
- **Use Astro**: Static content, layout, simple UI components (Input, Label)
- **Use React**: Interactive forms, state management, complex user interactions

### 3.2 Form Validation Strategy

**Client-side validation:**
- Validate on form submission
- Clear errors as user types
- Show inline error messages
- Prevent submission if validation fails

**Validation rules:**
- Email: Required, valid email format
- Password: Required, minimum 8 characters
- First/Last Name (signup): Required, not empty

### 3.3 Mock Authentication Flow

For this phase, authentication is mocked:
1. User fills in form
2. Form validation runs
3. Loading state shows for 1.5 seconds (simulated API call)
4. Redirect to `/app` page
5. No actual session management or backend

**Note:** Real authentication will be added in future phases (not part of this PRD).

---

## 4. Success Criteria

### Testing Checkpoints

1. **Installation**
   - [ ] `npm install` completes without errors
   - [ ] React dependencies installed correctly

2. **Development Server**
   - [ ] `npm run dev` starts successfully
   - [ ] No React hydration errors in console

3. **Landing Page**
   - [ ] Navigate to `/landing`
   - [ ] Hero section displays correctly
   - [ ] Auth form displays below hero
   - [ ] Form is interactive (can type in inputs)

4. **Form Interaction - Login Mode**
   - [ ] Email and password fields visible
   - [ ] First name and last name fields NOT visible
   - [ ] Can type in email field
   - [ ] Can type in password field
   - [ ] Click "Sign Up" link switches to signup mode

5. **Form Interaction - Signup Mode**
   - [ ] All four fields visible (first name, last name, email, password)
   - [ ] Can type in all fields
   - [ ] Click "Sign In" link switches to login mode

6. **Form Validation**
   - [ ] Submit empty form shows validation errors
   - [ ] Invalid email shows error message
   - [ ] Short password (< 8 chars) shows error
   - [ ] Typing in field clears error for that field
   - [ ] Empty first/last name (signup) shows errors

7. **Form Submission**
   - [ ] Valid form submission shows loading state
   - [ ] Button text changes to "Processing..."
   - [ ] Button is disabled during loading
   - [ ] After 1.5s, redirects to `/app` page

8. **App Page**
   - [ ] `/app` page displays success message
   - [ ] "Back to Landing" link works

9. **Responsive Design**
   - [ ] Form is full-width on mobile (< 768px)
   - [ ] Form fields stack properly on mobile
   - [ ] Name fields in signup are side-by-side on desktop
   - [ ] Name fields stack on mobile

10. **No Errors**
    - [ ] No console errors in browser
    - [ ] No hydration mismatches
    - [ ] No TypeScript errors

---

## 5. Common Issues and Solutions

### Issue: React Hydration Mismatch
**Symptom**: Console warning about hydration mismatch
**Solution**:
- Ensure server and client render the same initial HTML
- Don't use random values or dates in initial render
- Use `client:load` directive consistently

### Issue: Form State Not Working
**Symptom**: Can't type in form fields
**Solution**:
- Verify `client:load` directive on AuthForm
- Check React and ReactDOM versions are compatible
- Ensure event handlers are properly bound

### Issue: Styling Not Applied
**Symptom**: Form looks unstyled or incorrect
**Solution**:
- Verify Tailwind is processing className on React components
- Check that global.css is imported in Layout
- Use `className` (not `class`) in React components

### Issue: Redirect Not Working
**Symptom**: Form submits but doesn't redirect
**Solution**:
- Check browser console for errors
- Verify `/app` route exists
- Ensure no preventDefault blocking navigation

---

## 6. Defensive Programming Practices

### Type Safety
```tsx
// Use proper TypeScript types
interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Validate all inputs
const validateEmail = (email: string): boolean => {
  // Implementation
};
```

### Error Boundaries
```tsx
// Clear errors when user starts typing
if (errors[name]) {
  setErrors(prev => {
    const newErrors = { ...prev };
    delete newErrors[name];
    return newErrors;
  });
}
```

### Prevent Double Submission
```tsx
// Disable button during submission
disabled={isLoading}
```

### Graceful Degradation
- Form still works without JavaScript (basic HTML form)
- Error messages are clear and actionable
- Loading states provide feedback

---

## 7. Acceptance Criteria Summary

**This chunk is complete when:**

1. React is successfully integrated into Astro project
2. Input and Label components work as pure Astro components
3. AuthForm component works as React island with `client:load`
4. Form switches between login and signup modes
5. Form validation works for all fields
6. Form submission shows loading state and redirects to `/app`
7. Responsive design works on mobile, tablet, and desktop
8. No console errors or hydration issues
9. All TypeScript checks pass

**Manual Testing Checklist:**
- [ ] Clean install and start dev server
- [ ] Navigate to `/landing`
- [ ] Test login form validation
- [ ] Test signup form validation
- [ ] Switch between login/signup modes
- [ ] Submit valid form and verify redirect
- [ ] Test on mobile viewport (< 768px)
- [ ] Test on tablet viewport (768-1024px)
- [ ] Test on desktop viewport (> 1024px)
- [ ] Verify no console errors
- [ ] Run `npm run check` - passes

**Ready for Next Chunk:**
Once forms are working correctly and responsive design is verified, proceed to chunk 03 for animations and particle effects.

---

**End of PRD 001-02**
