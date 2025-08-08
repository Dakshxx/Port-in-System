import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'port' | 'bc';
}

export function StatusBadge({ status, type = 'default' }: StatusBadgeProps) {
  const getStatusVariant = () => {
    if (type === 'bc') {
      switch (status.toLowerCase()) {
        case 'active':
          return 'bg-success text-success-foreground';
        case 'pending':
          return 'bg-warning text-warning-foreground';
        case 'failed':
        case 'inactive':
          return 'bg-destructive text-destructive-foreground';
        default:
          return 'bg-muted text-muted-foreground';
      }
    }

    if (type === 'port') {
      switch (status.toLowerCase()) {
        case 'completed':
        case 'success':
          return 'bg-success text-success-foreground';
        case 'pending':
        case 'in-progress':
          return 'bg-info text-info-foreground';
        case 'failed':
        case 'cancelled':
          return 'bg-destructive text-destructive-foreground';
        default:
          return 'bg-muted text-muted-foreground';
      }
    }

    // Default type
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'success':
        return 'bg-success text-success-foreground';
      case 'pending':
      case 'processing':
        return 'bg-warning text-warning-foreground';
      case 'failed':
      case 'error':
      case 'inactive':
        return 'bg-destructive text-destructive-foreground';
      case 'info':
      case 'in-progress':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge className={cn("text-xs font-medium", getStatusVariant())}>
      {status}
    </Badge>
  );
}