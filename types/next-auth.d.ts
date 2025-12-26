/**
 * NextAuth.js Type Extensions
 *
 * Extends NextAuth session and user types to include custom fields.
 */

import "next-auth";

declare module "next-auth" {
  /**
   * Extended session interface
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  /**
   * Extended user interface
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
  }
}
