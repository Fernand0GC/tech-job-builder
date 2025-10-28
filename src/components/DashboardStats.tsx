import { WorkOrder, Technician } from "@/types/order";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Calendar, Users } from "lucide-react";
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";

interface DashboardStatsProps {
  orders: WorkOrder[];
  technicians: Technician[];
}

export const DashboardStats = ({ orders, technicians }: DashboardStatsProps) => {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const completedThisWeek = orders.filter(
    (order) =>
      order.status === "completed" &&
      order.serviceDate &&
      order.serviceDate >= weekStart &&
      order.serviceDate <= weekEnd
  ).length;

  const completedToday = orders.filter(
    (order) =>
      order.status === "completed" &&
      order.serviceDate &&
      order.serviceDate >= todayStart &&
      order.serviceDate <= todayEnd
  ).length;

  const todoThisWeek = orders.filter(
    (order) =>
      (order.status === "pending" || order.status === "in-progress") &&
      order.serviceDate &&
      order.serviceDate >= weekStart &&
      order.serviceDate <= weekEnd
  ).length;

  const availableTechnicians = technicians.filter((tech) => tech.isAvailable).length;

  const stats = [
    {
      title: "Trabajos Semanales",
      value: completedThisWeek,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Trabajos Hoy",
      value: completedToday,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Por Hacer (Semana)",
      value: todoThisWeek,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Técnicos Disponibles",
      value: availableTechnicians,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6 bg-card shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
