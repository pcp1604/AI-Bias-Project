import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FairnessMetrics } from "@shared/schema";

interface MetricCardProps {
  title: string;
  value: number;
  threshold: number;
  testId: string;
}

function MetricCard({ title, value, threshold, testId }: MetricCardProps) {
  const percentage = Math.round(value * 100);
  const status = value >= threshold ? "good" : value >= threshold * 0.8 ? "moderate" : "poor";
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "moderate":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "poor":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStrokeColor = (status: string) => {
    switch (status) {
      case "good":
        return "stroke-emerald-500";
      case "moderate": 
        return "stroke-orange-500";
      case "poor":
        return "stroke-red-500";
      default:
        return "stroke-gray-400";
    }
  };

  // Calculate stroke offset for progress ring
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (value * circumference);

  return (
    <div className="p-4 border border-border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-foreground">{title}</h4>
        <Badge className={getStatusColor(status)} data-testid={`badge-${testId}`}>
          {status === "good" ? "Good" : status === "moderate" ? "Moderate" : "Poor"}
        </Badge>
      </div>
      <div className="relative w-20 h-20 mx-auto mb-3">
        <svg className="progress-ring w-20 h-20">
          <circle 
            className="stroke-muted" 
            strokeWidth="4" 
            fill="transparent" 
            r="40" 
            cx="40" 
            cy="40"
          />
          <circle 
            className={`progress-ring-circle ${getStrokeColor(status)} transition-all duration-500`}
            strokeWidth="4" 
            fill="transparent" 
            r="40" 
            cx="40" 
            cy="40"
            style={{ strokeDashoffset }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground" data-testid={`value-${testId}`}>
            {value.toFixed(2)}
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Threshold: {threshold.toFixed(1)}
      </p>
    </div>
  );
}

export default function FairnessMetrics() {
  const { data: metrics, isLoading } = useQuery<FairnessMetrics>({
    queryKey: ["/api/fairness-metrics", "audit-1"], // Using sample audit ID
  });

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Fairness Metrics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border border-border rounded-lg animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-3"></div>
                <div className="h-3 bg-muted rounded w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Fairness Metrics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No fairness metrics available. Complete a bias audit to see results.
          </p>
        </CardContent>
      </Card>
    );
  }

  const groupMetrics = metrics.groupMetrics as Record<string, { score: number; count: number }>;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle data-testid="title-fairness-metrics">Fairness Metrics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <MetricCard
            title="Demographic Parity"
            value={metrics.demographicParity || 0}
            threshold={0.8}
            testId="demographic-parity"
          />
          <MetricCard
            title="Equal Opportunity"
            value={metrics.equalOpportunity || 0}
            threshold={0.8}
            testId="equal-opportunity"
          />
          <MetricCard
            title="Calibration"
            value={metrics.calibration || 0}
            threshold={0.8}
            testId="calibration"
          />
        </div>

        {groupMetrics && (
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-4" data-testid="title-group-metrics">
              Fairness Metrics by Group
            </h4>
            <div className="space-y-3">
              {Object.entries(groupMetrics).map(([group, data]) => {
                const percentage = Math.round(data.score * 100);
                const barColor = 
                  data.score >= 0.8 ? "bg-primary" :
                  data.score >= 0.64 ? "bg-orange-500" : "bg-red-500";
                
                return (
                  <div key={group} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground w-20" data-testid={`group-${group}`}>
                      {group}
                    </span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-muted rounded-full h-4">
                        <div 
                          className={`${barColor} h-4 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                          data-testid={`bar-${group}`}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-12" data-testid={`score-${group}`}>
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
