import LoginModula from "./Login";
import ShowModula from "./Show";
import Message from "./Message";
import Comm from "./Comm";
import Order from "./Order";
import Mine from "./Mine";
import PageModula from "./Page";

const Event = {
    ...LoginModula,
    ...ShowModula,
    ...Message,
    ...Comm,
    ...Order,
    ...Mine,
    ...PageModula
};
export default Event;
