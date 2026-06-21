package com.honeyapp.core.exceptions;

public class FileUploadException extends AppGenericException {
    public FileUploadException(String code, String message) {
        super(code + "UploadError", message);
    }
}
