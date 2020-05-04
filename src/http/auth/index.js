import http from '../index';

export function fetchAuth(data) {
    return http.post(`token`, data)
        .then(response => response)
        .catch(error => error.response);
};
