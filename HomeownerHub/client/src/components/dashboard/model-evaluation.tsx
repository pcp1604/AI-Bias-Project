import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import type { FairnessMetrics, Report } from "@shared/schema";

export default function ModelEvaluation() {
  const { data: metrics, isLoading: metricsLoading } = useQuery<FairnessMetrics>({
    queryKey: ["/api/fairness-metrics", "audit-1"],
  });

  const { data: reports, isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = (report: Report) => {
    console.log("Downloading report:", report.title);
    // In real app, this would trigger actual download
  };

  if (metricsLoading) {
    return (
      <div className="space-y-8">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-3 gap-2 max-w-md">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const confusionMatrix = metrics?.confusionMatrix as any;

  return (
    <div className="space-y-8">
      {/* Model Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle data-testid="title-model-performance">Model Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {confusionMatrix && (
            <div className="mb-6">
              <h4 className="font-medium text-foreground mb-4">Confusion Matrix</h4>
              <div className="grid grid-cols-3 gap-2 max-w-md">
                <div></div>
                <div className="text-center text-sm font-medium text-muted-foreground">Predicted No</div>
                <div className="text-center text-sm font-medium text-muted-foreground">Predicted Yes</div>
                
                <div className="text-sm font-medium text-muted-foreground">Actual No</div>
                <div className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 p-3 rounded text-center font-bold" data-testid="matrix-tn">
                  {confusionMatrix.tn}
                </div>
                <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 p-3 rounded text-center font-bold" data-testid="matrix-fp">
                  {confusionMatrix.fp}
                </div>
                
                <div className="text-sm font-medium text-muted-foreground">Actual Yes</div>
                <div className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 p-3 rounded text-center font-bold" data-testid="matrix-fn">
                  {confusionMatrix.fn}
                </div>
                <div className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 p-3 rounded text-center font-bold" data-testid="matrix-tp">
                  {confusionMatrix.tp}
                </div>
              </div>
            </div>
          )}

          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground" data-testid="metric-accuracy">
                  {(metrics.accuracy! * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground" data-testid="metric-precision">
                  {(metrics.precision! * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Precision</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground" data-testid="metric-recall">
                  {(metrics.recall! * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Recall</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground" data-testid="metric-f1">
                  {(metrics.f1Score! * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">F1-Score</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle data-testid="title-recent-reports">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reportsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg animate-pulse">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-muted rounded-lg mr-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : reports && reports.length > 0 ? (
            <div className="space-y-4">
              {reports.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  data-testid={`report-${report.id}`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm" data-testid={`report-title-${report.id}`}>
                        {report.title}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Generated {formatDate(report.generatedAt!)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(report)}
                    data-testid={`button-download-report-${report.id}`}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <Button className="w-full mt-4" data-testid="button-generate-report">
                Generate New Report
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No reports available. Complete an audit to generate reports.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
