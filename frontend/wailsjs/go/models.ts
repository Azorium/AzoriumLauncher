export namespace service {
	
	export class Classpaths {
	    windows: string;
	    linux: string;
	    macos: string;
	
	    static createFrom(source: any = {}) {
	        return new Classpaths(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.windows = source["windows"];
	        this.linux = source["linux"];
	        this.macos = source["macos"];
	    }
	}
	export class ClientArguments {
	    game: number[];
	    jvm: string[];
	
	    static createFrom(source: any = {}) {
	        return new ClientArguments(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.game = source["game"];
	        this.jvm = source["jvm"];
	    }
	}
	export class Backend {
	    folderName: string;
	    javaVersion: string;
	    mainClass: string;
	    arguments: ClientArguments;
	    classpaths: Classpaths;
	
	    static createFrom(source: any = {}) {
	        return new Backend(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.folderName = source["folderName"];
	        this.javaVersion = source["javaVersion"];
	        this.mainClass = source["mainClass"];
	        this.arguments = this.convertValues(source["arguments"], ClientArguments);
	        this.classpaths = this.convertValues(source["classpaths"], Classpaths);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class BaseItem {
	    index: number;
	    name: string;
	    description: string;
	    value: boolean;
	
	    static createFrom(source: any = {}) {
	        return new BaseItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.index = source["index"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.value = source["value"];
	    }
	}
	export class Base {
	    autoClose: BaseItem;
	    debug: BaseItem;
	
	    static createFrom(source: any = {}) {
	        return new Base(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.autoClose = this.convertValues(source["autoClose"], BaseItem);
	        this.debug = this.convertValues(source["debug"], BaseItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	
	export class Profile {
	    mcVersion: string;
	    loaderType: string;
	    loaderVersion: string;
	    backend: Backend;
	
	    static createFrom(source: any = {}) {
	        return new Profile(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mcVersion = source["mcVersion"];
	        this.loaderType = source["loaderType"];
	        this.loaderVersion = source["loaderVersion"];
	        this.backend = this.convertValues(source["backend"], Backend);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Mod {
	    name: string;
	    description: string;
	    fileName: string;
	    value: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Mod(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	        this.fileName = source["fileName"];
	        this.value = source["value"];
	    }
	}
	export class ProfileSettings {
	    optionalMods: Mod[];
	
	    static createFrom(source: any = {}) {
	        return new ProfileSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.optionalMods = this.convertValues(source["optionalMods"], Mod);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class SettingsObj {
	    dedicatedRamGB: number;
	    startCardPage: string;
	    base: Base;
	    profiles: Record<string, ProfileSettings>;
	
	    static createFrom(source: any = {}) {
	        return new SettingsObj(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dedicatedRamGB = source["dedicatedRamGB"];
	        this.startCardPage = source["startCardPage"];
	        this.base = this.convertValues(source["base"], Base);
	        this.profiles = this.convertValues(source["profiles"], ProfileSettings, true);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace src {
	
	export class UserType {
	    username: string;
	    uuid: string;
	    jwt_token: string;
	
	    static createFrom(source: any = {}) {
	        return new UserType(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.username = source["username"];
	        this.uuid = source["uuid"];
	        this.jwt_token = source["jwt_token"];
	    }
	}

}

