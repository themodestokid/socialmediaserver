
export default function removeItem<T>(arr: Array<T>, value: T) {
    const index = arr.indexOf(value);
    if (index >= 0) {
        arr.splice(index, 1);
    }
}

export function removeItemById(arr: Array<any>, itemId: any, idName: string = "_id"): boolean {
    const index = arr.findIndex(item => item[idName] == itemId);
    if (index > -1) {
        arr.splice(index, 1);
        return true;
    }   
    return false;

}
