import "./home.scss";

import { computed, observable } from "mobx";

import { API } from "../";
import { Home } from "./home";
import { Route } from "./interface.route";

class Router {
	@observable reSyncing = false;

	@observable currentLocation = "";

	@observable innerWidth = 0;

	@computed
	get currentComponent() {
		return ( 
			this.directory.find(route => {
				return (
					(!route.condition || route.condition()) &&
					route.regex.test(this.currentLocation)
				);
			}) || { component: Home }
		).component;
	}

	@computed
	get currentNamespace() {
		return (
			this.directory.find(route => {
				return route.regex.test(this.currentLocation);
			}) || { namespace: "Home" }
		).namespace;
	}

	directory: Route[] = [];

	register(
		name: string,
		regex: RegExp,
		component: React.ComponentClass<any>,
		condition?: () => boolean
	) {
		this.directory.push({
			regex: regex,
			component: component,
			namespace: name,
			condition
		});
	}

	go(routes: string[]) {
		location.hash = "#!/" + routes.join("/");
		scrollTo(0, 0);
		API.menu.hide();
	}

	history(location: number) {
		history.go(location);
	}

	constructor() {
		setInterval(() => {
			const newLocation = location.hash.substr(3);
			if (newLocation !== this.currentLocation) {
				this.currentLocation = location.hash.substr(3);
				// resync this namespace database
				// todo
			}
		}, 20);

		this.innerWidth = innerWidth;
		addEventListener("resize", () => (this.innerWidth = innerWidth));
	}
}

export const router = new Router();
