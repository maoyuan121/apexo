import { API } from "../../../core";
import { Appointment } from "./class.appointment";
import { observable } from "mobx";
import { textualFilter } from "../../../assets/utils/textual-filter";

class AppointmentsData {
	ignoreObserver: boolean = false;
	@observable public list: Appointment[] = [];

	appointmentsForDay(
		year: number,
		month: number,
		day: number,
		filter?: string,
		operatorID?: string
	) {
		if (year > 3000) {
			// it's a timestamp
			const date = new Date(year);
			year = date.getFullYear();
			month = date.getMonth() + 1;
			day = date.getDate();
		}

		let list = this.list.filter(appointment => {
			const date = new Date(appointment.date);
			return (
				date.getFullYear() === year &&
				date.getMonth() + 1 === month &&
				date.getDate() === day
			);
		});

		if (filter) {
			list = textualFilter(list, filter);
		}

		if (operatorID) {
			list = list.filter(
				appointment => appointment.staffID.indexOf(operatorID) !== -1
			);
		}
		return list;
	}
	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}
	deleteModal(id: string) {
		API.modals.newModal({
			message: "Are you sure you want to delete this appointment?",
			onConfirm: () => this.deleteByID(id)
		});
	}
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
