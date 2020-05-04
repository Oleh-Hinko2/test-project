import http from '../index';

export function fetchUsers() {
    return http.get(`users`)
        .then(response => response)
        .catch(error => error.response);
};
