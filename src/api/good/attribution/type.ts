interface GeneralResponseData {
    code: number,
    message: string,
    ok: boolean
}

export interface CategoryData {
    id: number,
    name: string,
    category1Id?: number,
    category2Id?: number
}

export interface CategoryResponseData extends GeneralResponseData{
    data: CategoryData[]
}

interface AttrValueList {
    id: number,
    createTime: null,
    updateTime: null,
    valueName: string,
    attrId: number
}

export interface AttributionInfoData {
    id: number,
    createTime: null,
    updateTime: null,
    attrName: string,
    categoryId: number,
    categoryLevel: number,
    attrValueList: AttrValueList[],
    selectId?: number,
}

export interface AttributionInfoListResponseData extends GeneralResponseData{
    data: AttributionInfoData[]
}