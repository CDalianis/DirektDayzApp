package com.honeyapp.core.exceptions;

public class EntityInvalidArgumentException extends AppGenericException {
    public EntityInvalidArgumentException(String code, String message) {
        super(code + "Invalid", message);
    }
}
