import type { SpuData } from "@/api/good/spu/type";

export interface SpuEditComponent {
    getFormData: (spuData: SpuData) => void,
    addSpuInit: () => void,
}