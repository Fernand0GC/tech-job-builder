export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  soloCommission: number; // Percentage
  groupCommission: number; // Percentage
  isAvailable: boolean;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CameraKit {
  id: string;
  name: string;
  cameraCount: number;
  materials: Material[];
  totalPrice: number;
}

export interface Service {
  id: string;
  serviceType: string;
  category: string;
  kitId?: string;
  customCameraCount?: number;
  materials: Material[];
  totalPrice: number;
}

export interface WorkOrder {
  id: string;
  customer: Customer | null;
  serviceDate: Date | null;
  services: Service[];
  totalAmount: number;
  status: "pending" | "in-progress" | "paused" | "completed";
  createdAt: Date;
  assignedTechnicians: Technician[];
  initialObservations?: string;
  technicianObservations?: string;
}
