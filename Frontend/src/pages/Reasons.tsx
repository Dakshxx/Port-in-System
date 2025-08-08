import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { dashboardApi, exportApi } from '@/services/api'; // Import dashboardApi and exportApi

export default function Reasons() {
  const [reasonAnalysis, setReasonAnalysis] = useState<any[]>([]); // State for fetched reasons
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReasonAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch reason analysis from your backend
      const data = await dashboardApi.getReasonsAnalysis();
      setReasonAnalysis(data);
    } catch (err: any) {
      console.error("Failed to fetch reason analysis:", err);
      setError(err.message || "Failed to load reason analysis.");
      toast({
        title: "Error Loading Reasons",
        description: err.message || "An unexpected error occurred while fetching reasons.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      // Assuming exportReasons (or similar) returns a blob or similar for download
      const data = await exportApi.exportPortOut(); // Using exportPortOut as an example, adjust to actual export endpoint for reasons if available
      toast({
        title: "Export Initiated",
        description: "Reasons report export request sent to backend.",
      });
      console.log("Exported Reasons Data:", data);
    } catch (err: any) {
      console.error("Failed to export Reasons report:", err);
      toast({
        title: "Export Failed",
        description: err.message || "An error occurred during report export.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReasonAnalysis();
  }, []);

  // Map fetched data to chart-friendly format
  const pieData = reasonAnalysis.map((item, index) => ({
    name: item._id, // Assuming _id is the reason
    value: item.count,
    fill: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5] // Cycle through colors
  }));

  // Monthly data is still mock as your backend doesn't provide this specific API
  const monthlyData = [
    { month: 'Jan', serviceIssues: 45, betterOffer: 38, networkCoverage: 32, customerRequest: 25 },
    { month: 'Feb', serviceIssues: 52, betterOffer: 42, networkCoverage: 28, customerRequest: 30 },
    { month: 'Mar', serviceIssues: 48, betterOffer: 35, networkCoverage: 35, customerRequest: 28 },
    { month: 'Apr', serviceIssues: 55, betterOffer: 45, networkCoverage: 40, customerRequest: 32 },
    { month: 'May', serviceIssues: 60, betterOffer: 48, networkCoverage: 38, customerRequest: 35 },
    { month: 'Jun', serviceIssues: 58, betterOffer: 52, networkCoverage: 42, customerRequest: 38 },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">Loading Reasons data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-destructive">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchReasonAnalysis} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reasons Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive analysis of port out and snapback reasons
          </p>
        </div>
        
        <Button 
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white"
          onClick={handleExportReport}
        >
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Port Out Reasons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Complaint Reasons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reasonAnalysis.length > 0 ? (
              reasonAnalysis.map((reason, index) => (
                <Card key={index} className="border border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {reason.count}
                        </div>
                        <div className="font-semibold text-foreground mb-1">
                          {reason._id} {/* Display the reason from backend */}
                        </div>
                        {/* Percentage and trend are not directly from backend, keep as mock or calculate */}
                        <div className="text-sm text-muted-foreground">
                          {((reason.count / reasonAnalysis.reduce((sum, r) => sum + r.count, 0)) * 100).toFixed(1)}% of total
                        </div>
                      </div>
                      <div className="ml-4">
                        {/* Trend icon is mock data */}
                        {getTrendIcon(index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'warning')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-8">No reason data available.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Distribution Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}> {/* This chart still uses mock data */}
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="serviceIssues" stackId="a" fill="#3b82f6" name="Service Issues" />
                  <Bar dataKey="betterOffer" stackId="a" fill="#10b981" name="Better Offer" />
                  <Bar dataKey="networkCoverage" stackId="a" fill="#f59e0b" name="Network Coverage" />
                  <Bar dataKey="customerRequest" stackId="a" fill="#ef4444" name="Customer Request" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
