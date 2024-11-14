import { GeneralResponseData } from '@/api/generalType'
import type {
    SkuInfoData,
} from '@/api/good/spu/type'



export interface SkuListResponseData extends GeneralResponseData {
    data: {
        records: SkuInfoData[],
        total: number,
    }
}


export interface SkuInfoResponseData extends GeneralResponseData {
    data: SkuInfoData
}