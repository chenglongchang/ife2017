var Observer = (function(){
    var observer = function(options){
        this._init(options);
    };
    observer.prototype._init = function(obj){
        this.data = obj;
        for(let key in this.data){
            let val = this.data[key];
            if(this.data.hasOwnProperty(key)){
                Object.defineProperty(this.data,key,{
                    enumerable:true,
                    configurable:true,
                    get: function(){
                        console.log('你访问了 ' + key);
                        return val;
                    },
                    set: function(newValue){
                        val = newValue;
                        console.log('你设置了 ' + key + '，新的值为' + newValue);
                    }
                })
            }
        }
    }
    return observer;
})();
