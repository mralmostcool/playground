package spring.playground.modules.audit;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import spring.playground._config.exception.resource.NotFoundException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuditLogsServices {

    private final AuditLogsRepository repository;
    private final AuditLogsMapper mapper;

    public List<AuditLogsResponseDTO> getAllAuditLogs() {
        return repository.findAll().stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public AuditLogsResponseDTO getAuditLogById(UUID id) {
        AuditLogs entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Audit log not found with id: " + id));
        return mapper.toResponseDTO(entity);
    }
}
