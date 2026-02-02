export type Role = "admin" | "editor" | "viewer";
export type Action = "create" | "read" | "update" | "delete";

export const rolePermissions: Record<Role, Action[]> = {
  admin: ["create", "read", "update", "delete"],
  editor: ["read", "update"],
  viewer: ["read"],
};

export function hasPermission(role: Role, action: Action): boolean {
  return rolePermissions[role]?.includes(action);
}
