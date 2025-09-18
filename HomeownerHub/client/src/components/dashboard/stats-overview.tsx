import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Search, BarChart3, AlertTriangle } from "lucide-react";

interface DashboardStats {
  totalModels: number;
  activeAudits: number;
  fairnessScore: number;
  riskAlerts: number;
}

export default function StatsOverview() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-muted rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      title: "Total Models",
      value: stats.totalModels,
      icon: TrendingUp,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      testId: "stat-total-models"
    },
    {
      title: "Active Audits", 
      value: stats.activeAudits,
      icon: Search,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      testId: "stat-active-audits"
    },
    {
      title: "Fairness Score",
      value: `${stats.fairnessScore}%`,
      icon: BarChart3,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      testId: "stat-fairness-score"
    },
    {
      title: "Risk Alerts",
      value: stats.riskAlerts,
      icon: AlertTriangle,
      iconBg: "bg-orange-100 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      testId: "stat-risk-alerts"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item) => (
        <Card key={item.title} className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <p className="text-3xl font-bold text-foreground" data-testid={item.testId}>
                  {item.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${item.iconBg} rounded-full flex items-center justify-center`}>
                <item.icon className={`${item.iconColor} h-6 w-6`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
