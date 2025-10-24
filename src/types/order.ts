export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
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
  status: "draft" | "confirmed" | "in-progress" | "completed";
  createdAt: Date;
}
