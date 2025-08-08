import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Download, RefreshCw } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PortRecord } from '@/types/telecom';

interface DataTableProps {
  data: PortRecord[];
  title: string;
  onRefresh?: () => void;
}

export function DataTable({ data, title, onRefresh }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter((record) => {
    const matchesSearch = String(record.MSISDN).includes(searchTerm) ||
                         (record.LSA && String(record.LSA).toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (record.OID && String(record.OID).toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesZone = zoneFilter === 'all' || (record.ZONE && String(record.ZONE).toLowerCase() === zoneFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (record.BC_STATUS && String(record.BC_STATUS).toLowerCase() === statusFilter.toLowerCase());
    
    return matchesSearch && matchesZone && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const uniqueZones = [...new Set(data.map(record => record.ZONE))];
  const uniqueStatuses = [...new Set(data.map(record => record.BC_STATUS))];

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (currentPage > 3) {
        pageNumbers.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        startPage = 2;
        endPage = 4;
      }
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      if (currentPage < totalPages - 2) {
        pageNumbers.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }
      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pageNumbers;
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-card-header">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by MSISDN, LSA, or OID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={zoneFilter} onValueChange={setZoneFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {uniqueZones.map(zone => (
                <SelectItem key={zone} value={String(zone).toLowerCase()}>{zone}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={String(status).toLowerCase()}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">MSISDN</TableHead>
                <TableHead className="font-semibold">Zone/LSA</TableHead>
                <TableHead className="font-semibold">Current OID</TableHead>
                <TableHead className="font-semibold">Previous OID</TableHead>
                <TableHead className="font-semibold">Port Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Update Flag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((record, index) => (
                  <TableRow key={`${record.MSISDN}-${index}`} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-medium">{record.MSISDN}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{record.ZONE}</span>
                        <span className="text-sm text-muted-foreground">{record.LSA}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{record.OID}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">{record.LAST_OID}</TableCell>
                    <TableCell className="text-sm">{formatDate(record.PORT_ON)}</TableCell>
                    <TableCell>
                      <StatusBadge status={record.BC_STATUS} type="bc" />
                    </TableCell>
                    <TableCell>
                      <Badge variant={record.UPDATE_FLAG === 'Y' ? 'default' : 'secondary'}>
                        {record.UPDATE_FLAG}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {renderPageNumbers()}
                
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}