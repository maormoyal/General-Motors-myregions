export interface IData {
  id: string;
  image: string;
  regions: string;
}

export interface IRectangle {
  id: number;
  label: string;
  points: number[];
}

export interface IDataToSave {
  id: string;
  regions: IRectangle[];
}
