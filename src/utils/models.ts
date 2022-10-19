export interface ImageFile {
    exif: string | null;
    localIdentifier: string;
    filename: string;
    width: number;
    modificationDate: string;
    mime: string;
    path: string;
    size: number;
    cropRect: string | null;
    data: string | null;
    sourceURL: string;
    height: number;
    duration: number | null;
    creationDate: string
}

export interface ChartListItem {
    x: string,
    y: number,
    dataColor: string,
}

export interface EnumListItems extends Array<ChartListItem> { }