import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, BarChart3, Settings } from "lucide-react";
import { Link } from "wouter";

export default function QuickActions() {
  const actions = [
    {
      title: "New Audit",
      description: "Start bias analysis",
      icon: Plus,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      href: "/audits",
      testId: "action-new-audit"
    },
    {
      title: "Upload Data",
      description: "Add model files", 
      icon: Upload,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      href: "#",
      testId: "action-upload-data"
    },
    {
      title: "View Analytics",
      description: "Detailed metrics",
      icon: BarChart3,
      iconBg: "bg-secondary/10", 
      iconColor: "text-secondary",
      href: "/reports",
      testId: "action-view-analytics"
    },
    {
      title: "Settings",
      description: "Configure platform",
      icon: Settings,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      href: "/settings",
      testId: "action-settings"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle data-testid="title-quick-actions">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="ghost"
                className="h-auto p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group w-full"
                data-testid={action.testId}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 ${action.iconBg} rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`${action.iconColor} w-6 h-6`} />
                  </div>
                  <p className="font-medium text-foreground">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
