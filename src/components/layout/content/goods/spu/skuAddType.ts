import type { SpuData } from "@/api/good/spu/type";
import type {IdObjData} from '@/api/generalType'
export interface SkuAddComponent {
    getFormData: (spuData: SpuData, idObj: IdObjData) => void,
}