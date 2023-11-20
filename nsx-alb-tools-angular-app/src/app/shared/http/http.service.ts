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
    constructor(private readonly http: HttpClient) {}

    devBaseUrl = environment.apiUrl;

    public get(url: any, options?: Options): Observable<any> {
        return this.http.get(this.devBaseUrl + '/' + url, options );
    }

    public post(url: any, data: any, options?: Options): Observable<any> {
        return this.http.post(this.devBaseUrl + '/' + url, data, options);
    }

    public put(url: any, data: any, options?: Options): Observable<any> {
        return this.http.put(this.devBaseUrl + '/' + url, data, options);
    }

    public delete(url: any, options?: Options): Observable<any> {
        return this.http.delete(this.devBaseUrl + '/' + url, options);
    }
}
