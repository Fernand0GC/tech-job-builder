import { Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Service } from "@/types/order";
import { Card } from "@/components/ui/card";

interface ServiceListProps {
  services: Service[];
  onRemoveService: (serviceId: string) => void;
}

export function ServiceList({ services, onRemoveService }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-card">
        <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">
          No hay servicios agregados. Presiona "Agregar Servicio" para comenzar.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {services.map((service, index) => (
        <Card key={service.id} className="p-4 bg-gradient-card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-semibold">
                  #{index + 1}
                </span>
                <h4 className="font-semibold">{service.serviceType}</h4>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{service.category}</span>
              </div>

              {service.customCameraCount && (
                <p className="text-sm text-muted-foreground mb-2">
                  {service.customCameraCount} cámaras (Personalizado)
                </p>
              )}

              <div className="mt-3 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  MATERIALES:
                </p>
                {service.materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex justify-between text-sm pl-2"
                  >
                    <span className="text-muted-foreground">
                      {material.name} x{material.quantity}
                    </span>
                    <span className="font-medium">
                      €{(material.price * material.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                <span className="text-sm font-semibold">Total del Servicio</span>
                <span className="text-lg font-bold text-primary">
                  €{service.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveService(service.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
