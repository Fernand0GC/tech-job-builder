import { Customer, CameraKit, Material, Technician } from "@/types/order";

export const mockCustomers: Customer[] = [
  { id: "1", name: "Juan Pérez", phone: "+34 612 345 678", email: "juan@email.com" },
  { id: "2", name: "María García", phone: "+34 623 456 789", email: "maria@email.com" },
  { id: "3", name: "Carlos López", phone: "+34 634 567 890", email: "carlos@email.com" },
  { id: "4", name: "Ana Martínez", phone: "+34 645 678 901", email: "ana@email.com" },
  { id: "5", name: "Luis Rodríguez", phone: "+34 656 789 012", email: "luis@email.com" },
];

export const mockTechnicians: Technician[] = [
  { id: "t1", name: "Roberto Sánchez", specialty: "Cámaras de Seguridad", phone: "+34 611 222 333" },
  { id: "t2", name: "Carmen Ruiz", specialty: "Redes y Conectividad", phone: "+34 622 333 444" },
  { id: "t3", name: "Miguel Torres", specialty: "Servidores", phone: "+34 633 444 555" },
  { id: "t4", name: "Laura Fernández", specialty: "Software", phone: "+34 644 555 666" },
  { id: "t5", name: "David Jiménez", specialty: "Cámaras de Seguridad", phone: "+34 655 666 777" },
];

export const cameraKits: CameraKit[] = [
  {
    id: "kit-4",
    name: "Kit 4 Cámaras",
    cameraCount: 4,
    materials: [
      { id: "m1", name: "Cámara IP 1080p", quantity: 4, price: 89.99 },
      { id: "m2", name: "DVR 4 canales", quantity: 1, price: 149.99 },
      { id: "m3", name: "Cable coaxial 100m", quantity: 1, price: 45.00 },
      { id: "m4", name: "Fuente alimentación", quantity: 1, price: 29.99 },
      { id: "m5", name: "Conectores BNC", quantity: 8, price: 2.50 },
    ],
    totalPrice: 624.92,
  },
  {
    id: "kit-8",
    name: "Kit 8 Cámaras",
    cameraCount: 8,
    materials: [
      { id: "m1", name: "Cámara IP 1080p", quantity: 8, price: 89.99 },
      { id: "m6", name: "DVR 8 canales", quantity: 1, price: 249.99 },
      { id: "m7", name: "Cable coaxial 200m", quantity: 1, price: 85.00 },
      { id: "m4", name: "Fuente alimentación", quantity: 2, price: 29.99 },
      { id: "m5", name: "Conectores BNC", quantity: 16, price: 2.50 },
    ],
    totalPrice: 1324.88,
  },
  {
    id: "kit-10",
    name: "Kit 10 Cámaras",
    cameraCount: 10,
    materials: [
      { id: "m1", name: "Cámara IP 1080p", quantity: 10, price: 89.99 },
      { id: "m8", name: "DVR 16 canales", quantity: 1, price: 349.99 },
      { id: "m9", name: "Cable coaxial 250m", quantity: 1, price: 105.00 },
      { id: "m4", name: "Fuente alimentación", quantity: 3, price: 29.99 },
      { id: "m5", name: "Conectores BNC", quantity: 20, price: 2.50 },
    ],
    totalPrice: 1704.87,
  },
];

export const maintenanceMaterials: Material[] = [
  { id: "mm1", name: "Limpieza de lentes", quantity: 1, price: 15.00 },
  { id: "mm2", name: "Ajuste de ángulos", quantity: 1, price: 25.00 },
  { id: "mm3", name: "Revisión de cables", quantity: 1, price: 35.00 },
  { id: "mm4", name: "Actualización firmware", quantity: 1, price: 45.00 },
  { id: "mm5", name: "Reemplazo de conectores", quantity: 1, price: 20.00 },
  { id: "mm6", name: "Prueba de grabación", quantity: 1, price: 30.00 },
];

export const serviceTypes = [
  { id: "cameras", name: "Cámaras de Seguridad" },
  { id: "network", name: "Redes y Conectividad" },
  { id: "servers", name: "Servidores" },
  { id: "software", name: "Software" },
];

export const serviceCategories = {
  cameras: [
    { id: "installation", name: "Instalación" },
    { id: "maintenance", name: "Mantenimiento" },
    { id: "repair", name: "Reparación" },
  ],
  network: [
    { id: "installation", name: "Instalación" },
    { id: "configuration", name: "Configuración" },
    { id: "maintenance", name: "Mantenimiento" },
  ],
  servers: [
    { id: "installation", name: "Instalación" },
    { id: "maintenance", name: "Mantenimiento" },
    { id: "upgrade", name: "Actualización" },
  ],
  software: [
    { id: "installation", name: "Instalación" },
    { id: "update", name: "Actualización" },
    { id: "support", name: "Soporte Técnico" },
  ],
};
