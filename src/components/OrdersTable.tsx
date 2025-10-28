import { WorkOrder } from "@/types/order";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Calendar, User, Package, Euro, Edit } from "lucide-react";

interface OrdersTableProps {
  orders: WorkOrder[];
  onEditOrder: (order: WorkOrder) => void;
}

const statusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const },
  "in-progress": { label: "En Progreso", variant: "default" as const },
  paused: { label: "Pausada", variant: "outline" as const },
  completed: { label: "Finalizado", variant: "default" as const },
};

export const OrdersTable = ({ orders, onEditOrder }: OrdersTableProps) => {
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
              <TableHead>Técnicos</TableHead>
              <TableHead>Acciones</TableHead>
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
                  <div className="flex flex-col gap-1">
                    {order.assignedTechnicians.length > 0 ? (
                      order.assignedTechnicians.map((tech) => (
                        <Badge key={tech.id} variant="outline" className="text-xs">
                          {tech.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Sin asignar</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditOrder(order)}
                    className="hover:bg-secondary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
