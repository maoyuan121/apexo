export interface InteractionMethods<ClassStatic> {

	// 同步到数据库
	syncListToDatabase(newList: ClassStatic[]): Promise<void>;

	// 添加 document
	add(item: ClassStatic): Promise<PouchDB.Core.Response>;

	// 删除 document
	remove(_id: string): Promise<PouchDB.Core.Response>;

	// 更新 document
	update(_id: string, item: ClassStatic): Promise<PouchDB.Core.Response>;
}
