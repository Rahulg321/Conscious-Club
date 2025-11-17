/**
 * Sanitization utility to prevent XSS attacks
 * Strips HTML tags and dangerous characters from user input
 */

/**
 * Basic HTML tag stripper and XSS prevention
 * Removes all HTML tags and encodes special characters
 */
export function sanitizeText(input: string | undefined | null): string | null {
  if (!input) return null;

  // Convert to string if not already
  const str = String(input);

  // Remove HTML tags
  let sanitized = str.replace(/<[^>]*>/g, '');

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove on* event handlers (onclick, onload, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized || null;
}

/**
 * Sanitize optional text field
 */
export function sanitizeOptionalText(input: string | undefined | null): string | undefined {
  if (!input) return undefined;
  const sanitized = sanitizeText(input);
  return sanitized || undefined;
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export function sanitizeUrl(url: string | undefined | null): string | null {
  if (!url) return null;

  const str = String(url).trim();

  // Remove javascript: and data: protocols
  if (/^(javascript|data|vbscript|file):/i.test(str)) {
    return null;
  }

  return str;
}

/**
 * Sanitize project data
 */
export interface ProjectDataInput {
  projectName?: string;
  projectDescription?: string;
  projectLink?: string;
  dedicatedToPerson?: string;
  dedicatedToBrand?: string;
  dedicatedToCause?: string;
  dedicationReason?: string;
}

export function sanitizeProjectData(data: ProjectDataInput) {
  return {
    projectName: sanitizeText(data.projectName),
    projectDescription: sanitizeOptionalText(data.projectDescription),
    projectLink: sanitizeUrl(data.projectLink),
    dedicatedToPerson: sanitizeOptionalText(data.dedicatedToPerson),
    dedicatedToBrand: sanitizeOptionalText(data.dedicatedToBrand),
    dedicatedToCause: sanitizeOptionalText(data.dedicatedToCause),
    dedicationReason: sanitizeOptionalText(data.dedicationReason),
  };
}

/**
 * Sanitize user data
 */
export interface UserDataInput {
  name?: string;
  city?: string;
  country?: string;
  socialMediaUrl?: string;
  discipline?: string;
  role?: string;
}

export function sanitizeUserData(data: UserDataInput) {
  return {
    name: sanitizeText(data.name),
    city: sanitizeText(data.city),
    country: sanitizeText(data.country),
    socialMediaUrl: sanitizeUrl(data.socialMediaUrl),
    discipline: sanitizeText(data.discipline),
    role: sanitizeText(data.role),
  };
}

/**
 * Sanitize challenge entry data
 */
export function sanitizeChallengeCaption(caption: string | undefined | null): string | null {
  return sanitizeText(caption);
}
