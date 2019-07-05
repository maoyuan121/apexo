import * as appointmentsComponents from "./components";
import * as appointmentsData from "./data";

import { API } from "../../core";

// 导出注册器
export const register = {
	async register() {
		// 注册路由
		API.router.register(
			appointmentsData.namespace,
			/^appointments/,
			appointmentsComponents.Calendar
		);

		// 添加菜单
		API.menu.items.push({
			icon: "Calendar",
			name: appointmentsData.namespace,
			key: appointmentsData.namespace,
			onClick: () => {
				API.router.go([appointmentsData.namespace]);
			},
			order: 3,
			url: "",
			condition: () => API.user.currentUser.canViewAppointments
		});

		await (API.connectToDB(appointmentsData.namespace, true) as any)(
			appointmentsData.Appointment,
			appointmentsData.appointments
		);

		return true;
	},
	order: 9
};

// 导出数据
export { appointmentsData };

// 导出组件
export { appointmentsComponents };
