import { useState } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrdersTable } from "@/components/OrdersTable";
import { DashboardStats } from "@/components/DashboardStats";
import { EditOrderModal } from "@/components/EditOrderModal";
import { CreateOrderModal } from "@/components/CreateOrderModal";
import { mockCustomers, mockTechnicians } from "@/data/mockData";
import { WorkOrder } from "@/types/order";

const Index = () => {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [editingOrder, setEditingOrder] = useState<WorkOrder | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateOrder = (newOrder: WorkOrder) => {
    setOrders([...orders, newOrder]);
  };

  const handleEditOrder = (order: WorkOrder) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  const handleUpdateOrder = (updatedOrder: WorkOrder) => {
    setOrders(orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
  };

  const pendingOrders = orders.filter((order) => order.status === "pending");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Sistema de Órdenes de Trabajo
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión de servicios técnicos
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Dashboard Stats */}
        <DashboardStats orders={orders} technicians={mockTechnicians} />

        {/* Create Order Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Crear Orden de Trabajo
          </Button>
        </div>

        {/* Orders Table */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Órdenes de Trabajo Pendientes</h2>
          </div>
          <OrdersTable orders={pendingOrders} onEditOrder={handleEditOrder} />
        </section>
      </main>

      {/* Create Order Modal */}
      <CreateOrderModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        customers={mockCustomers}
        onCreateOrder={handleCreateOrder}
      />

      {/* Edit Order Modal */}
      <EditOrderModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        order={editingOrder}
        technicians={mockTechnicians}
        onUpdateOrder={handleUpdateOrder}
      />
    </div>
  );
};

export default Index;
