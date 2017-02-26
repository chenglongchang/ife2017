var Observer = (function(){
    function getType(parameter){
        return Object.prototype.toString.call(parameter).slice(8,-1);
    }

    var emitter = {
      // 注册事件
      on: function(event, fn) {
        var handles = this._handles || (this._handles = {}),
            calls = handles[event] || (handles[event] = []);
        // 找到对应名字的栈
        calls.push(fn);

        return this;
      },
      // 解绑事件
      off: function(event, fn) {
        if(!event || !this._handles) this._handles = {};
        if(!this._handles) return;

        var handles = this._handles , calls;

        if (calls = handles[event]) {
          if (!fn) {
            handles[event] = [];
            return this;
          }
          // 找到栈内对应listener 并移除
          for (var i = 0, len = calls.length; i < len; i++) {
            if (fn === calls[i]) {
              calls.splice(i, 1);
              return this;
            }
          }
        }
        return this;
      },
      // 触发事件
      emit: function(event){
        var args = [].slice.call(arguments, 1),
            handles = this._handles, calls;

        if (!handles || !(calls = handles[event])) return this;
        // 触发所有对应名字的listeners
        for (var i = 0, len = calls.length; i < len; i++) {
          calls[i].apply(this, args)
        }
        return this;
      }
    }

    var observer = function(options){
        this._init(options);
        this.addObserver(this.data);
    };

    observer.prototype._init = function(obj){
        this.data = obj;
    }

    observer.prototype.convert = function(obj,key,val){
        var self = this;
        Object.defineProperty(obj,key,{
            enumerable: true,
            configurable: true,
            get: function(){
                console.log('你访问了 ' + key);
                return val;
            },
            set: function(newValue){
                val = newValue;
                if(getType(newValue) === 'Object'){
                    Observer.prototype.addObserver(newValue);
                }
                console.log('你设置了 ' + key + '，新的值为' + newValue);
                self.emit(key,newValue);
            }
        })
    }

    observer.prototype.addObserver = function(obj){
        for(let key in obj){
            let val = obj[key];
            if(obj.hasOwnProperty(key)){
                if(getType(val) === 'Object'){
                    this.addObserver(val);
                }
                this.convert(obj,key,val);
            }
        }
    }

    Object.assign(observer.prototype,emitter);

    observer.prototype.$watch = function(type,handle){
        this.on(type,handle);
    }

    return observer;
})();
