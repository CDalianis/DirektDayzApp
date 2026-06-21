package com.honeyapp.core.exceptions;

import org.springframework.validation.BindingResult;

public class ValidationException extends AppGenericException {
    private final BindingResult bindingResult;

    public ValidationException(String code, String message, BindingResult bindingResult) {
        super(code + "ValidationError", message);
        this.bindingResult = bindingResult;
    }

    public BindingResult getBindingResult() {
        return bindingResult;
    }
}
