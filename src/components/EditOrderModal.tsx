import { useState, useEffect } from "react";
import { WorkOrder, Technician } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface EditOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: WorkOrder | null;
  technicians: Technician[];
  onUpdateOrder: (updatedOrder: WorkOrder) => void;
}

const statusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "in-progress", label: "En Progreso" },
  { value: "paused", label: "Pausada" },
  { value: "completed", label: "Finalizado" },
];

export const EditOrderModal = ({
  open,
  onOpenChange,
  order,
  technicians,
  onUpdateOrder,
}: EditOrderModalProps) => {
  const [status, setStatus] = useState<WorkOrder["status"]>("pending");
  const [initialObservations, setInitialObservations] = useState("");
  const [technicianObservations, setTechnicianObservations] = useState("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setInitialObservations(order.initialObservations || "");
      setTechnicianObservations(order.technicianObservations || "");
      setSelectedTechnicians(order.assignedTechnicians);
    }
  }, [order]);

  const handleAddTechnician = (techId: string) => {
    const tech = technicians.find((t) => t.id === techId);
    if (tech && !selectedTechnicians.find((t) => t.id === techId)) {
      setSelectedTechnicians([...selectedTechnicians, tech]);
    }
  };

  const handleRemoveTechnician = (techId: string) => {
    setSelectedTechnicians(selectedTechnicians.filter((t) => t.id !== techId));
  };

  const handleSave = () => {
    if (!order) return;

    const updatedOrder: WorkOrder = {
      ...order,
      status,
      initialObservations,
      technicianObservations,
      assignedTechnicians: selectedTechnicians,
    };

    onUpdateOrder(updatedOrder);
    onOpenChange(false);
  };

  const availableTechnicians = technicians.filter(
    (tech) => !selectedTechnicians.find((st) => st.id === tech.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Orden de Trabajo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assigned Technicians */}
          <div className="space-y-2">
            <Label>Técnicos Asignados</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTechnicians.map((tech) => (
                <Badge key={tech.id} variant="secondary" className="flex items-center gap-1">
                  {tech.name}
                  <button
                    onClick={() => handleRemoveTechnician(tech.id)}
                    className="ml-1 hover:bg-destructive/20 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {availableTechnicians.length > 0 && (
              <Select onValueChange={handleAddTechnician}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Agregar técnico" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {availableTechnicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name} - {tech.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Initial Observations */}
          <div className="space-y-2">
            <Label>Observaciones Iniciales</Label>
            <Textarea
              value={initialObservations}
              onChange={(e) => setInitialObservations(e.target.value)}
              placeholder="Notas sobre el trabajo a realizar..."
              className="min-h-[100px] bg-background"
            />
          </div>

          {/* Technician Observations */}
          <div className="space-y-2">
            <Label>Observaciones del Técnico</Label>
            <Textarea
              value={technicianObservations}
              onChange={(e) => setTechnicianObservations(e.target.value)}
              placeholder="Notas del técnico sobre el trabajo realizado..."
              className="min-h-[100px] bg-background"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-gradient-primary">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
