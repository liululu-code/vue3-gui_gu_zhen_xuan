import { GeneralResponseData } from '@/api/generalType'


interface Record {
    id: number | null,
    // createTime: string,
    spuName: string,
    description: string,
    category3Id: number | null,
    tmId: number | null,
    spuSaleAttrList: SpuSaleAttribution[] | null,
    spuImageList: SpuImageData[] | null,
    spuPosterList: TrademarkData[] | null,
    baseAttributionList: SpuBaseAttribution[],
    saleAttrId: number | null,
}
export type SpuData = Record

interface TrademarkData {
    id: number | null,
    logoUrl: string,
    tmName: string
}

export interface TrademarkListResponseData extends GeneralResponseData {
    data: TrademarkData[]
}

export interface SpuResponseData extends GeneralResponseData {
    data: {
        records: Record[],
        total: number,
    }
}

export interface SpuImageData {
    id?: number | null,
    spuId: number | null,
    imgName: string,
    imgUrl: string,
}

export interface SpuImageListResponseData extends GeneralResponseData {
    data: SpuImageData[]


}

interface spuSaleAttrValue {
    id?: number | null,
    baseSaleAttrId: number | null,
    isChecked?: boolean,
    saleAttrName: string,
    spuId: number | null,
    saleAttrValueName: string,

}

export interface SpuSaleAttribution {
    baseSaleAttrId: number | null,
    id?: number | null,
    spuId: number | null,
    saleAttrName: string,
    spuSaleAttrValueList: spuSaleAttrValue[],
    showInput?: boolean,
    selectId?: number,
}


export interface SpuSaleAttributionListResponseData extends GeneralResponseData {
    data: SpuSaleAttribution[]
}

interface SpuBaseAttribution {
    id: number | null,
    name: string,
}

export interface SpuBaseAttributionListResponseData extends GeneralResponseData {
    data: SpuBaseAttribution[]
}



interface SkuAttrValue {
    attrId: number; // attrId 应为 string 类型，而不是特定的字符串
    valueId: number; // valueId 也是 string 类型
    valueName?: string;
}

interface skuSaleAttrValue {
    saleAttrId: number; // attrId 应为 string 类型，而不是特定的字符串
    saleAttrValueId: number; // valueId 也是 string 类型
    saleAttrValueName?: string;
}

export interface SkuInfoData {
    id?: number,
    skuName: string; // skuName 应为 string 类型
    price: string; // price 应为 string 类型，若需要可以考虑改为 number
    weight: string; // weight 应为 string 类型，若需要可以考虑改为 number
    skuDesc: string; // skuDesc 应为 string 类型
    category3Id: number; // category3Id 为数字
    spuId: number; // spuId 为数字
    tmId: number; // tmId 为数字
    skuAttrValueList: SkuAttrValue[]; // skuAttrValueList 应为 SkuAttrValue 对象的数组
    skuSaleAttrValueList: skuSaleAttrValue[]; // skuSaleAttrValueList 应为 SkuAttrValue 对象的数组
    skuDefaultImg: string; // skuDefaultImg 应为 string 类型
    isSale: number;
    skuImageList?: SpuImageData[];
}

export interface SkuInfoListResponseData extends GeneralResponseData{
    data: SkuInfoData[]
}