// Role to route mapping
const roleRouteMap = {
  parent: '/parent-login',
  student: '/student-login',
  school: '/school-login',
} as const;

type Role = keyof typeof roleRouteMap;

/**
 * Get the appropriate route for a given role
 * @param role - The user role (parent, student, school)
 * @returns The route path for that role
 */
export function getRouteForRole(role: string): string {
  return roleRouteMap[role as Role] || '/auth?role=student';
}

/**
 * Navigate to the appropriate page based on role
 * @param role - The user role
 * @param navigate - React Router's navigate function
 */
export function navigateToRolePage(role: string, navigate: (path: string) => void) {
  const route = getRouteForRole(role);
  navigate(route);
}

export type { Role };
