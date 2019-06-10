const Mediator = {

}

function mediatorAddFunc(name, callBack) {
    Mediator[name] = callBack;
}

function mediatorCallFunc(name, params = {}) {
   if ( typeof Mediator[name] ==='function') {
       Mediator[name](params);
    }

}

export {mediatorAddFunc, mediatorCallFunc}
