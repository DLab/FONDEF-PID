export class Invoker {
    private instance:any;
    private fnc:any;

    constructor(instance:any, fnc:string){
        this.instance = instance;
        this.fnc = fnc;
    }

    invokeMethod(params?:any){
        if (params){
            this.instance[this.fnc](params);
        }
        else{
            this.instance[this.fnc]();
        }
        
    }
    invokeFunction(params?:any){
        if (params){
            return this.instance[this.fnc](params);
        }
        else{
            return this.instance[this.fnc]();
        }
        
    }
}
