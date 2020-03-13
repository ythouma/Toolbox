import { environment } from '../environments/environment';
export class MenuConfig {
	public defaults: any = {
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'dashboard',
					page: '/dashboard',
					bullet: 'dot',
				},
				{
					title: 'Tiles',
					root: true,
					bullet: 'dot',
					icon: 'add',
					target: 'tiles',
					submenu: [
						{
							title: 'Widgets',
							page: '/tiles/widgets',
						},
					]
				},
				{
					title: 'Mobile App',
					root: true,
					bullet: 'dot',
					icon: 'add',
					target: 'mobile-app',
					submenu: [
						{
							title: 'Pages',
							page: '/mobile-app/pages',
						},
					]
				},
				{
					title: 'Engine',
					root: true,
					bullet: 'dot',
					icon: 'add',
					target: 'engine',
					submenu: [
						{
							title: 'Workflows',
							page: '/engine/workflows',
						},
					]
				},
				// {
				// 	title: 'Dummy',
				// 	root: true,
				// 	icon: 'notes',
				// 	page: '/dummy',
				// 	bullet: 'dot'
				// }
			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
