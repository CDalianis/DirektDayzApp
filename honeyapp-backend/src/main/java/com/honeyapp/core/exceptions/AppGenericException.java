package com.honeyapp.core.exceptions;

public abstract class AppGenericException extends RuntimeException {
    private final String code;

    protected AppGenericException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
