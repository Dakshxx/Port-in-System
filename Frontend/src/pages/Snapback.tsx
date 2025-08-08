import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Download, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { snapbackApi, exportApi } from '@/services/api';
import { PortRecord } from '@/types/telecom';
import { DataTable } from '@/components/DataTable'; // This line was missing

// Define a type for the actual snapback records from the backend
interface SnapbackRecord {
  number: string;
  operator: string;
  date: string;
  _id: string;
}

export default function Snapback() {
  const [searchTerm, setSearchTerm] = useState('');
  const [snapbackRecords, setSnapbackRecords] = useState<SnapbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSnapbackRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: SnapbackRecord[] = await snapbackApi.getSnapback();
      setSnapbackRecords(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch Snapback records:", err);
      setError(err.message || "Failed to load Snapback records.");
      setSnapbackRecords([]); // Set to empty array on error
      toast({
        title: "Error Loading Snapback Data",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportApi.exportSnapback();
      toast({
        title: "Export Initiated",
        description: "Snapback data export request sent to backend.",
      });
      // Logic to handle file download would go here
      console.log("Exported Snapback Data:", data);
    } catch (err: any) {
      console.error("Failed to export Snapback data:", err);
      toast({
        title: "Export Failed",
        description: err.message || "An error occurred during data export.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSnapbackRecords();
  }, []);

  // Filter and map data for the DataTable
  const records = Array.isArray(snapbackRecords) ? snapbackRecords : [];
  const formattedAndFilteredData: PortRecord[] = records
    .filter((record) =>
      String(record.number).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(record.operator).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(record => ({
      MSISDN: record.number,
      ZONE: 'N/A',
      LSA: record.operator,
      OID: 'N/A',
      NRH: 'N/A',
      LRN: 'N/A',
      HLR: 'N/A',
      INT_RN1: 'N/A',
      INT_RN2: 'N/A',
      LAST_OID: 'N/A',
      LAST_LRN: 'N/A',
      LAST_HLR: 'N/A',
      LAST_INT_RN1: 'N/A',
      LAST_INT_RN2: 'N/A',
      CREATE_ON: record.date,
      UPDATE_ON: record.date,
      PORT_ON: record.date,
      LAST_PORT_ON: '',
      DISCONNECT_ON: '',
      UPDATE_FLAG: 'N/A',
      DONOR_LSA: 'N/A',
      NRH_LSA: 'N/A',
      BC_STATUS: 'Snapback' // Use a specific status for clarity
    }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">Loading Snapback data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-destructive">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchSnapbackRecords} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Snapback Termination</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage snapback termination requests
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Snapback Analysis
            </Button>
            <Button
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white"
                onClick={handleExportData}
            >
                <Download className="w-4 h-4" />
                Export Data
            </Button>
        </div>
      </div>

      {/* Filters Card - Note: Filters are client-side only for now */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by MSISDN or Operator"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* DataTable for Snapback Records */}
      <DataTable
        data={formattedAndFilteredData}
        title="Snapback Records"
        onRefresh={fetchSnapbackRecords}
      />
    </div>
  );
}