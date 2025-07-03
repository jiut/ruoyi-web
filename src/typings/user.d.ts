export interface LoginFrom {
	username: string // 用户名
	password: string // 用户密码
	type: string // 登录类型
}

export interface UserRole {
	roleId: string // 角色ID
	roleName: string // 角色名称
	roleKey: string // 角色标识
}

export interface LoginUserInfo {
	userId:bigint;// 用户id
	nickName:string; //用户账号
	avatar:string; // 用户头像
	userBalance:number; // 账户余额
	roles?: UserRole[] // 用户角色列表
}

export interface UserData {
	token:string; // 登录token
	user:LoginUserInfo; //用户信息
}
