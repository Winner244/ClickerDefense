export class Helper{
	public static getUrlQuery() : any{
		let parameters: any = {};
		window.location.search.substr(1).split('&').forEach(x => parameters[x.split('=')[0]] = x.split('=')[1]);
		return parameters;
	}
}