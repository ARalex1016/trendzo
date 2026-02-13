// Type
import type { IUser, Role } from "@/types/user.types"
import type { IProduct } from "@/types/product.type"
import type { ICategory } from "@/types/category.type"

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: IUser, data: Permissions[Key]["dataType"]) => boolean)

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>
    }>
  }>
}

type Permissions = {
    product: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: IProduct
    action: "view" | "create" | "update" | "delete"
    }
    category: {
        dataType: ICategory
        action: "view" | "create" | "update" | "delete"
    }
}

const ROLES = {
  admin: { 
    product: {
        view: true,
        create: true,
        update: true,
        delete: true,
    },
    category: {
        view: true,
        create: true,
        update: true,
        delete: true,
    }
  },
  operator: {
    product: {
        view: true,
        create: true,
        update: true,
        delete: false,
    },
    category: {
        view: true,
        create: true,
        update: true,
        delete: false,
    }
  },
  customer: {
    product: {
        view: true,
        create: false,
        update: false,
        delete: false
    },
    category: {
        view: true,
        create: false,
        update: false,
        delete: false,
    }
  },
} as const satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
  user: IUser,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  const role = user.role

  const permission =
    (ROLES as RolesWithPermissions)[role]?.[resource]?.[action]

  if (permission == null) return false

  if (typeof permission === "boolean") return permission

  return data != null && permission(user, data)
}

// USAGE:

// Can create a comment
// hasPermission(user, "comments", "create")

// Can view the `todo` Todo
// hasPermission(user, "todos", "view", todo)

// Can view all todos
// hasPermission(user, "todos", "view")