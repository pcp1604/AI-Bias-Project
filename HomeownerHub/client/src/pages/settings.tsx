import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Shield, User, Database } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your platform configuration and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" data-testid="input-first-name" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" data-testid="input-last-name" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@company.com" data-testid="input-email" />
            </div>
            <div>
              <Label htmlFor="organization">Organization</Label>
              <Input id="organization" placeholder="Your Company Inc." data-testid="input-organization" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="text-base font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about audit progress and results
                </p>
              </div>
              <Switch id="email-notifications" data-testid="switch-email-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="bias-alerts" className="text-base font-medium">
                  Bias Risk Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when bias risks are detected in your models
                </p>
              </div>
              <Switch id="bias-alerts" data-testid="switch-bias-alerts" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-reports" className="text-base font-medium">
                  Weekly Summary Reports
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly summaries of your audit activities
                </p>
              </div>
              <Switch id="weekly-reports" data-testid="switch-weekly-reports" />
            </div>
          </CardContent>
        </Card>

        {/* Audit Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Audit Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fairness-threshold">Fairness Score Threshold</Label>
              <Select>
                <SelectTrigger data-testid="select-fairness-threshold">
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.7">70% (Moderate)</SelectItem>
                  <SelectItem value="0.8">80% (Recommended)</SelectItem>
                  <SelectItem value="0.9">90% (Strict)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Models below this threshold will be flagged for review
              </p>
            </div>
            
            <div>
              <Label htmlFor="protected-attributes">Default Protected Attributes</Label>
              <Textarea 
                id="protected-attributes"
                placeholder="age, gender, race, religion, disability_status"
                className="min-h-[100px]"
                data-testid="textarea-protected-attributes"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Comma-separated list of attributes to monitor for bias
              </p>
            </div>

            <div>
              <Label htmlFor="audit-frequency">Automatic Audit Frequency</Label>
              <Select>
                <SelectTrigger data-testid="select-audit-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Only</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Data Retention</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically delete audit data after specified period
                </p>
              </div>
              <Select>
                <SelectTrigger className="w-32" data-testid="select-data-retention">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Export Data</Label>
                <p className="text-sm text-muted-foreground">
                  Download all your audit data and reports
                </p>
              </div>
              <Button variant="outline" data-testid="button-export-data">
                Export
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-destructive">Delete Account</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" data-testid="button-delete-account">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" data-testid="button-cancel">
            Cancel
          </Button>
          <Button data-testid="button-save-settings">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
