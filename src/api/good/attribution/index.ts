import request from '@/utils/request'

import type {
    CategoryResponseData,
    AttributionInfoListResponseData
} from './type'

enum API {
    CATEGORY_URL = '/admin/product/getCategory1',
    CATEGORY1_URL = '/admin/product/getCategory1',
    CATEGORY2_URL = '/admin/product/getCategory2',
    CATEGORY3_URL = '/admin/product/getCategory3',
    ATTRIBUTION_INFO_LIST_URL = '/admin/product/attrInfoList',
    SAVE_ATTRIBUTION_INFO = '/admin/product/saveAttrInfo',
    DELETE_ATTRIBUTION = '/admin/product/deleteAttr'
}

export function reqCategory() {
    return request.get<any, CategoryResponseData>(API.CATEGORY_URL)
}

export function reqCategory1(id: number) {
    return request.get<any, CategoryResponseData>(API.CATEGORY1_URL + `/${id}`)
}

export function reqCategory2(id: number) {
    return request.get<any, CategoryResponseData>(API.CATEGORY2_URL + `/${id}`)
}

export function reqCategory3(id: number) {
    return request.get<any, CategoryResponseData>(API.CATEGORY3_URL + `/${id}`)
}

export function reqAttributionInfoList(id1: number, id2: number, id3: number) {
    return request.get<any, AttributionInfoListResponseData>(API.ATTRIBUTION_INFO_LIST_URL + `/${id1}` + `/${id2}` + `/${id3}`)
}

export function reqSaveAttributionInfo(data: any) {
    return request.post<any, any>(API.SAVE_ATTRIBUTION_INFO, data)
}

export function reqDeleteAttribution(id: number) {
    return request.delete<any, any>(API.DELETE_ATTRIBUTION + `/${id}`)
}
