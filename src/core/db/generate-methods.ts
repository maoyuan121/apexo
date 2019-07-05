import { diff } from "fast-array-diff";
import { IClassCreator } from "./interface.class-creator";
import { IClassStatic } from "./interface.class-static";
import { IMobXStore } from "./interface.mobx-store";
import { InteractionMethods } from "./interface.interaction-methods";
import { observeItem } from "./observe-item";

export function generateMethods(
	db: PouchDB.Database,
	data: IMobXStore,
	Class: IClassCreator
) {
	const methods: InteractionMethods<IClassStatic> = {
		/**
		 * Put the MobX store list into the database by diffing the new store with the cache
		 *
		 */
		async syncListToDatabase(newList: IClassStatic[]) {
			const current = await db.allDocs({});
			const currentIDs = current.rows.map(x => x.id);

			// diff
			const result = diff<string>(
				currentIDs.sort(),
				newList.map(x => x._id).sort()
			);
			// remove the removed
			result.removed.forEach(_id => {
				methods.remove(_id);
			});

			// add the added
			result.added.forEach(_id => {
				const document = newList.find(doc => doc._id === _id);
				if (!document) {
					return;
				}
				observeItem(document, data, methods);
				methods.add(document);
			});
		},

		// 添加文档
		async add(item: IClassStatic) {
			const response = await db.put(item.toJSON());
			return response;
		},

		// 删除文档
		async remove(_id: string) {
			const doc = await db.get(_id);
			const response = await db.remove(doc._id, doc._rev || "");
			return response;
		},

		// 更新文档
		async update(_id: string, item: IClassStatic) {
			const document = item.toJSON();
			const doc = await db.get(_id);
			document._rev = doc._rev;
			const response = await db.put(document);
			return response;
		}
	};
	return methods;
}
