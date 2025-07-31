import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../api/api';
import { api } from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TicketList from '../components/TicketList';
import CreateTicketModal from '../components/CreateTicketModal';
import EditTicketModal from '../components/EditTicketModal';
import CreateProjectModal from '../components/CreateProjectModal';

const Dashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [createTicketStatus, setCreateTicketStatus] = useState<Ticket['status'] | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadTickets();
  }, [isAuthenticated, navigate]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const ticketsData = await api.getTickets('1'); // Load tickets for PyTracker Platform
      setTickets(ticketsData);
    } catch (error) {
      toast({
        title: "Error loading tickets",
        description: "Failed to load tickets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = (status: Ticket['status']) => {
    setCreateTicketStatus(status);
  };

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets(prev => [...prev, newTicket]);
    setCreateTicketStatus(null);
    toast({
      title: "Ticket created",
      description: `${newTicket.id} has been created successfully.`,
    });
  };

  const handleTicketUpdated = (updatedTicket: Ticket) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
    setSelectedTicket(null);
    toast({
      title: "Ticket updated",
      description: `${updatedTicket.id} has been updated successfully.`,
    });
  };

  const handleTicketDeleted = (ticketId: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    setSelectedTicket(null);
    toast({
      title: "Ticket deleted",
      description: "Ticket has been deleted successfully.",
    });
  };

  const getTicketsByStatus = (status: Ticket['status']) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const columns = [
    { title: 'To Do', status: 'TODO' as const },
    { title: 'In Progress', status: 'IN_PROGRESS' as const },
    { title: 'In Review', status: 'IN_REVIEW' as const },
    { title: 'Done', status: 'DONE' as const },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="pl-sidebar">
        <Navbar 
          onCreateTicket={() => handleCreateTicket('TODO')}
          onCreateProject={() => setShowCreateProject(true)}
        />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Project Board</h1>
            <p className="text-muted-foreground">
              Manage and track your project tickets across different stages
            </p>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <TicketList
                key={column.status}
                title={column.title}
                status={column.status}
                tickets={getTicketsByStatus(column.status)}
                onCreateTicket={handleCreateTicket}
                onEditTicket={setSelectedTicket}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Modals */}
      {createTicketStatus && (
        <CreateTicketModal
          initialStatus={createTicketStatus}
          onClose={() => setCreateTicketStatus(null)}
          onTicketCreated={handleTicketCreated}
        />
      )}

      {selectedTicket && (
        <EditTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onTicketUpdated={handleTicketUpdated}
          onTicketDeleted={handleTicketDeleted}
        />
      )}

      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onProjectCreated={() => {
            setShowCreateProject(false);
            toast({
              title: "Project created",
              description: "New project has been created successfully.",
            });
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;