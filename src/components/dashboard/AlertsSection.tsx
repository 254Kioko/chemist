import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Clock, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AlertItem {
  id: string;
  type: "expired" | "expiring" | "low-stock";
  title: string;
  description: string;
}

interface AlertsSectionProps {
  alerts: AlertItem[];
}

const AlertsSection = ({ alerts }: AlertsSectionProps) => {
  const getAlertIcon = (type: AlertItem["type"]) => {
    switch (type) {
      case "expired":
        return <AlertTriangle className="h-4 w-4" />;
      case "expiring":
        return <Clock className="h-4 w-4" />;
      case "low-stock":
        return <Package className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: AlertItem["type"]) => {
    switch (type) {
      case "expired":
        return "destructive";
      case "expiring":
        return "default";
      case "low-stock":
        return "default";
    }
  };

  const getAlertBadgeVariant = (type: AlertItem["type"]) => {
    switch (type) {
      case "expired":
        return "destructive";
      case "expiring":
        return "outline";
      case "low-stock":
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts & Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No alerts at the moment
          </p>
        ) : (
          alerts.map((alert) => (
            <Alert key={alert.id} variant={getAlertVariant(alert.type)}>
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTitle className="mb-0">{alert.title}</AlertTitle>
                    <Badge variant={getAlertBadgeVariant(alert.type)} className="text-xs">
                      {alert.type.replace("-", " ")}
                    </Badge>
                  </div>
                  <AlertDescription>{alert.description}</AlertDescription>
                </div>
              </div>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsSection;
