package com.campuspulse.attendance.common;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AccessForbiddenException extends RuntimeException {
    public AccessForbiddenException(String message) {
        super(message);
    }
}
