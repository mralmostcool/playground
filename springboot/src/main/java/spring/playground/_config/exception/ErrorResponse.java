package spring.playground._config.exception;

import java.time.Instant;

public record ErrorResponse(int status, String message, Instant timestamp) {

}
