import { useState, useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRight, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
// import { mockPortRecords } from '@/lib/mockData'; // Remove mock data import
import { toast } from '@/hooks/use-toast';
import { portApi } from '@/services/api'; // Import portApi
import { PortRecord } from '@/types/telecom'; // Import types

export default function PortOut() {
  const [portOutRecords, setPortOutRecords] = useState<PortRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortOutRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Port-Out records from your backend
      const data: PortRecord[] = await portApi.getPortOut();
      // Filter for Port Out records (where DISCONNECT_ON is set or status indicates port out)
      // Note: Your backend /port-out returns all PortOut records.
      // The filtering logic below is based on the mock data structure.
      // You might need to adjust this if your actual PortOut model doesn't have DISCONNECT_ON/BC_STATUS.
      const filteredData = data.filter(record => 
        record.DISCONNECT_ON || record.BC_STATUS === 'Failed'
      );
      setPortOutRecords(filteredData);
    } catch (err: any) {
      console.error("Failed to fetch Port Out records:", err);
      setError(err.message || "Failed to load Port Out records.");
      toast({
        title: "Error Loading Port Out Data",
        description: err.message || "An unexpected error occurred while fetching Port Out records.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortOutRecords();
  }, []);

  const stats = [
    {
      title: "Total Port Out",
      value: portOutRecords.length,
      description: "Active port out requests",
      icon: ArrowLeftRight,
      color: "text-info"
    },
    {
      title: "Processing",
      value: portOutRecords.filter(r => !r.DISCONNECT_ON).length,
      description: "Currently processing",
      icon: Clock,
      color: "text-warning"
    },
    {
      title: "Completed",
      value: portOutRecords.filter(r => r.DISCONNECT_ON).length,
      description: "Successfully ported out",
      icon: CheckCircle,
      color: "text-success"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">Loading Port Out data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-destructive">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchPortOutRecords} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Port Out Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage outgoing number portability requests and donor operations
        </p>
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

      {/* Port Out Process Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Port Out Process (Donor Operations)</CardTitle>
          <CardDescription>Standard MNP port out workflow as donor operator</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex flex-col items-center text-center p-4 bg-info/5 rounded-lg">
              <div className="w-10 h-10 bg-info text-info-foreground rounded-full flex items-center justify-center mb-3 font-bold">
                1
              </div>
              <h4 className="font-semibold mb-1">Request Received</h4>
              <p className="text-sm text-muted-foreground">Port request from recipient</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-warning/5 rounded-lg">
              <div className="w-10 h-10 bg-warning text-warning-foreground rounded-full flex items-center justify-center mb-3 font-bold">
                2
              </div>
              <h4 className="font-semibold mb-1">Customer Validation</h4>
              <p className="text-sm text-muted-foreground">Verify customer eligibility</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-primary/5 rounded-lg">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-3 font-bold">
                3
              </div>
              <h4 className="font-semibold mb-1">Approval/Rejection</h4>
              <p className="text-sm text-muted-foreground">Accept or reject request</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-accent/20 rounded-lg">
              <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center mb-3 font-bold">
                4
              </div>
              <h4 className="font-semibold mb-1">Route Release</h4>
              <p className="text-sm text-muted-foreground">Release routing information</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-destructive/5 rounded-lg">
              <div className="w-10 h-10 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center mb-3 font-bold">
                5
              </div>
              <h4 className="font-semibold mb-1">Disconnection</h4>
              <p className="text-sm text-muted-foreground">Complete service disconnect</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donor LSA Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Port Out by Donor LSA</CardTitle>
          <CardDescription>Analysis of outgoing ports by service area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Mumbai', 'Delhi', 'Bangalore', 'Chennai'].map((lsa, index) => {
              // This mock data filtering logic remains as your backend doesn't provide this breakdown
              const count = portOutRecords.filter(r => r.DONOR_LSA === lsa).length;
              const percentage = portOutRecords.length > 0 ? (count / portOutRecords.length) * 100 : 0;
              return (
                <div key={lsa} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-primary' : 
                      index === 1 ? 'bg-info' : 
                      index === 2 ? 'bg-warning' : 'bg-success'
                    }`} />
                    <span className="font-medium">{lsa}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{count} ports</span>
                    <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Port Out Reasons</CardTitle>
          <CardDescription>Common reasons for customer departures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* This is still mock data as your backend doesn't provide this API directly */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <div className="font-medium">Better Service Quality</div>
                <div className="text-sm text-muted-foreground">Network and coverage related</div>
              </div>
              <StatusBadge status="High" />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <div className="font-medium">Pricing Issues</div>
                <div className="text-sm text-muted-foreground">Tariff and cost related</div>
              </div>
              <StatusBadge status="Medium" />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <div className="font-medium">Customer Service</div>
                <div className="text-sm text-muted-foreground">Support experience</div>
              </div>
              <StatusBadge status="Low" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Port Out Records Table */}
      <DataTable 
        data={portOutRecords} 
        title="Port Out Records"
        onRefresh={fetchPortOutRecords}
      />
    </div>
  );
}
