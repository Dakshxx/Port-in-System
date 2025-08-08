import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  ArrowLeftRight, 
  RotateCcw, 
  FileText, 
  LogOut,
  Menu,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Port In', href: '/port-in', icon: ArrowRightLeft },
    { name: 'Port Out', href: '/port-out', icon: ArrowLeftRight },
    { name: 'Snapback', href: '/snapback', icon: RotateCcw },
    { name: 'Reasons', href: '/reasons', icon: FileText },
    { name: 'Complaint', href: '/complaint', icon: MessageSquare },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-info rounded-lg flex items-center justify-center shadow-lg">
                <ArrowRightLeft className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                TelePort MNP
              </span>
            </Link>
          </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="text-sm text-muted-foreground">
              Welcome, Admin
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border mt-2 pt-2 pb-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-border pt-3 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}