package com.honeyapp.core.exceptions;

public class EntityAlreadyExistsException extends AppGenericException {
    public EntityAlreadyExistsException(String code, String message) {
        super(code + "AlreadyExists", message);
    }
}
