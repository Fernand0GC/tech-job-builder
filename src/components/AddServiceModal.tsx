import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service, Material } from "@/types/order";
import {
  serviceTypes,
  serviceCategories,
  cameraKits,
  maintenanceMaterials,
} from "@/data/mockData";
import { toast } from "sonner";

interface AddServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddService: (service: Service) => void;
}

export function AddServiceModal({
  open,
  onOpenChange,
  onAddService,
}: AddServiceModalProps) {
  const [serviceType, setServiceType] = useState("");
  const [category, setCategory] = useState("");
  const [kitId, setKitId] = useState("");
  const [customCameraCount, setCustomCameraCount] = useState("");
  const [customMaterials, setCustomMaterials] = useState<Material[]>([]);
  const [selectedMaintenanceMaterials, setSelectedMaintenanceMaterials] = useState<
    string[]
  >([]);

  const resetForm = () => {
    setServiceType("");
    setCategory("");
    setKitId("");
    setCustomCameraCount("");
    setCustomMaterials([]);
    setSelectedMaintenanceMaterials([]);
  };

  const handleAddCustomMaterial = () => {
    setCustomMaterials([
      ...customMaterials,
      { id: Date.now().toString(), name: "", quantity: 1, price: 0 },
    ]);
  };

  const handleUpdateCustomMaterial = (
    id: string,
    field: keyof Material,
    value: string | number
  ) => {
    setCustomMaterials(
      customMaterials.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleRemoveCustomMaterial = (id: string) => {
    setCustomMaterials(customMaterials.filter((m) => m.id !== id));
  };

  const toggleMaintenanceMaterial = (materialId: string) => {
    setSelectedMaintenanceMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleAddService = () => {
    if (!serviceType || !category) {
      toast.error("Por favor selecciona tipo de servicio y categoría");
      return;
    }

    let materials: Material[] = [];
    let totalPrice = 0;

    const selectedServiceType = serviceTypes.find((st) => st.id === serviceType);
    const selectedCategory = serviceCategories[serviceType as keyof typeof serviceCategories]?.find(
      (c) => c.id === category
    );

    if (serviceType === "cameras" && category === "installation") {
      if (kitId === "custom") {
        if (!customCameraCount || customMaterials.length === 0) {
          toast.error("Por favor completa la configuración personalizada");
          return;
        }
        materials = customMaterials;
        totalPrice = materials.reduce((sum, m) => sum + m.price * m.quantity, 0);
      } else if (kitId) {
        const kit = cameraKits.find((k) => k.id === kitId);
        if (kit) {
          materials = kit.materials;
          totalPrice = kit.totalPrice;
        }
      } else {
        toast.error("Por favor selecciona un kit");
        return;
      }
    } else if (category === "maintenance") {
      materials = maintenanceMaterials.filter((m) =>
        selectedMaintenanceMaterials.includes(m.id)
      );
      totalPrice = materials.reduce((sum, m) => sum + m.price * m.quantity, 0);

      if (materials.length === 0) {
        toast.error("Por favor selecciona al menos un material de mantenimiento");
        return;
      }
    }

    const newService: Service = {
      id: Date.now().toString(),
      serviceType: selectedServiceType?.name || "",
      category: selectedCategory?.name || "",
      kitId: kitId !== "custom" ? kitId : undefined,
      customCameraCount: kitId === "custom" ? parseInt(customCameraCount) : undefined,
      materials,
      totalPrice,
    };

    onAddService(newService);
    resetForm();
    onOpenChange(false);
    toast.success("Servicio agregado correctamente");
  };

  const categories = serviceType
    ? serviceCategories[serviceType as keyof typeof serviceCategories] || []
    : [];

  const showKitSelection =
    serviceType === "cameras" && category === "installation";
  const showMaintenanceMaterials = category === "maintenance";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Agregar Servicio</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de servicio y configura los detalles
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="serviceType">Tipo de Servicio</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger id="serviceType" className="bg-background">
                <SelectValue placeholder="Selecciona tipo de servicio" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {serviceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {serviceType && (
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="bg-background">
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showKitSelection && (
            <>
              <div className="space-y-2">
                <Label htmlFor="kit">Kit de Cámaras</Label>
                <Select value={kitId} onValueChange={setKitId}>
                  <SelectTrigger id="kit" className="bg-background">
                    <SelectValue placeholder="Selecciona un kit" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {cameraKits.map((kit) => (
                      <SelectItem key={kit.id} value={kit.id}>
                        {kit.name} - €{kit.totalPrice.toFixed(2)}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {kitId && kitId !== "custom" && (
                <div className="bg-secondary p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Materiales Incluidos</h4>
                  <div className="space-y-2">
                    {cameraKits
                      .find((k) => k.id === kitId)
                      ?.materials.map((material) => (
                        <div
                          key={material.id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {material.name} x{material.quantity}
                          </span>
                          <span className="font-medium">
                            €{(material.price * material.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {kitId === "custom" && (
                <div className="space-y-4 bg-secondary p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="cameraCount">Cantidad de Cámaras</Label>
                    <Input
                      id="cameraCount"
                      type="number"
                      min="1"
                      value={customCameraCount}
                      onChange={(e) => setCustomCameraCount(e.target.value)}
                      placeholder="Ej: 6"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Materiales Iniciales</Label>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddCustomMaterial}
                        className="bg-gradient-primary"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Material
                      </Button>
                    </div>

                    {customMaterials.map((material) => (
                      <div
                        key={material.id}
                        className="flex gap-2 items-end bg-background p-3 rounded-md"
                      >
                        <div className="flex-1">
                          <Label className="text-xs">Nombre</Label>
                          <Input
                            value={material.name}
                            onChange={(e) =>
                              handleUpdateCustomMaterial(
                                material.id,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Nombre del material"
                          />
                        </div>
                        <div className="w-24">
                          <Label className="text-xs">Cantidad</Label>
                          <Input
                            type="number"
                            min="1"
                            value={material.quantity}
                            onChange={(e) =>
                              handleUpdateCustomMaterial(
                                material.id,
                                "quantity",
                                parseInt(e.target.value) || 1
                              )
                            }
                          />
                        </div>
                        <div className="w-28">
                          <Label className="text-xs">Precio (€)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={material.price}
                            onChange={(e) =>
                              handleUpdateCustomMaterial(
                                material.id,
                                "price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveCustomMaterial(material.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {customMaterials.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay materiales agregados
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {showMaintenanceMaterials && (
            <div className="space-y-2">
              <Label>Materiales de Mantenimiento</Label>
              <div className="bg-secondary p-4 rounded-lg space-y-2">
                {maintenanceMaterials.map((material) => (
                  <label
                    key={material.id}
                    className="flex items-center justify-between p-2 hover:bg-background rounded cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedMaintenanceMaterials.includes(
                          material.id
                        )}
                        onChange={() => toggleMaintenanceMaterial(material.id)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="font-medium">{material.name}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      €{material.price.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleAddService} className="bg-gradient-primary">
            Agregar Servicio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
