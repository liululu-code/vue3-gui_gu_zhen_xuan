import request from '@/utils/request'

import type {
    BrandInfoResponseData,
    RecordData
} from './type'

enum API {
    BRAND_URL = '/admin/product/baseTrademark',
    ADD_BRAND_URL = '/admin/product/baseTrademark/save',
    UPDATE_BRAND_URL = '/admin/product/baseTrademark/update',
    DELETE_BRAND_RUL = '/admin/product/baseTrademark/remove',
}

export function reqBrandInfo(currentPage: number, pageSize: number) {
    return request.get<any, BrandInfoResponseData>(API.BRAND_URL + `/${currentPage}/${pageSize}`)
}

export function reqAddBrand(brandData: RecordData) {
    return request.post<any, any>(API.ADD_BRAND_URL, brandData)
}

export function reqUpdateBrand(brandData: RecordData) {
    return request.put<any, any>(API.UPDATE_BRAND_URL, brandData)
}

export function reqDeleteBrand(id: number) {
    return request.delete<any, any>(API.DELETE_BRAND_RUL + `/${id}`)
}