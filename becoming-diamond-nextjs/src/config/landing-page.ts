/**
 * Landing Page Configuration
 *
 * Centralized configuration for the landing page components.
 * Extracted to improve maintainability and reduce page.tsx complexity.
 */

/**
 * Globe visualization configuration
 */
export const GLOBE_CONFIG = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

/**
 * Globe arc colors for different connections
 */
export const GLOBE_COLORS = ["#06b6d4", "#3b82f6", "#6366f1"];

/**
 * Sample arcs for globe visualization
 * Representing global community connections
 */
export const SAMPLE_ARCS = [
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.1,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 1,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.2,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -1.2921,
    endLng: 36.8219,
    arcAlt: 0.5,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 2,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.2,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 2,
    startLat: 51.5074,
    startLng: -0.1278,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.3,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 2,
    startLat: -15.785493,
    startLng: -47.909029,
    endLat: 36.162809,
    endLng: -115.119411,
    arcAlt: 0.3,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 3,
    startLat: -33.8688,
    startLng: 151.2093,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.3,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 3,
    startLat: 21.3099,
    startLng: -157.8581,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.3,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 3,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 51.5074,
    endLng: -0.1278,
    arcAlt: 0.3,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 4,
    startLat: 11.986597,
    startLng: 8.571831,
    endLat: -15.595412,
    endLng: -56.05918,
    arcAlt: 0.5,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 4,
    startLat: -34.6037,
    startLng: -58.3816,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.7,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 4,
    startLat: 51.5074,
    startLng: -0.1278,
    endLat: 48.8566,
    endLng: -2.3522,
    arcAlt: 0.1,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 5,
    startLat: 14.5995,
    startLng: 120.9842,
    endLat: 51.5074,
    endLng: -0.1278,
    arcAlt: 0.3,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 5,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: -33.8688,
    endLng: 151.2093,
    arcAlt: 0.2,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
  {
    order: 5,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 48.8566,
    endLng: -2.3522,
    arcAlt: 0.2,
    color: GLOBE_COLORS[Math.floor(Math.random() * GLOBE_COLORS.length)],
  },
];

/**
 * Solution section content
 */
export const SOLUTION_CONTENT = {
  title: "THE DIAMOND METHODOLOGY",
  subtitle: "A Complete System for Transformation",
  description: "The Diamond methodology is not just another training program. It is a comprehensive system designed to create lasting transformation through the integration of mind, body, and spirit.",
  features: [
    {
      title: "Scientific Foundation",
      description: "Built on proven principles of neuroscience, psychology, and peak performance research.",
    },
    {
      title: "Practical Application",
      description: "Every concept translates into actionable steps you can implement immediately.",
    },
    {
      title: "Community Support",
      description: "Join a global network of like-minded individuals committed to growth.",
    },
    {
      title: "Measurable Results",
      description: "Track your progress with clear metrics and milestones.",
    },
  ],
};

/**
 * Programs section content
 */
export const PROGRAMS_CONTENT = {
  title: "PROGRAMS",
  subtitle: "Choose Your Path to Transformation",
  programs: [
    {
      id: "sprint",
      title: "30-Day Diamond Sprint",
      description: "An intensive 30-day program designed to kickstart your transformation journey with daily lessons and exercises.",
      features: [
        "Daily video lessons",
        "Guided exercises",
        "Progress tracking",
        "Community access",
      ],
      cta: "Start Your Sprint",
      href: "/app/sprint",
      featured: true,
    },
    {
      id: "book",
      title: "The Diamond Book",
      description: "The complete guide to the Diamond methodology, covering all aspects of personal transformation.",
      features: [
        "Comprehensive guide",
        "Practical exercises",
        "Real-world examples",
        "Digital format",
      ],
      cta: "Get the Book",
      href: "/book",
      featured: false,
    },
    {
      id: "collective",
      title: "Diamond Collective",
      description: "Join our immersive community experience for deep transformation and ongoing support.",
      features: [
        "Live sessions",
        "Group coaching",
        "Exclusive content",
        "Lifetime access",
      ],
      cta: "Join the Collective",
      href: "/collective",
      featured: false,
    },
  ],
};
