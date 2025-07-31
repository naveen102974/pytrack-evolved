import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Ticket } from '../api/api';
import { Clock, AlertTriangle, CheckCircle, Eye } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

const TicketCard = ({ ticket, onClick }: TicketCardProps) => {
  const priorityConfig = {
    LOW: { color: 'bg-gray-100 text-gray-800', icon: null },
    MEDIUM: { color: 'bg-blue-100 text-blue-800', icon: null },
    HIGH: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
    URGENT: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  };

  const statusConfig = {
    TODO: { color: 'bg-gray-100 text-gray-700', icon: Clock },
    IN_PROGRESS: { color: 'bg-blue-100 text-blue-700', icon: Clock },
    IN_REVIEW: { color: 'bg-purple-100 text-purple-700', icon: Eye },
    DONE: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  };

  const priority = priorityConfig[ticket.priority];
  const status = statusConfig[ticket.status];
  const PriorityIcon = priority.icon;
  const StatusIcon = status.icon;

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/20 group hover:border-l-primary"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className="text-xs font-mono bg-muted text-muted-foreground"
            >
              {ticket.id}
            </Badge>
            <Badge className={`text-xs ${priority.color}`}>
              {PriorityIcon && <PriorityIcon className="w-3 h-3 mr-1" />}
              {ticket.priority}
            </Badge>
          </div>
        </div>
        
        <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
          {ticket.title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Tags */}
          {ticket.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {ticket.tags.slice(0, 2).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {ticket.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
                  +{ticket.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StatusIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground capitalize">
                {ticket.status.replace('_', ' ').toLowerCase()}
              </span>
            </div>

            {ticket.assignee && (
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                  {ticket.assignee.avatar || ticket.assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;