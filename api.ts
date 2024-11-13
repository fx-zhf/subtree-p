import { IElement } from "./model";

export class WxDBWebAPI {
	sid: string = "";
	errorURL: string = "";
	elements: Record<string, IElement> = {};
	apiURL = "";
	projectInfo: {
		creator: string;
		project: string;
	} = {
			creator: "default",
			project: "project"
		}
	constructor() {
	}

	apiEleGet<T>(
		elementName: string,
		methodName: string,
		param?: any
	): Promise<T> {
		const ele = this.elements[elementName];
		let signStr: string = "";
		let strURL: string = urlPathJoin(
			this.apiURL,
			this.projectInfo.creator + "/" + this.projectInfo.project,
			elementName
		);
		if (ele) {
			signStr = ele.SignStr;
			strURL = urlPathJoin(this.apiURL, ele.URL);
		}
		return this.apiGet({ url: strURL, signStr, methodName, param });
	}
	apiElePost<T>(
		elementName: string,
		methodName: string,
		param?: any
	): Promise<T> {
		const ele = this.elements[elementName];
		let signStr: string = "";
		let strURL: string = urlPathJoin(
			this.apiURL,
			this.projectInfo.creator + "/" + this.projectInfo.project,
			elementName
		);
		if (ele) {
			signStr = ele.SignStr;
			strURL = urlPathJoin(this.apiURL, ele.URL);
		}

		return this.apiPost({ url: strURL, signStr, methodName, param: param ? JSON.stringify(param) : param });
	}
	apiGet = <T>(opt: APIOption): Promise<T> => {
		if (!opt.header) {
			opt.header = {} as Record<string, any>;
		}
		opt.header['dbweb-api'] = opt.methodName;
		opt.header['dbweb-sid'] = this.sid || '';
		opt.header["dbweb-client-mobile"] = "1";
		if (opt.signStr) {
			opt.header['dbweb-sign'] = opt.signStr;
		}
		let data = {}

		data = {
			_p: JSON.stringify(opt.param ? opt.param : null)
		}

		return new Promise<T>((resolve, reject) => {
			wx.request({
				...opt,
				method: 'GET',
				data: data,
				success: (res) => {
					checkRes<T>(opt, res, resolve, reject);
				},
				fail: res => {
					console.log("调用失败", res);
					reject(res);
				}
			});

		});
	}
	apiPost = <T>(opt: APIOption): Promise<T> => {
		if (!opt.header) {
			opt.header = {} as Record<string, any>;
		}
		opt.header['dbweb-api'] = opt.methodName;
		opt.header['dbweb-sid'] = this.sid || '';
		opt.header["dbweb-client-mobile"] = "1";
		if (opt.signStr) {
			opt.header['dbweb-sign'] = opt.signStr;
		}
		return new Promise<T>((resolve, reject) => {
			wx.request({
				...opt,
				method: 'POST',
				dataType: 'json',
				data: opt.param,
				success: (res) => {
					checkRes<T>(opt, res, resolve, reject);
				},
				fail: (res) => {
					console.log(res, 'res');
					reject(res.errMsg);
				}
			});
		});
	};
};
//上一次401出错的url，同一个url不能重复出现401错误
let pre401URL = "";
export interface APIOption extends WechatMiniprogram.RequestOption {
	methodName: string;
	signStr?: string;
	param?: any;
}
const checkRes = <T>(opt: APIOption, res: WechatMiniprogram.RequestSuccessCallbackResult<string | Record<string, any> | ArrayBuffer>,
	resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => {
	if (res.statusCode !== 200) {
		if (res.data === "当前用户已被禁用，请重新登录" && res.statusCode === 500) {
			wx.showModal({
				title: '错误',
				content: '当前用户已被禁用，请重新登录',
				showCancel: false,
				success: function (res) {
					if (res.confirm) {
						wx.reLaunch({
							url: '/pages/error/error?title=错误&text=当前用户已被禁用，请重新登录'
						});
					}
				}
			})
		}
		if (res.statusCode === 401) {
			if (pre401URL === opt.url) {
				wx.reLaunch({
					url: '/pages/error/error?title=401错误&text=' + res.errMsg
				});
				reject(false);
				return;
			}
			pre401URL = opt.url;
			wx.reLaunch({
				url: '/pages/loading/loading'
			});
			reject(false);
			// globalData.qcauth.refreshLogin().then(() => {
			//     apiGet<T>(opt).then(sres => resolve(sres));
			// })
		} else {
			reject(res.data);
		}
		return;
	}
	resolve(res.data as T);
}
export const API = new WxDBWebAPI();

export const urlPathJoin = (...p: string[]) => {
	return p.filter(p => p).map(v => {
		let rev = v;
		if (rev.endsWith('/')) {
			rev = rev.substr(0, rev.length - 1);
		}
		if (rev.startsWith('/')) {
			rev = rev.substr(1, rev.length - 1);
		}
		return rev;
	}).join('/');
}