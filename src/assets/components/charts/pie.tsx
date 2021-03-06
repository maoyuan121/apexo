import * as React from 'react';
import { Chart } from 'chart.js';
import { colors } from './colors';



export class PieChart extends React.Component<
	{
		height: number;
		data: {
			label: string;
			value: number;
		}[];
	},
	{}
> {
	private id: string = 'id' + Math.random().toString(32).substr(4);
	private graph() {
		const ctx = (document.getElementById(this.id) as HTMLCanvasElement).getContext(
			'2d'
		) as CanvasRenderingContext2D;
		const chart = new Chart(ctx, {
			type: 'pie',
			data: {
				datasets: [
					{
						data: this.props.data.map((x) => x.value),
						backgroundColor: this.props.data.map((x, i) => colors[i])
					}
				],
				labels: this.props.data.map((x) => x.label)
			},
			options: {
				responsive: true
			}
		});
	}
	render() {
		return (
			<div id={this.id + '_container'} style={{ height: this.props.height }}>
				<canvas id={this.id} style={{ height: '100%', width: '100%' }} />
			</div>
		);
	}
	componentWillUpdate() {
		(document.getElementById(this.id + '_container') as HTMLDivElement).innerHTML = `<canvas id="${this
			.id}" style="height: 100%; width: 100%" />`;
	}
	componentDidUpdate() {
		this.graph();
	}
	componentDidMount() {
		this.graph();
	}
}
