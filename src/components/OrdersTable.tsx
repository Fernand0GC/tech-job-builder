import { WorkOrder, Technician } from "@/types/order";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, User, Package, Euro, UserCog } from "lucide-react";

interface OrdersTableProps {
  orders: WorkOrder[];
  technicians: Technician[];
  onAssignTechnician: (orderId: string, technicianId: string) => void;
}

const statusConfig = {
  draft: { label: "Borrador", variant: "secondary" as const },
  confirmed: { label: "Confirmada", variant: "default" as const },
  "in-progress": { label: "En Progreso", variant: "default" as const },
  completed: { label: "Completada", variant: "outline" as const },
};

export const OrdersTable = ({ orders, technicians, onAssignTechnician }: OrdersTableProps) => {
  if (orders.length === 0) {
    return (
      <Card className="p-8 text-center bg-card">
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No hay órdenes de trabajo pendientes</p>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha Servicio</TableHead>
              <TableHead>Servicios</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Técnico Asignado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{order.customer?.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {order.serviceDate
                      ? format(order.serviceDate, "dd/MM/yyyy", { locale: es })
                      : "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{order.services.length} servicio(s)</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-semibold text-primary">
                    <Euro className="h-4 w-4" />
                    {order.totalAmount.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig[order.status].variant}>
                    {statusConfig[order.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={order.assignedTechnician?.id || ""}
                    onValueChange={(value) => onAssignTechnician(order.id, value)}
                  >
                    <SelectTrigger className="w-[200px] h-9">
                      <SelectValue placeholder="Asignar técnico">
                        {order.assignedTechnician ? (
                          <div className="flex items-center gap-2">
                            <UserCog className="h-4 w-4" />
                            <span className="truncate">{order.assignedTechnician.name}</span>
                          </div>
                        ) : (
                          "Asignar técnico"
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{tech.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {tech.specialty}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
