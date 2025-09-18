import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Eye } from "lucide-react";
import { Link } from "wouter";
import type { Audit } from "@shared/schema";

export default function Audits() {
  const { data: audits, isLoading } = useQuery<Audit[]>({
    queryKey: ["/api/audits"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Bias Audits</h2>
          <p className="text-muted-foreground">Manage and track your AI fairness audits</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" data-testid="button-search-audits">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button data-testid="button-new-audit">
            <Plus className="w-4 h-4 mr-2" />
            New Audit
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-2 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : audits && audits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audits.map((audit) => (
            <Card key={audit.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Audit #{audit.id.slice(-8)}</CardTitle>
                  <Badge className={getStatusColor(audit.status)} data-testid={`badge-status-${audit.id}`}>
                    {audit.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Created {formatDate(audit.createdAt!)}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{audit.progress || 0}%</span>
                    </div>
                    <Progress value={audit.progress || 0} className="h-2" data-testid={`progress-${audit.id}`} />
                  </div>
                  
                  {audit.fairnessScore && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Fairness Score</span>
                      <span className="font-semibold text-green-600" data-testid={`score-${audit.id}`}>
                        {(audit.fairnessScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between gap-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-${audit.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {audit.status === "completed" && (
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/reports?auditId=${audit.id}`} data-testid={`button-report-${audit.id}`}>
                          Report
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Audits Found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first bias audit.
            </p>
            <Button data-testid="button-create-first-audit">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Audit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
