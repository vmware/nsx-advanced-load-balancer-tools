/***************************************************************************
 * ========================================================================
 * Copyright 2023 VMware, Inc. All rights reserved. VMware Confidential
 * ========================================================================
 */

import {
    HttpClient,
    HttpContext,
    HttpHeaders,
    HttpParams
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

type Options = {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: any;
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType: any;
    withCredentials?: boolean;
}

@Injectable()
export class HttpService {
    private apiUrl: string;

    constructor(private readonly http: HttpClient) {
        const port = environment.apiPort || 3000;
        const hostname = window.location.hostname || 'localhost';

        this.apiUrl = `http://${hostname}:${port}/api`;
    }

    public get(url: any, options?: Options): Observable<any> {
        return this.http.get(this.apiUrl + '/' + url, options );
    }

    public post(url: any, data: any, options?: Options): Observable<any> {
        return this.http.post(this.apiUrl + '/' + url, data, options);
    }

    public put(url: any, data: any, options?: Options): Observable<any> {
        return this.http.put(this.apiUrl + '/' + url, data, options);
    }

    public delete(url: any, options?: Options): Observable<any> {
        return this.http.delete(this.apiUrl + '/' + url, options);
    }
}
