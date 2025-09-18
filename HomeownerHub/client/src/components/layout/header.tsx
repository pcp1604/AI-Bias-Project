import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Audits", href: "/audits" },
    { name: "Reports", href: "/reports" },
    { name: "Settings", href: "/settings" },
  ];

  const isActive = (href: string) => {
    return location === href || (href === "/dashboard" && location === "/");
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Link href="/" data-testid="link-home">
                <h1 className="text-2xl font-bold text-primary">BiasGuard</h1>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} data-testid={`link-${item.name.toLowerCase()}`}>
                  <span
                    className={
                      isActive(item.href)
                        ? "text-primary border-b-2 border-primary pb-1 px-1"
                        : "text-muted-foreground hover:text-foreground pb-1 px-1 transition-colors"
                    }
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href} data-testid={`mobile-link-${item.name.toLowerCase()}`}>
                      <span
                        className={
                          isActive(item.href)
                            ? "text-primary font-medium block p-2"
                            : "text-muted-foreground hover:text-foreground block p-2 transition-colors"
                        }
                      >
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar data-testid="avatar-user">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
