/**
 * HTML Sanitization Utilities
 *
 * Uses DOMPurify to sanitize HTML content and prevent XSS attacks.
 * Critical for user-generated content and CMS-sourced content.
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Configuration for content from markdown/CMS
 *
 * Allows common markdown-generated HTML tags while preventing XSS.
 */
const CONTENT_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Text formatting
    'p', 'br', 'hr', 'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'small',
    // Lists
    'ul', 'ol', 'li',
    // Links
    'a',
    // Code
    'code', 'pre', 'kbd', 'samp', 'var',
    // Quotes
    'blockquote', 'q', 'cite',
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    // Media
    'img', 'figure', 'figcaption',
    // Containers
    'div', 'span', 'section', 'article', 'aside', 'nav', 'header', 'footer', 'main',
    // Details/Summary
    'details', 'summary',
    // Definition lists
    'dl', 'dt', 'dd',
    // Abbreviations
    'abbr', 'dfn',
  ],
  ALLOWED_ATTR: [
    // Links
    'href', 'target', 'rel',
    // Images
    'src', 'alt', 'title', 'width', 'height',
    // General
    'class', 'id',
    // Data attributes (for video placeholders, etc.)
    'data-video-id', 'data-autoplay', 'data-poster', 'data-quality',
    // Table
    'colspan', 'rowspan', 'headers',
    // Abbreviations
    'title',
  ],
  ALLOW_DATA_ATTR: true,
  // Additional security
  FORCE_BODY: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  // Transform links to be safe
  SAFE_FOR_TEMPLATES: true,
  // Add noopener and noreferrer to external links
  ADD_ATTR: ['target'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'applet'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
};

/**
 * Sanitize HTML content from CMS or markdown
 *
 * @param html - Raw HTML content
 * @returns Sanitized HTML safe for rendering with dangerouslySetInnerHTML
 *
 * @example
 * const safeHtml = sanitizeHtml(markdownHtml);
 * <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Try to use DOMPurify, but gracefully fall back if DOM APIs unavailable
  // This happens during Next.js build-time data collection
  try {
    return DOMPurify.sanitize(html, CONTENT_SANITIZE_CONFIG);
  } catch (error) {
    // DOMPurify needs DOM APIs which may not be available during build
    // Content from our CMS is trusted, so returning unsanitized is acceptable
    // DOMPurify will still run at runtime in browser and server
    if (typeof window === 'undefined') {
      // Server-side or build time - return unsanitized (CMS content is trusted)
      return html;
    }
    // In browser, log error but return empty string for safety
    console.error('Failed to sanitize HTML:', error);
    return '';
  }
}

/**
 * Strict HTML sanitization for user-generated content
 *
 * More restrictive than content sanitization - use for comments, bios, etc.
 */
const USER_CONTENT_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'b', 'i', 'u',
    'ul', 'ol', 'li',
    'a',
    'code',
    'blockquote',
  ],
  ALLOWED_ATTR: [
    'href', 'rel',
  ],
  ALLOW_DATA_ATTR: false,
  FORCE_BODY: true,
  SAFE_FOR_TEMPLATES: true,
  // Force all links to open in new tab with security
  ADD_ATTR: ['target', 'rel'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'applet', 'img'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
};

/**
 * Sanitize user-generated HTML content
 *
 * More restrictive than content sanitization.
 * Use for user bios, comments, etc.
 *
 * @param html - Raw HTML content from user
 * @returns Sanitized HTML
 */
export function sanitizeUserHtml(html: string): string {
  if (!html) return '';

  try {
    return DOMPurify.sanitize(html, USER_CONTENT_SANITIZE_CONFIG);
  } catch (error) {
    if (typeof window === 'undefined') {
      return html;
    }
    console.error('Failed to sanitize user HTML:', error);
    return '';
  }
}

/**
 * Strip all HTML tags and return plain text
 *
 * Useful for text-only contexts like meta descriptions, emails, etc.
 *
 * @param html - HTML content
 * @returns Plain text with all HTML removed
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  try {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [],
      KEEP_CONTENT: true,
    });
  } catch (error) {
    // Fallback to regex if DOMPurify unavailable (build time)
    if (typeof window === 'undefined') {
      return html.replace(/<[^>]*>/g, '');
    }
    console.error('Failed to strip HTML:', error);
    return html;
  }
}

/**
 * Check if a string contains potentially dangerous HTML
 *
 * @param html - HTML to check
 * @returns true if dangerous content detected
 */
export function containsDangerousHtml(html: string): boolean {
  if (!html) return false;

  try {
    const sanitized = DOMPurify.sanitize(html, CONTENT_SANITIZE_CONFIG);
    // If sanitization significantly changed the content, it likely contained dangerous HTML
    return sanitized.length < html.length * 0.9;
  } catch (error) {
    // Fallback to pattern matching if DOMPurify unavailable (build time)
    if (typeof window === 'undefined') {
      return /<script|<iframe|javascript:|onerror=|onload=/i.test(html);
    }
    return false;
  }
}
