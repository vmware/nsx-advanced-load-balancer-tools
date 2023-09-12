/***************************************************************************
 * ========================================================================
 * Copyright 2023 VMware, Inc. All rights reserved. VMware Confidential
 * ========================================================================
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpService {
    constructor(private readonly http: HttpClient) {}

    devBaseUrl = 'http://localhost:3000/api';

    public get(url: any, params?: any): Observable<any> {
        return this.http.get(this.devBaseUrl + '/' + url, {params: params});
    }

    public post(url: any, data: any, params?: any): Observable<any> {
        return this.http.post(this.devBaseUrl + '/' + url, data, {params: params});
    }

    public put(url: any, data: any, params?: any): Observable<any> {
        return this.http.put(this.devBaseUrl + '/' + url, data, {params: params});
    }

    public delete(url: any, params?: any): Observable<any> {
        return this.http.delete(this.devBaseUrl + '/' + url, {params: params});
    }
}
