package spring.playground.modules.audit;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AuditLogsMapperTest {

    @Test
    void shouldMapEntityToResponseDTO() {
        // Given
        UUID id = UUID.randomUUID();
        UUID recordId = UUID.randomUUID();
        UUID changedBy = UUID.randomUUID();
        OffsetDateTime changedAt = OffsetDateTime.now();

        AuditLogs entity = AuditLogs.builder()
                .id(id)
                .tableName("users")
                .operation("INSERT")
                .recordId(recordId)
                .oldValues(null)
                .newValues("{\"username\": \"test\"}")
                .changedBy(changedBy)
                .changedAt(changedAt)
                .build();

        // When
        AuditLogsResponseDTO responseDTO = AuditLogsMapper.INSTANCE.toResponseDTO(entity);

        // Then
        assertNotNull(responseDTO);
        assertEquals(id, responseDTO.getId());
        assertEquals("users", responseDTO.getTableName());
        assertEquals("INSERT", responseDTO.getOperation());
        assertEquals(recordId, responseDTO.getRecordId());
        assertNull(responseDTO.getOldValues());
        assertEquals("{\"username\": \"test\"}", responseDTO.getNewValues());
        assertEquals(changedBy, responseDTO.getChangedBy());
        assertEquals(changedAt, responseDTO.getChangedAt());
    }

    @Test
    void shouldMapRequestDTOToEntity() {
        // Given
        UUID recordId = UUID.randomUUID();
        UUID changedBy = UUID.randomUUID();

        AuditLogsRequestDTO requestDTO = AuditLogsRequestDTO.builder()
                .tableName("users")
                .operation("UPDATE")
                .recordId(recordId)
                .oldValues("{\"username\": \"test\"}")
                .newValues("{\"username\": \"test2\"}")
                .changedBy(changedBy)
                .build();

        // When
        AuditLogs entity = AuditLogsMapper.INSTANCE.toEntity(requestDTO);

        // Then
        assertNotNull(entity);
        assertNull(entity.getId());
        assertEquals("users", entity.getTableName());
        assertEquals("UPDATE", entity.getOperation());
        assertEquals(recordId, entity.getRecordId());
        assertEquals("{\"username\": \"test\"}", entity.getOldValues());
        assertEquals("{\"username\": \"test2\"}", entity.getNewValues());
        assertEquals(changedBy, entity.getChangedBy());
        assertNull(entity.getChangedAt());
    }
}
