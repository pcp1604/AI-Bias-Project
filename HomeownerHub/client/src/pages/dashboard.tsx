import StatsOverview from "@/components/dashboard/stats-overview";
import AuditProgress from "@/components/dashboard/audit-progress";
import FileUpload from "@/components/dashboard/file-upload";
import FairnessMetrics from "@/components/dashboard/fairness-metrics";
import ModelEvaluation from "@/components/dashboard/model-evaluation";
import QuickActions from "@/components/dashboard/quick-actions";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">AI Fairness Dashboard</h2>
        <p className="text-muted-foreground">Monitor and evaluate bias across your machine learning models</p>
      </div>

      <StatsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AuditProgress />
        <FileUpload />
      </div>

      <FairnessMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <ModelEvaluation />
        </div>
        <div>
          {/* Recent Reports component will be in ModelEvaluation */}
        </div>
      </div>

      <QuickActions />
    </div>
  );
}
