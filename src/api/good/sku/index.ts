import request from "@/utils/request";

// import type {
//     SkuInfoListResponseData

// } from '@/api/good/spu/type'

import type {
    SkuListResponseData,
    SkuInfoResponseData,
} from './type'


enum API {
    SKU_LIST_URL = '/admin/product/list',
    SKU_LAUNCH = '/admin/product/onSale',
    SKU_DELIST = '/admin/product/cancelSale',
    DELETE_SKU_URL = '/admin/product/deleteSku',
    GET_SKU_INFO_URL = '/admin/product/getSkuInfo',
}


export function reqSkuList(currentPage: number, pageSize: number) {
    return request.get<any, SkuListResponseData>(API.SKU_LIST_URL + `/${currentPage}` + `/${pageSize}`)
}

export function reqSkuLaunch(skuId: number) {
    return request.get<any, any>(API.SKU_LAUNCH + `/${skuId}`)
}

export function reqSkuDelist(skuId: number) {
    return request.get<any, any>(API.SKU_DELIST + `/${skuId}`)
}

export function reqDeleteSku(skuId: number) {
    return request.delete<any, any>(API.DELETE_SKU_URL + `/${skuId}`)
}

export function reqGetSkuInfo(skuId: number) {
    return request.get<any, SkuInfoResponseData>(API.GET_SKU_INFO_URL + `/${skuId}`)
}

