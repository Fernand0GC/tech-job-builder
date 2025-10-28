import { useState, useEffect } from "react";
import { WorkOrder, Technician, Material, TechnicianHistoryEntry } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Plus, History, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

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
  const [extraMaterials, setExtraMaterials] = useState<Material[]>([]);
  const [manualTotal, setManualTotal] = useState<string>("");
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialQuantity, setNewMaterialQuantity] = useState("");
  const [newMaterialPrice, setNewMaterialPrice] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setInitialObservations(order.initialObservations || "");
      setTechnicianObservations(order.technicianObservations || "");
      setSelectedTechnicians(order.assignedTechnicians);
      setExtraMaterials(order.extraMaterials || []);
      setManualTotal(order.manualTotalAmount?.toString() || "");
    }
  }, [order]);

  const handleAddTechnician = (techId: string) => {
    const tech = technicians.find((t) => t.id === techId);
    if (tech && !selectedTechnicians.find((t) => t.id === techId)) {
      setSelectedTechnicians([...selectedTechnicians, tech]);
    }
  };

  const handleRemoveTechnician = (techId: string, reason?: string) => {
    if (!order) return;
    
    const tech = selectedTechnicians.find((t) => t.id === techId);
    if (!tech) return;

    // Add to history
    const historyEntry: TechnicianHistoryEntry = {
      id: `hist-${Date.now()}`,
      technician: tech,
      assignedAt: order.createdAt,
      removedAt: new Date(),
      removedReason: reason || "Reasignado",
    };

    const updatedHistory = [...(order.technicianHistory || []), historyEntry];
    
    setSelectedTechnicians(selectedTechnicians.filter((t) => t.id !== techId));
    
    if (order) {
      order.technicianHistory = updatedHistory;
    }
  };

  const handleAddExtraMaterial = () => {
    if (!newMaterialName || !newMaterialQuantity || !newMaterialPrice) {
      toast.error("Completa todos los campos del material");
      return;
    }

    const material: Material = {
      id: `mat-${Date.now()}`,
      name: newMaterialName,
      quantity: parseInt(newMaterialQuantity),
      price: parseFloat(newMaterialPrice),
    };

    setExtraMaterials([...extraMaterials, material]);
    setNewMaterialName("");
    setNewMaterialQuantity("");
    setNewMaterialPrice("");
    toast.success("Material extra agregado");
  };

  const handleRemoveExtraMaterial = (materialId: string) => {
    setExtraMaterials(extraMaterials.filter((m) => m.id !== materialId));
    toast.success("Material eliminado");
  };

  const handleSave = () => {
    if (!order) return;

    const baseTotal = order.services.reduce((sum, s) => sum + s.totalPrice, 0);
    const extraTotal = extraMaterials.reduce((sum, m) => sum + m.price * m.quantity, 0);
    const calculatedTotal = baseTotal + extraTotal;

    const updatedOrder: WorkOrder = {
      ...order,
      status,
      initialObservations,
      technicianObservations,
      assignedTechnicians: selectedTechnicians,
      extraMaterials,
      totalAmount: calculatedTotal,
      manualTotalAmount: manualTotal ? parseFloat(manualTotal) : undefined,
    };

    onUpdateOrder(updatedOrder);
    onOpenChange(false);
    toast.success("Orden actualizada exitosamente");
  };

  const availableTechnicians = technicians.filter(
    (tech) => !selectedTechnicians.find((st) => st.id === tech.id)
  );

  const calculatedTotal = order 
    ? order.services.reduce((sum, s) => sum + s.totalPrice, 0) + 
      extraMaterials.reduce((sum, m) => sum + m.price * m.quantity, 0)
    : 0;

  const displayTotal = manualTotal ? parseFloat(manualTotal) : calculatedTotal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Orden de Trabajo #{order?.id}</DialogTitle>
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

          <Separator />

          {/* Extra Materials */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Materiales Extras
            </Label>
            
            {extraMaterials.length > 0 && (
              <div className="space-y-2">
                {extraMaterials.map((material) => (
                  <Card key={material.id} className="p-3 bg-background">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{material.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {material.quantity} | €{material.price.toFixed(2)} c/u | 
                          Total: €{(material.price * material.quantity).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveExtraMaterial(material.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <Card className="p-4 bg-accent/5">
              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="Nombre"
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  className="bg-background"
                />
                <Input
                  type="number"
                  placeholder="Cantidad"
                  value={newMaterialQuantity}
                  onChange={(e) => setNewMaterialQuantity(e.target.value)}
                  className="bg-background"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Precio €"
                  value={newMaterialPrice}
                  onChange={(e) => setNewMaterialPrice(e.target.value)}
                  className="bg-background"
                />
              </div>
              <Button
                onClick={handleAddExtraMaterial}
                className="w-full mt-3 bg-gradient-primary"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Material
              </Button>
            </Card>
          </div>

          <Separator />

          {/* Price Override */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Precio Total
            </Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Calculado: €{calculatedTotal.toFixed(2)}
                </p>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Modificar precio total (opcional)"
                  value={manualTotal}
                  onChange={(e) => setManualTotal(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="flex items-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Final</p>
                  <p className="text-2xl font-bold text-primary">
                    €{displayTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technician History */}
          {order && order.technicianHistory && order.technicianHistory.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Historial de Técnicos
                </Label>
                <Card className="p-4 bg-background space-y-3">
                  {order.technicianHistory.map((entry) => (
                    <div key={entry.id} className="text-sm border-l-2 border-muted pl-3">
                      <p className="font-medium">{entry.technician.name}</p>
                      <p className="text-muted-foreground text-xs">
                        Asignado: {format(entry.assignedAt, "PPP", { locale: es })}
                      </p>
                      {entry.removedAt && (
                        <>
                          <p className="text-muted-foreground text-xs">
                            Removido: {format(entry.removedAt, "PPP", { locale: es })}
                          </p>
                          {entry.removedReason && (
                            <p className="text-destructive text-xs">
                              Razón: {entry.removedReason}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </Card>
              </div>
            </>
          )}

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
