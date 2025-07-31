import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { api, Project } from '../api/api';

interface CreateProjectModalProps {
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const CreateProjectModal = ({ onClose, onProjectCreated }: CreateProjectModalProps) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const generateKey = (projectName: string) => {
    return projectName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 4);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (value && !key) {
      setKey(generateKey(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !key.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please enter both project name and key.",
        variant: "destructive",
      });
      return;
    }

    if (key.length < 2 || key.length > 4) {
      toast({
        title: "Invalid project key",
        description: "Project key must be between 2-4 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const newProject = await api.createProject({
        name: name.trim(),
        key: key.trim().toUpperCase(),
        description: description.trim(),
      });

      onProjectCreated(newProject);
    } catch (error) {
      toast({
        title: "Error creating project",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter project name..."
              required
            />
          </div>

          {/* Project Key */}
          <div className="space-y-2">
            <Label htmlFor="key">Project Key *</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="e.g., PROJ"
              required
              maxLength={4}
              className="uppercase"
            />
            <p className="text-xs text-muted-foreground">
              2-4 characters used as prefix for ticket IDs (e.g., PROJ-1)
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gradient-primary text-white">
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;