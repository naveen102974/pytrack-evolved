import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '../api/api';
import TicketCard from './TicketCard';

interface TicketListProps {
  title: string;
  status: Ticket['status'];
  tickets: Ticket[];
  onCreateTicket: (status: Ticket['status']) => void;
  onEditTicket: (ticket: Ticket) => void;
}

const TicketList = ({ title, status, tickets, onCreateTicket, onEditTicket }: TicketListProps) => {
  const statusColors = {
    TODO: 'bg-gray-100 text-gray-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    IN_REVIEW: 'bg-purple-100 text-purple-700',
    DONE: 'bg-green-100 text-green-700',
  };

  return (
    <div className="flex flex-col h-full min-w-[320px]">
      <Card className="flex-1 shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardTitle className="text-sm font-medium text-foreground">
                {title}
              </CardTitle>
              <Badge className={`text-xs ${statusColors[status]}`}>
                {tickets.length}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3">
          {/* Tickets */}
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => onEditTicket(ticket)}
              />
            ))}
          </div>

          {/* Create Button */}
          <Button
            variant="ghost"
            className="w-full h-10 border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
            onClick={() => onCreateTicket(status)}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="text-sm">Create ticket</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketList;