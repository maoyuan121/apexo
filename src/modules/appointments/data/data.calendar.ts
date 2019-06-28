import { computed, observable } from "mobx";

interface WeekDayInfo {
	index: number;
	day: string;
	dayShort: string;
}

export class Calendar {
	// constants
	daysShort = ["日", "一", "二", "三", "四", "五", "六"];
	days = [
		"星期日",
		"星期一",
		"星期二",
		"星期三",
		"星期四",
		"星期五",
		"星期六"
	];
	monthsShort = [
		"一月",
		"二月",
		"三月",
		"四月",
		"五月",
		"六月",
		"七月",
		"八月",
		"九月",
		"十月",
		"十一月",
		"十二月"
	];
	months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	// currents
	currentYear: number = new Date().getFullYear();
	currentMonth: number = new Date().getMonth();
	currentDay: number = new Date().getDate() - 1;

	// selected
	@observable selectedYear: number = this.currentYear;
	@observable selectedMonth: number = this.currentMonth;
	@observable selectedDay: number = this.currentDay;

	@computed
	get selectedMonthDays() {
		const days: {
			date: number;
			weekDay: WeekDayInfo;
		}[] = [];
		const numberOfDays = this.numberOfDays(
			this.selectedMonth,
			this.selectedYear
		);
		for (let date = 0; date < numberOfDays; date++) {
			days.push({
				date,
				weekDay: this.getDayOfTheWeek(
					this.selectedYear,
					this.selectedMonth,
					date + 1
				)
			});
		}
		return days;
	}
	@computed
	get selectedWeek() {
		const selectedDay = this.selectedMonthDays[this.selectedDay];
		const selectedWeek: { date: number; weekDay: WeekDayInfo }[] = [
			selectedDay
		];
		// look back
		if (selectedDay.weekDay.index !== 0 && selectedDay.date !== 0) {
			for (let index = this.selectedDay - 1; true; index--) {
				const day = this.selectedMonthDays[index];
				selectedWeek.push(day);
				if (day.weekDay.index === 0 || day.date === 0) {
					break;
				}
			}
		}
		// look forward
		if (
			selectedDay.weekDay.index !== 6 &&
			selectedDay.date + 1 !== this.selectedMonthDays.length
		) {
			for (let index = this.selectedDay + 1; true; index++) {
				const day = this.selectedMonthDays[index];
				selectedWeek.push(day);
				if (
					day.weekDay.index === 6 ||
					day.date + 1 === this.selectedMonthDays.length
				) {
					break;
				}
			}
		}
		return selectedWeek.sort((dayA, dayB) => dayA.date - dayB.date);
	}

	// 看某年某月有多少天
	numberOfDays(month: number, year: number): number {
		let numberOfDays = 28;
		for (; numberOfDays < 32; numberOfDays++) {
			if (new Date(year, month, numberOfDays + 1).getMonth() !== month) {
				return numberOfDays;
			}
		}
		return numberOfDays;
	}

	// 算出是星期几
	getDayOfTheWeek(year: number, month: number, day: number): WeekDayInfo {
		const index = new Date(year, month, day).getDay();
		return {
			index,
			day: this.days[index],
			dayShort: this.daysShort[index]
		};
	}

	// 根据时间戳选择当前日期
	selectDayByTimeStamp(timestamp: number) {
		const d = new Date(timestamp);
		this.selectedYear = d.getFullYear();
		this.selectedMonth = d.getMonth();
		this.selectedDay = d.getDate() - 1;
	}
}
