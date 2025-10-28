import { useState } from "react";
import { Plus, Calendar as CalendarIcon, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CustomerSearch } from "@/components/CustomerSearch";
import { AddServiceModal } from "@/components/AddServiceModal";
import { ServiceList } from "@/components/ServiceList";
import { Textarea } from "@/components/ui/textarea";
import { Customer, Service, WorkOrder } from "@/types/order";
import { toast } from "sonner";

interface CreateOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: Customer[];
  onCreateOrder: (order: WorkOrder) => void;
}

export const CreateOrderModal = ({
  open,
  onOpenChange,
  customers,
  onCreateOrder,
}: CreateOrderModalProps) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [serviceDate, setServiceDate] = useState<Date>();
  const [services, setServices] = useState<Service[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [initialObservations, setInitialObservations] = useState("");

  const handleAddService = (service: Service) => {
    setServices([...services, service]);
  };

  const handleRemoveService = (serviceId: string) => {
    setServices(services.filter((s) => s.id !== serviceId));
    toast.success("Servicio eliminado");
  };

  const totalAmount = services.reduce((sum, s) => sum + s.totalPrice, 0);

  const handleCreateOrder = () => {
    if (!customer) {
      toast.error("Por favor selecciona un cliente");
      return;
    }
    if (!serviceDate) {
      toast.error("Por favor selecciona una fecha de servicio");
      return;
    }
    if (services.length === 0) {
      toast.error("Por favor agrega al menos un servicio");
      return;
    }

    const newOrder: WorkOrder = {
      id: `ORD-${Date.now()}`,
      customer,
      serviceDate,
      services: [...services],
      extraMaterials: [],
      totalAmount,
      status: "pending",
      createdAt: new Date(),
      assignedTechnicians: [],
      technicianHistory: [],
      initialObservations,
      technicianObservations: "",
    };

    onCreateOrder(newOrder);

    toast.success("¡Orden de trabajo creada exitosamente!", {
      description: `Cliente: ${customer.name} | Fecha: ${format(serviceDate, "PPP", { locale: es })} | Total: €${totalAmount.toFixed(2)}`,
    });

    // Reset form
    setCustomer(null);
    setServiceDate(undefined);
    setServices([]);
    setInitialObservations("");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Nueva Orden de Trabajo
            </DialogTitle>
          </DialogHeader>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Order Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Cliente
                </Label>
                <CustomerSearch
                  customers={customers}
                  selectedCustomer={customer}
                  onSelectCustomer={setCustomer}
                />
              </div>

              {/* Service Date */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Fecha del Servicio
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11 bg-background hover:bg-secondary",
                        !serviceDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {serviceDate ? (
                        format(serviceDate, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={serviceDate}
                      onSelect={setServiceDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Add Service Button */}
              <Button
                onClick={() => setIsServiceModalOpen(true)}
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Agregar Servicio
              </Button>

              {/* Services List */}
              <div className="space-y-2">
                <Label>Servicios Agregados ({services.length})</Label>
                <ServiceList
                  services={services}
                  onRemoveService={handleRemoveService}
                />
              </div>

              {/* Initial Observations */}
              <div className="space-y-2">
                <Label>Observaciones Iniciales</Label>
                <Textarea
                  value={initialObservations}
                  onChange={(e) => setInitialObservations(e.target.value)}
                  placeholder="Notas o detalles especiales sobre el trabajo..."
                  className="min-h-[100px] bg-background"
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-card shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Resumen</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">
                      {customer ? customer.name : "No seleccionado"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">
                      {serviceDate
                        ? format(serviceDate, "PPP", { locale: es })
                        : "No seleccionada"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Servicios</p>
                    <p className="font-medium">{services.length} servicio(s)</p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        €{totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      onClick={handleCreateOrder}
                      className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                      size="lg"
                    >
                      Crear Orden
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Service Modal */}
      <AddServiceModal
        open={isServiceModalOpen}
        onOpenChange={setIsServiceModalOpen}
        onAddService={handleAddService}
      />
    </>
  );
};
