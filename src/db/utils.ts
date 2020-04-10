export interface IParams {
    [key: string]: string | number,
}

type SqlAndValues = [string,  (string | number | undefined)[]];

export function getWhereString(params: IParams): SqlAndValues {
    let where = ' WHERE';
    const values: (string | number | undefined)[] = [];
    Object.keys(params).forEach((param, i) => {
        where += ` ${param} = $${i + 1} AND`;
        values.push(params[param])
    });
    if (values.length === 0) {
        where = '';
    }
    return [where.substr(0, where.length - 3), values];
}
