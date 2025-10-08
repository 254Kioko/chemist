import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import StatsCard from "@/components/dashboard/StatsCard";
import AlertsSection from "@/components/dashboard/AlertsSection";
import MedicineList from "@/components/inventory/MedicineList";
import { DollarSign, Package, AlertTriangle, TrendingUp } from "lucide-react";

const Index = () => {
  const [todaySales, setTodaySales] = useState(0);
  const [medicines, setMedicines] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch today's sales
      const today = new Date().toISOString().split('T')[0];
      const { data: salesData } = await supabase
        .from('sales')
        .select('total_amount')
        .gte('created_at', today);
      
      const total = salesData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      setTodaySales(total);

      // Fetch medicines
      const { data: medicinesData } = await supabase
        .from('medicines')
        .select('*')
        .order('name');
      
      setMedicines(medicinesData || []);

      // Generate alerts
      const newAlerts = [];
      
      // Low stock alerts
      const lowStock = medicinesData?.filter(m => m.stock_quantity <= m.reorder_level && m.stock_quantity > 0) || [];
      lowStock.forEach(med => {
        newAlerts.push({
          id: `low-${med.id}`,
          type: 'low-stock',
          title: med.name,
          description: `Only ${med.stock_quantity} units remaining. Reorder level: ${med.reorder_level}`,
        });
      });

      // Out of stock alerts
      const outOfStock = medicinesData?.filter(m => m.stock_quantity === 0) || [];
      outOfStock.forEach(med => {
        newAlerts.push({
          id: `out-${med.id}`,
          type: 'expired',
          title: med.name,
          description: 'Out of stock - immediate reorder required',
        });
      });

      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const lowStockCount = medicines.filter(m => m.stock_quantity <= m.reorder_level).length;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your pharmacy operations
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Today's Sales"
            value={`KSh ${todaySales.toFixed(2)}`}
            icon={DollarSign}
            variant="success"
          />
          <StatsCard
            title="Total Medicines"
            value={medicines.length}
            icon={Package}
            variant="default"
          />
          <StatsCard
            title="Low Stock Items"
            value={lowStockCount}
            icon={AlertTriangle}
            variant={lowStockCount > 0 ? "warning" : "default"}
          />
          <StatsCard
            title="Active Alerts"
            value={alerts.length}
            icon={TrendingUp}
            variant={alerts.length > 0 ? "destructive" : "default"}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AlertsSection alerts={alerts} />
          <MedicineList medicines={medicines} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
