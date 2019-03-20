import  LoginModula from './Login'
import  ShowModula from './Show'
import  Message from './Message'
import  Comm from './Comm'
import Order from './Order'
import Mine from './Mine'
 const Event = {
    ...LoginModula,
    ...ShowModula,
    ...Message,
    ...Comm,
    ...Order,
    ...Mine
}
export default Event
