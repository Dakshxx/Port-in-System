import { useState, useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRightLeft, Plus, FileText, Clock, CheckCircle } from 'lucide-react';
// import { mockPortRecords } from '@/lib/mockData'; // Remove mock data import
import { toast } from '@/hooks/use-toast';
import { portApi } from '@/services/api'; // Import portApi
import { PortRecord } from '@/types/telecom'; // Import types

export default function PortIn() {
  const [isNewPortDialogOpen, setIsNewPortDialogOpen] = useState(false);
  const [newPortData, setNewPortData] = useState({
    number: '', // Changed from msisdn to number to match PortIn model [cite: uploaded:jio final /models/PortIn.js]
    operator: '', // Added to match PortIn model
    circle: '', // Added to match PortIn model
    date: new Date().toISOString().split('T')[0] // Default to today's date
  });
  const [portInRecords, setPortInRecords] = useState<PortRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortInRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Port-In records from your backend
      const data: PortRecord[] = await portApi.getPortIn();
      // Filter for Port In records (where current OID is different from LAST_OID)
      // Note: Your backend /port-in returns all PortIn records.
      // The filtering logic below is based on the mock data structure.
      // You might need to adjust this if your actual PortIn model doesn't have OID/LAST_OID/BC_STATUS.
      // Assuming for now that the fetched data needs to be filtered for 'Port In' relevant records.
      const filteredData = data.filter(record => 
        record.OID !== record.LAST_OID && record.BC_STATUS !== 'Failed'
      );
      setPortInRecords(filteredData);
    } catch (err: any) {
      console.error("Failed to fetch Port In records:", err);
      setError(err.message || "Failed to load Port In records.");
      toast({
        title: "Error Loading Port In Data",
        description: err.message || "An unexpected error occurred while fetching Port In records.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortInRecords();
  }, []);

  const handleNewPortSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Submit new Port-In request to your backend (assuming /complaints is used for simplicity,
      // but ideally you'd have a dedicated /port-in POST endpoint for new requests)
      // Note: Your backend's Complaint model expects 'reason' and 'user'.
      // This is a simplified mapping for demonstration. You might need to adjust this.
      await portApi.submitPortIn({ // Assuming you add a submitPortIn to portApi in services/api.ts
        number: newPortData.number,
        operator: newPortData.operator,
        circle: newPortData.circle,
        date: newPortData.date,
        // You might need to add other fields like 'user' if your backend requires it for PortIn creation
      });
      
      toast({
        title: "Port In Request Submitted",
        description: `MSISDN ${newPortData.number} port request has been initiated`,
      });
      
      setIsNewPortDialogOpen(false);
      setNewPortData({
        number: '',
        operator: '',
        circle: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchPortInRecords(); // Refresh data after submission
    } catch (err: any) {
      console.error("Failed to submit Port In request:", err);
      toast({
        title: "Port In Request Failed",
        description: err.message || "An error occurred while submitting the request.",
        variant: "destructive",
      });
    }
  };

  const stats = [
    {
      title: "Total Port In",
      value: portInRecords.length,
      description: "Active port in requests",
      icon: ArrowRightLeft,
      color: "text-primary"
    },
    {
      title: "Pending",
      value: portInRecords.filter(r => r.BC_STATUS === 'Pending').length,
      description: "Awaiting processing",
      icon: Clock,
      color: "text-warning"
    },
    {
      title: "Completed",
      value: portInRecords.filter(r => r.BC_STATUS === 'Active').length,
      description: "Successfully ported",
      icon: CheckCircle,
      color: "text-success"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">Loading Port In data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-destructive">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchPortInRecords} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Port In Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage incoming number portability requests
          </p>
        </div>
        
        <Dialog open={isNewPortDialogOpen} onOpenChange={setIsNewPortDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Port In Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Port In Request</DialogTitle>
              <DialogDescription>
                Enter the details for the new port in request
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewPortSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="number">MSISDN</Label> {/* Changed to number */}
                <Input
                  id="number"
                  placeholder="Enter mobile number"
                  value={newPortData.number}
                  onChange={(e) => setNewPortData(prev => ({...prev, number: e.target.value}))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operator">Operator</Label> {/* Added field */}
                <Select 
                  value={newPortData.operator}
                  onValueChange={(value) => setNewPortData(prev => ({...prev, operator: value}))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jio">Jio</SelectItem>
                    <SelectItem value="airtel">Airtel</SelectItem>
                    <SelectItem value="vodafone">Vodafone</SelectItem>
                    <SelectItem value="bsnl">BSNL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="circle">Circle</Label> {/* Added field */}
                <Select 
                  value={newPortData.circle}
                  onValueChange={(value) => setNewPortData(prev => ({...prev, circle: value}))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select circle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label> {/* Added field */}
                <Input
                  id="date"
                  type="date"
                  value={newPortData.date}
                  onChange={(e) => setNewPortData(prev => ({...prev, date: e.target.value}))}
                  required
                />
              </div>
              
              {/* Removed zone and reason as they are not directly in PortIn model */}
              {/* If you need these, you'd extend your PortIn model in the backend */}
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Create Request</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsNewPortDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Port In Process Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Port In Process</CardTitle>
          <CardDescription>Standard MNP port in workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center p-4 bg-primary/5 rounded-lg">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-3 font-bold">
                1
              </div>
              <h4 className="font-semibold mb-1">Request Received</h4>
              <p className="text-sm text-muted-foreground">Customer port request validation</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-info/5 rounded-lg">
              <div className="w-10 h-10 bg-info text-info-foreground rounded-full flex items-center justify-center mb-3 font-bold">
                2
              </div>
              <h4 className="font-semibold mb-1">Donor Verification</h4>
              <p className="text-sm text-muted-foreground">Verify with donor operator</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-warning/5 rounded-lg">
              <div className="w-10 h-10 bg-warning text-warning-foreground rounded-full flex items-center justify-center mb-3 font-bold">
                3
              </div>
              <h4 className="font-semibold mb-1">Route Provisioning</h4>
              <p className="text-sm text-muted-foreground">Configure routing tables</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-success/5 rounded-lg">
              <div className="w-10 h-10 bg-success text-success-foreground rounded-full flex items-center justify-center mb-3 font-bold">
                4
              </div>
              <h4 className="font-semibold mb-1">Activation</h4>
              <p className="text-sm text-muted-foreground">Port activation complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Port In Records Table */}
      <DataTable 
        data={portInRecords} 
        title="Port In Records"
        onRefresh={fetchPortInRecords}
      />
    </div>
  );
}
