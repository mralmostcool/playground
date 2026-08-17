package spring.playground;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import spring.playground.modules.audit.AuditLogs;
import spring.playground.modules.audit.AuditLogsController;
import spring.playground.modules.audit.AuditLogsMapper;
import spring.playground.modules.audit.AuditLogsRepository;
import spring.playground.modules.audit.AuditLogsResponseDTO;
import spring.playground.modules.audit.AuditLogsServices;

public class AuditLogsTest {

    @Test
    public void testControllerGetAll() {
        AuditLogsServices service = Mockito.mock(AuditLogsServices.class);
        AuditLogsController controller = new AuditLogsController(service);

        UUID logId = UUID.randomUUID();
        AuditLogsResponseDTO logResponse = AuditLogsResponseDTO.builder()
                .id(logId)
                .tableName("vessel")
                .operation("INSERT")
                .recordId(UUID.randomUUID())
                .newValues("{\"name\": \"Vessel A\"}")
                .changedAt(OffsetDateTime.now())
                .build();

        Mockito.when(service.getAllAuditLogs()).thenReturn(Collections.singletonList(logResponse));

        ResponseEntity<List<AuditLogsResponseDTO>> response = controller.getAllAuditLogs();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("vessel", response.getBody().get(0).getTableName());
    }

    @Test
    public void testControllerGetById() {
        AuditLogsServices service = Mockito.mock(AuditLogsServices.class);
        AuditLogsController controller = new AuditLogsController(service);

        UUID logId = UUID.randomUUID();
        AuditLogsResponseDTO logResponse = AuditLogsResponseDTO.builder()
                .id(logId)
                .tableName("berth")
                .operation("UPDATE")
                .recordId(UUID.randomUUID())
                .oldValues("{\"name\": \"Berth A\"}")
                .newValues("{\"name\": \"Berth B\"}")
                .changedAt(OffsetDateTime.now())
                .build();

        Mockito.when(service.getAuditLogById(logId)).thenReturn(logResponse);

        ResponseEntity<AuditLogsResponseDTO> response = controller.getAuditLogById(logId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("berth", response.getBody().getTableName());
        assertEquals("UPDATE", response.getBody().getOperation());
    }

    @Test
    public void testServiceGetAll() {
        AuditLogsRepository repository = Mockito.mock(AuditLogsRepository.class);
        AuditLogsMapper mapper = Mockito.mock(AuditLogsMapper.class);
        AuditLogsServices services = new AuditLogsServices(repository, mapper);

        AuditLogs entity = new AuditLogs();
        entity.setTableName("company");
        entity.setOperation("DELETE");
        entity.setRecordId(UUID.randomUUID());

        Mockito.when(repository.findAll()).thenReturn(Collections.singletonList(entity));
        Mockito.when(mapper.toResponseDTO(entity)).thenAnswer(invocation -> {
            AuditLogs log = invocation.getArgument(0);
            return AuditLogsResponseDTO.builder()
                    .tableName(log.getTableName())
                    .operation(log.getOperation())
                    .recordId(log.getRecordId())
                    .build();
        });

        List<AuditLogsResponseDTO> result = services.getAllAuditLogs();
        assertEquals(1, result.size());
        assertEquals("company", result.get(0).getTableName());
        assertEquals("DELETE", result.get(0).getOperation());
    }

    @Test
    public void testServiceGetById() {
        AuditLogsRepository repository = Mockito.mock(AuditLogsRepository.class);
        AuditLogsMapper mapper = Mockito.mock(AuditLogsMapper.class);
        AuditLogsServices services = new AuditLogsServices(repository, mapper);

        UUID logId = UUID.randomUUID();
        AuditLogs entity = new AuditLogs();
        entity.setId(logId);
        entity.setTableName("vessel");
        entity.setOperation("INSERT");
        entity.setRecordId(UUID.randomUUID());

        Mockito.when(repository.findById(logId)).thenReturn(Optional.of(entity));
        Mockito.when(mapper.toResponseDTO(entity)).thenAnswer(invocation -> {
            AuditLogs log = invocation.getArgument(0);
            return AuditLogsResponseDTO.builder()
                    .id(log.getId())
                    .tableName(log.getTableName())
                    .operation(log.getOperation())
                    .recordId(log.getRecordId())
                    .build();
        });

        AuditLogsResponseDTO result = services.getAuditLogById(logId);
        assertNotNull(result);
        assertEquals(logId, result.getId());
        assertEquals("vessel", result.getTableName());
    }
}
