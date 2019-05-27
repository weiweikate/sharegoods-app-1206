import LoginModula from './Login';
import ShowModula from './Show';
import Message from './Message';
import Comm from './Comm';
import Order from './Order';
import Mine from './Mine';
import PageModula from './Page';
import PaymentPoint from './PaymentPoint'

const Event = {
    ...LoginModula,
    ...ShowModula,
    ...Message,
    ...Comm,
    ...Order,
    ...Mine,
    ...PageModula,
    ...PaymentPoint
};
export default Event;
