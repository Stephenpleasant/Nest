import {
    LayoutDashboard,
    Users,
    Building2,
    Wallet,
    ShieldCheck,
    UserRound,
  } from "lucide-react";
  
  export const NAV_ITEMS = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      children: [
        { id: "all-agents", label: "All Agents", icon: ShieldCheck },
        { id: "all-users",  label: "All Users",  icon: UserRound, badge: "12" },
      ],
    },
    { id: "properties", label: "View Properties", icon: Building2 },
    { id: "withdraw",   label: "Withdraw",         icon: Wallet },
  ];
  
  export const USER_INFO = {
    name: "Admin User",
    role: "Super Admin",
    initials: "AU",
  };
  
  export const PAGES = {
    dashboard:    { title: "Dashboard",       subtitle: "Welcome back. Here's what's happening today.", emoji: "📊" },
    "all-agents": { title: "All Agents",      subtitle: "Manage and monitor all registered agents.",    emoji: "🛡️" },
    "all-users":  { title: "All Users",       subtitle: "View and manage every user on the platform.",  emoji: "👥" },
    properties:   { title: "View Properties", subtitle: "Browse all listed and available properties.",  emoji: "🏠" },
    withdraw:     { title: "Withdraw",        subtitle: "Manage withdrawal requests and transactions.", emoji: "💳" },
  };