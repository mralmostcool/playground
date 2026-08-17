package spring.playground.modules.audit;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogsController {

    private final AuditLogsServices services;

    @GetMapping
    public ResponseEntity<List<AuditLogsResponseDTO>> getAllAuditLogs() {
        return ResponseEntity.ok(services.getAllAuditLogs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditLogsResponseDTO> getAuditLogById(@PathVariable UUID id) {
        return ResponseEntity.ok(services.getAuditLogById(id));
    }
}
