package com.honeyapp.core.exceptions;

public class EntityNotFoundException extends AppGenericException {
    public EntityNotFoundException(String code, String message) {
        super(code + "NotFound", message);
    }
}
