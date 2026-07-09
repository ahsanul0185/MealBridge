export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "restaurant" | "ngo";
  address?: string;
  area: string;
  created_at: string;
}
