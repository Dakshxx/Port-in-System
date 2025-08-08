import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Plus,
  ArrowRightLeft,
  ArrowLeftRight,
  RotateCcw,
  FileBarChart,
  MessageSquareWarning,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { dashboardApi, subscriberApi } from '@/services/api';
import { PortRecord, DashboardStats } from '@/types/telecom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allPortRecords, setAllPortRecords] = useState<PortRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewSubDialogOpen, setIsNewSubDialogOpen] = useState(false);
  const [newSubscriberData, setNewSubscriberData] = useState({
    MSISDN: '',
    ZONE: 1, // Defaulting to a number
    LSA: '',
    OID: '',
    BC_STATUS: 'Active',
    CREATE_ON: new Date().toISOString(),
    UPDATE_ON: new Date().toISOString(),
    PORT_ON: new Date().toISOString(),
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view the dashboard.",
        variant: "destructive",
      });
      navigate('/login');
      setLoading(false);
      return;
    }
    try {
      const fetchedStats: DashboardStats = await dashboardApi.getStats();
      const allSubscribers: PortRecord[] = await subscriberApi.getSubscribers();
      setStats(fetchedStats);
      setAllPortRecords(Array.isArray(allSubscribers) ? allSubscribers : []);
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to load dashboard data.");
      setAllPortRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNewSubscriberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscriberApi.createSubscriber({
        ...newSubscriberData,
        ZONE: Number(newSubscriberData.ZONE) // Ensure ZONE is a number
      });
      toast({
        title: "Subscriber Created",
        description: `Successfully stored record for ${newSubscriberData.MSISDN}.`,
      });
      setIsNewSubDialogOpen(false);
      setNewSubscriberData({ // Reset form
        MSISDN: '', ZONE: '', LSA: '', OID: '', BC_STATUS: 'Active',
      });
      fetchDashboardData(); // Refresh the data to show the new record
    } catch (err: any) {
      toast({
        title: "Creation Failed",
        description: err.message || "Could not store the new record.",
        variant: "destructive",
      });
    }
  };

  const statCards = stats ? [
    { title: "All time ports", value: (stats.totalPorts || 0).toLocaleString(), icon: Users, color: "text-primary" },
    { title: "Incoming ports today", value: (stats.portInToday || 0).toLocaleString(), icon: ArrowRightLeft, color: "text-success" },
    { title: "Outgoing ports today", value: (stats.portOutToday || 0).toLocaleString(), icon: ArrowLeftRight, color: "text-info" },
    { title: "Awaiting processing", value: (stats.pendingPorts || 0).toLocaleString(), icon: Clock, color: "text-warning" },
    { title: "Completed requests", value: (stats.successfulPorts || 0).toLocaleString(), icon: CheckCircle, color: "text-success" },
    { title: "Based on complaint data", value: (stats.failedPorts || 0).toLocaleString(), icon: XCircle, color: "text-destructive" },
  ] : [];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><p className="text-lg text-muted-foreground">Loading...</p></div>;
  }
  if (error) {
    return <div className="text-center p-8"><h2 className="text-xl font-bold text-destructive">Error</h2><p className="text-muted-foreground">{error}</p><Button onClick={fetchDashboardData}>Try Again</Button></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Operations Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
                </Card>
            );
        })}
      </div>
      
      <div className="flex justify-end">
        <Dialog open={isNewSubDialogOpen} onOpenChange={setIsNewSubDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Create Subscriber</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subscriber Record</DialogTitle>
              <DialogDescription>
                This will store a new subscriber record in the database.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewSubscriberSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="MSISDN">MSISDN</Label>
                <Input id="MSISDN" value={newSubscriberData.MSISDN} onChange={(e) => setNewSubscriberData({...newSubscriberData, MSISDN: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ZONE">Zone</Label>
                <Input id="ZONE" type="number" value={newSubscriberData.ZONE} onChange={(e) => setNewSubscriberData({...newSubscriberData, ZONE: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="LSA">LSA</Label>
                <Input id="LSA" value={newSubscriberData.LSA} onChange={(e) => setNewSubscriberData({...newSubscriberData, LSA: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="OID">Current OID</Label>
                <Input id="OID" value={newSubscriberData.OID} onChange={(e) => setNewSubscriberData({...newSubscriberData, OID: e.target.value})} />
              </div>
              <Button type="submit" className="w-full">Store Record</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={allPortRecords}
        title="All Port Records"
        onRefresh={fetchDashboardData}
      />
    </div>
  );
}