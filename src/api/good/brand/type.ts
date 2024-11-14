
export interface RecordData {
    id: number,
    tmName: string,
    logoUrl: string
}



export interface BrandInfoResponseData {
    code: number,
    message: string,
    ok: boolean,
    data: {
        records: RecordData[],
        total: number,
        size: number,
        curent: number,
        searchCount: true,
        pages: number
    }
}