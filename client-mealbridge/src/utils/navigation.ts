export interface NavItem {
  label: string;
  path: string;
  icon: string; // SVG path or icon name
}

export interface RoleNavigation {
  role: "restaurant" | "ngo";
  items: NavItem[];
}

const restaurantNav: NavItem[] = [
  {
    label: "Dashboard",
    path: "/restaurant/dashboard",
    icon: "dashboard",
  },
  {
    label: "Add Donation",
    path: "/restaurant/donate",
    icon: "plus",
  },
  {
    label: "My Donations",
    path: "/restaurant/donations",
    icon: "donation",
  },
];

const ngoNav: NavItem[] = [
  {
    label: "Dashboard",
    path: "/ngo/dashboard",
    icon: "dashboard",
  },
  {
    label: "Available Food",
    path: "/ngo/food",
    icon: "food",
  },
  {
    label: "My Claims",
    path: "/ngo/claims",
    icon: "claims",
  },
];

export const roleNavigation: Record<string, NavItem[]> = {
  restaurant: restaurantNav,
  ngo: ngoNav,
};

export function getNavItems(role: "restaurant" | "ngo"): NavItem[] {
  return roleNavigation[role] || [];
}
