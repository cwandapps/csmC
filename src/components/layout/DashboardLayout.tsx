import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard, Users, Cpu, ClipboardList, BarChart3, Settings,
  CreditCard, Sun, Moon, LogOut, Menu, X, ChevronDown, Share2, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Users", icon: Users, path: "/dashboard/users" },
  { label: "Devices", icon: Cpu, path: "/dashboard/devices" },
  { label: "Attendance", icon: ClipboardList, path: "/dashboard/attendance" },
  { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { label: "Shared Display", icon: Share2, path: "/dashboard/shared-display" },
];

const bottomItems = [
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  { label: "Billing", icon: CreditCard, path: "/dashboard/billing" },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }: { item: typeof navItems[0] }) => (
    <Link
      to={item.path}
      onClick={() => setSidebarOpen(false)}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
        isActive(item.path)
          ? "gradient-primary-bold text-primary-foreground shadow-sm"
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
      )}
    >
      <item.icon className="w-5 h-5 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-primary-bold flex items-center justify-center">
          <Cpu className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg">CSMS</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => <NavItem key={item.path} item={item} />)}
      </nav>

      <div className="px-3 pb-2 space-y-1 border-t border-sidebar-border pt-3">
        {bottomItems.map((item) => <NavItem key={item.path} item={item} />)}
      </div>

      <div className="p-3 border-t border-sidebar-border">
        <div className="glass-card rounded-lg p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Free Trial</p>
          <p className="text-sm font-semibold">
            {Math.max(0, Math.ceil((new Date(user?.trialEndsAt || "").getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left
          </p>
          <Link to="/dashboard/billing">
            <Button size="sm" className="w-full mt-2 gradient-primary-bold text-primary-foreground text-xs h-8">
              Upgrade plan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 border-r border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-lg flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div>
              <p className="text-sm font-medium">{user?.organizationName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="gradient-primary-bold text-primary-foreground text-xs">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">{user?.firstName}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings">
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/billing">
                    <CreditCard className="w-4 h-4 mr-2" /> Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
