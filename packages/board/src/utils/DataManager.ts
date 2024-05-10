export class DataManager<T extends Record<string, any>> {
  private _data: T;

  constructor(initialData: T) {
    this._data = initialData;
  }

  getData() {
    return this._data;
  }

  setData(data: Partial<T>) {
    this._data = { ...this._data, ...data };
  }

  getValue<K extends keyof T>(key: K): T[K] {
    return this._data[key];
  }

  setValue<K extends keyof T>(key: K, value: T[K]) {
    this._data[key] = value;
  }

  getValues<K extends keyof T>(keys: K[]): Pick<T, K> {
    const values: Pick<T, K> = {} as Pick<T, K>;
    keys.forEach((key) => {
      values[key] = this._data[key];
    });
    return values;
  }
}
