const Mediator = {

}

function mediatorAddFunc(name,callBack) {
    Mediator[name] = callBack;
}

function mediatorCallFunc(name) {
   if ( typeof Mediator[name] ==='function') {
       Mediator[name]();
    }

}

export {mediatorAddFunc, mediatorCallFunc}
