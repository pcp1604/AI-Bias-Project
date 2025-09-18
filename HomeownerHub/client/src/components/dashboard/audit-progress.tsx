import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Settings, Clock } from "lucide-react";
import type { Audit } from "@shared/schema";

export default function AuditProgress() {
  const { data: audits, isLoading } = useQuery<Audit[]>({
    queryKey: ["/api/audits"],
  });

  const currentAudit = audits?.find(audit => audit.status === "in_progress");

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const steps = [
    {
      title: "Data Upload",
      description: "Model data uploaded successfully",
      status: "completed",
      icon: CheckCircle,
      iconColor: "text-emerald-500"
    },
    {
      title: "Bias Analysis", 
      description: currentAudit ? "Running fairness metrics calculation" : "Ready to start analysis",
      status: currentAudit ? "in_progress" : "pending",
      icon: Settings,
      iconColor: currentAudit ? "text-primary" : "text-muted-foreground"
    },
    {
      title: "Report Generation",
      description: currentAudit ? "Pending analysis completion" : "Waiting for analysis",
      status: "pending",
      icon: Clock,
      iconColor: "text-muted-foreground"
    }
  ];

  const progress = currentAudit?.progress || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle data-testid="title-audit-progress">Bias Audit Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center" data-testid={`step-${index}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                step.status === "completed" ? "bg-emerald-500" : 
                step.status === "in_progress" ? "bg-primary" : "bg-muted"
              }`}>
                {step.status === "completed" ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : step.status === "in_progress" ? (
                  <Settings className="h-5 w-5 text-primary-foreground animate-spin" />
                ) : (
                  <span className="text-muted-foreground text-sm">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                }`}>
                  {step.title}
                </p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              <span className={`text-sm font-medium ${
                step.status === "completed" ? "text-emerald-600" :
                step.status === "in_progress" ? "text-primary" : "text-muted-foreground"
              }`}>
                {step.status === "completed" ? "Complete" :
                 step.status === "in_progress" ? "In Progress" : "Pending"}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
            data-testid="progress-bar"
          ></div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground" data-testid="progress-text">
            Progress: {progress}%
          </span>
          <Button data-testid="button-continue-audit">
            Continue Audit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
