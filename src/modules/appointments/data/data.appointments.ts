import { API } from "../../../core";
import { Appointment } from "./class.appointment";
import { observable } from "mobx";
import { textualFilter } from "../../../assets/utils/textual-filter";

// 预约仓储
class AppointmentsData {
	ignoreObserver: boolean = false;
	@observable public list: Appointment[] = [];

	// 查询
	appointmentsForDay(
		year: number,
		month: number,
		day: number,
		filter?: string,
		operatorID?: string
	) {
		// 如果 year > 3000， 那么表示这个是 year 是时间戳
		// 将其转化成 date， 并付给 year，month，day
		if (year > 3000) {
			// it's a timestamp
			const date = new Date(year);
			year = date.getFullYear();
			month = date.getMonth() + 1;
			day = date.getDate();
		}

		// 根据时间过滤
		let list = this.list.filter(appointment => {
			const date = new Date(appointment.date);
			return (
				date.getFullYear() === year &&
				date.getMonth() + 1 === month &&
				date.getDate() === day
			);
		});

		// 根据输入文本过滤
		if (filter) {
			list = textualFilter(list, filter);
		}

		// 根据操作员过滤
		if (operatorID) {
			list = list.filter(
				appointment => appointment.staffID.indexOf(operatorID) !== -1
			);
		}
		return list;
	}

	// 根据主键获取 index
	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}


	// 删除之前弹模态窗
	deleteModal(id: string) {
		API.modals.newModal({
			message: "Are you sure you want to delete this appointment?",
			onConfirm: () => this.deleteByID(id)
		});
	}

	// 删除
	deleteByID(id: string) {
		const i = this.getIndexByID(id);
		const appointment = this.list.splice(i, 1)[0];
		// delete photos
		appointment.records.forEach(async fileID => {
			await API.files.remove(fileID);
		});
	}
}

export default new AppointmentsData();
