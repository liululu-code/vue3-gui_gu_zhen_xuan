import request  from "@/utils/request";

import type {
    SpuResponseData,
    TrademarkListResponseData,
    SpuImageListResponseData,
    SpuSaleAttributionListResponseData,
    SpuBaseAttributionListResponseData,
    SpuData,
    SkuInfoData,
    SkuInfoListResponseData,
} from './type'

enum API {
    SPU_URL = '/admin/product',
    TRADEMARK_LIST_URL = '/admin/product/baseTrademark/getTrademarkList',
    SPU_IMAGE_LIST_URL = '/admin/product/spuImageList',
    SPU_SALE_ATTRIBUTION_LIST_URL = '/admin/product/spuSaleAttrList',
    BASE_SALE_ATTRIBUTION_LIST_URL = '/admin/product/baseSaleAttrList',
    UPDATE_SUP_INFO_URL = '/admin/product/updateSpuInfo',
    SAVE_SPU_INFO_URL = '/admin/product/saveSpuInfo',
    SAVE_SKU_INFO_URL = '/admin/product/saveSkuInfo',
    // 属性模块中有这个请求
    // ATTRIBUTION_INFO_LIST_URL = '/admin/product/attrInfoList/8/54/480',
    FIND_SKU_BY_SPU_ID_URL = '/admin/product/findBySpuId'
}


export function reqSpu(currentPage: number, pageSize: number, category3Id:number) {
    return request.get<any, SpuResponseData>(API.SPU_URL + `/${currentPage}` + `/${pageSize}` + `?category3Id=${category3Id}`)
}

export function reqTrademarkList() {
    return request.get<any, TrademarkListResponseData>(API.TRADEMARK_LIST_URL)
}

export function reqSpuImageList(spuId: number) {
    return request.get<any, SpuImageListResponseData>(API.SPU_IMAGE_LIST_URL + `/${spuId}`)
}

export function reqSpuSaleAttributionList(spuId: number) {
    return request.get<any, SpuSaleAttributionListResponseData>(API.SPU_SALE_ATTRIBUTION_LIST_URL + `/${spuId}`)
}

export function reqSpuBaseAttributionList() {
    return request.get<any, SpuBaseAttributionListResponseData>(API.BASE_SALE_ATTRIBUTION_LIST_URL)
}
export function reqUpdateSpuInfo(spuData: SpuData) {
    return request.post<any, any>(API.UPDATE_SUP_INFO_URL, spuData)
}
export function reqSaveSpuInfo(skpInfo: SpuData) {
    return request.post<any, any>(API.SAVE_SPU_INFO_URL, skpInfo)
}

export function reqSaveSkuInfo(skpInfo: SkuInfoData) {
    return request.post<any, any>(API.SAVE_SKU_INFO_URL, skpInfo)
}

export function reqFindSkuBySpuId(spuId: number) {
    return request.get<any, SkuInfoListResponseData>(API.FIND_SKU_BY_SPU_ID_URL + `/${spuId}`)
}
