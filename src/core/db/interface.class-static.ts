import { IDocumentJSON } from './interface.document-json';
// 定义实体模型接口
// 对应的实现为 modules/模块名/data/class.appointment.ts

export interface IClassStatic extends IDocumentJSON {
	toJSON: () => PouchDB.Core.PutDocument<IDocumentJSON>;
	fromJSON: (json: IDocumentJSON) => void;
}
