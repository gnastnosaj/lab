import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RxBus {
    bus: Subject<any> = new Subject();
    subjectMapper: {
        [propName: string]: Array<Subject<any>>;
    } = {};

    toObserverable(): Observable<any> {
        return this.bus;
    }

    send(object: any) {
        this.bus.next(object);
    }

    register<T>(tag: any): Observable<T> {
        const subject = new Subject<T>();
        let subjectList = this.subjectMapper[tag];
        if (subjectList == null) {
            subjectList = new Array<Subject<T>>();
            this.subjectMapper[tag] = subjectList;
        }
        subjectList.push(subject);
        return subject;
    }

    unregister(tag: any, observable: Observable<any>) {
        const subjectList = this.subjectMapper[tag];
        if (subjectList != null) {
            this.subjectMapper[tag] = subjectList.filter(subject => subject !== observable);

            if (this.subjectMapper[tag].length === 0) {
                delete this.subjectMapper[tag];
            }
        }
    }

    post<T>(tag: any, object: T) {
        const subjectList = this.subjectMapper[tag];
        if (subjectList != null) {
            subjectList.forEach(subject => subject.next(object));
        }
    }
}
