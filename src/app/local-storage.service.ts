import { Injectable } from "@angular/core";
import { State } from "./local-storage-cache.type";
import { Observable, of } from "rxjs";
import { tap } from 'rxjs/operators';

const CACHE_TIMEOUT: string = "cacheTimeout"

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
    updateCacheTimeout(timeout: number) {
        // Set state without timeout to store the timeout itself
        this.setState<number>(CACHE_TIMEOUT, {data: timeout});
    }

    setState<T>(key: string, data: State<T>) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    set<T>(key: string, data: T) {
        this.setState(key, {
            lastUpdateTimestamp: Date.now(),
            data
        });
    }

    get<T>(key: string): State<T> | undefined {
        const state: State<T> = JSON.parse(localStorage.getItem(key));
        const cacheTimeout = Number(JSON.parse(localStorage.getItem(CACHE_TIMEOUT))?.data) || 2 * 60 * 60 * 1000;
        if (state && (state.lastUpdateTimestamp + cacheTimeout) < Date.now()) {
            return undefined;
        }
        return state;
    }

    getData<T>(key: string, src$: Observable<T>): Observable<T> {
        const state = this.get<T>(key);
        if (state) {
            return of(state.data);
        } else {
            return src$.pipe(
                tap(data => this.set<T>(key, data))
            );
        }
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }
}