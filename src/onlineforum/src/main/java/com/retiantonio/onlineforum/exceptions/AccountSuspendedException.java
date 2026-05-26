package com.retiantonio.onlineforum.exceptions;

import java.time.LocalDateTime;

public class AccountSuspendedException extends RuntimeException {
    private final LocalDateTime suspendedUntil;

    public AccountSuspendedException(LocalDateTime suspendedUntil) {
        super("Account is suspended until " + suspendedUntil);
        this.suspendedUntil = suspendedUntil;
    }

    public LocalDateTime getSuspendedUntil() {
        return suspendedUntil;
    }
}