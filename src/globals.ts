import { BehaviorSubject, Observable, of as ObservableOf } from 'rxjs';

export var username: string = '';
export var token: string = '';
var userloggedinBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
export var userloggedin: Observable<boolean> = userloggedinBehaviorSubject.asObservable();
export var updateLogin = function(newloggedin, newusername, newtoken) {
    username = newusername;
    token = newtoken;
    userloggedinBehaviorSubject.next(newloggedin);
};