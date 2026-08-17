package spring.playground;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import spring.playground.modules.seafarer.indos.IndosMaster;
import spring.playground.modules.seafarer.indos.IndosMasterRepository;
import spring.playground.modules.shipping.berth.Berth;
import spring.playground.modules.shipping.berth.BerthRepository;
import spring.playground.modules.shipping.berthAllocation.BerthAllocation;
import spring.playground.modules.shipping.berthAllocation.BerthAllocationRepository;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocation;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocationController;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocationMapper;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocationPatchRequestDTO;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocationRepository;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocationRequestDTO;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocationResponseDTO;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocationServices;

public class BerthSeafarerAllocationTest {

    @Test
    public void testControllerCreate() {
        BerthSeafarerAllocationServices service = Mockito.mock(BerthSeafarerAllocationServices.class);
        BerthSeafarerAllocationController controller = new BerthSeafarerAllocationController(service);

        UUID id = UUID.randomUUID();
        UUID berthId = UUID.randomUUID();
        UUID indosId = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();

        BerthSeafarerAllocationRequestDTO requestDTO = BerthSeafarerAllocationRequestDTO.builder()
                .berthId(berthId)
                .indosMasterId(indosId)
                .startDate(now)
                .endDate(now.plusDays(7))
                .build();

        BerthSeafarerAllocationResponseDTO responseDTO = BerthSeafarerAllocationResponseDTO.builder()
                .id(id)
                .berthId(berthId)
                .indosMasterId(indosId)
                .startDate(now)
                .endDate(now.plusDays(7))
                .build();

        Mockito.when(service.createAllocation(requestDTO)).thenReturn(responseDTO);

        ResponseEntity<BerthSeafarerAllocationResponseDTO> response = controller.createAllocation(requestDTO);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(berthId, response.getBody().getBerthId());
        assertEquals(indosId, response.getBody().getIndosMasterId());
    }

    @Test
    public void testControllerGetById() {
        BerthSeafarerAllocationServices service = Mockito.mock(BerthSeafarerAllocationServices.class);
        BerthSeafarerAllocationController controller = new BerthSeafarerAllocationController(service);

        UUID id = UUID.randomUUID();
        BerthSeafarerAllocationResponseDTO responseDTO = BerthSeafarerAllocationResponseDTO.builder()
                .id(id)
                .startDate(OffsetDateTime.now())
                .build();

        Mockito.when(service.getAllocationById(id)).thenReturn(responseDTO);

        ResponseEntity<BerthSeafarerAllocationResponseDTO> response = controller.getAllocationById(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    public void testControllerUpdate() {
        BerthSeafarerAllocationServices service = Mockito.mock(BerthSeafarerAllocationServices.class);
        BerthSeafarerAllocationController controller = new BerthSeafarerAllocationController(service);

        UUID id = UUID.randomUUID();
        UUID berthId = UUID.randomUUID();
        UUID indosId = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();

        BerthSeafarerAllocationRequestDTO requestDTO = BerthSeafarerAllocationRequestDTO.builder()
                .berthId(berthId)
                .indosMasterId(indosId)
                .startDate(now)
                .endDate(now.plusDays(5))
                .build();

        BerthSeafarerAllocationResponseDTO responseDTO = BerthSeafarerAllocationResponseDTO.builder()
                .id(id)
                .berthId(berthId)
                .indosMasterId(indosId)
                .startDate(now)
                .endDate(now.plusDays(5))
                .build();

        Mockito.when(service.updateAllocation(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<BerthSeafarerAllocationResponseDTO> response = controller.updateAllocation(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    public void testControllerPatch() {
        BerthSeafarerAllocationServices service = Mockito.mock(BerthSeafarerAllocationServices.class);
        BerthSeafarerAllocationController controller = new BerthSeafarerAllocationController(service);

        UUID id = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();
        BerthSeafarerAllocationPatchRequestDTO requestDTO = BerthSeafarerAllocationPatchRequestDTO.builder()
                .startDate(now)
                .build();

        BerthSeafarerAllocationResponseDTO responseDTO = BerthSeafarerAllocationResponseDTO.builder()
                .id(id)
                .startDate(now)
                .build();

        Mockito.when(service.patchAllocation(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<BerthSeafarerAllocationResponseDTO> response = controller.patchAllocation(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(now, response.getBody().getStartDate());
    }

    @Test
    public void testControllerDelete() {
        BerthSeafarerAllocationServices service = Mockito.mock(BerthSeafarerAllocationServices.class);
        BerthSeafarerAllocationController controller = new BerthSeafarerAllocationController(service);
        UUID id = UUID.randomUUID();

        Mockito.doNothing().when(service).deleteAllocation(id);

        ResponseEntity<Void> response = controller.deleteAllocation(id);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        Mockito.verify(service).deleteAllocation(id);
    }

    @Test
    public void testServiceCreate() {
        BerthSeafarerAllocationRepository repository = Mockito.mock(BerthSeafarerAllocationRepository.class);
        BerthRepository berthRepository = Mockito.mock(BerthRepository.class);
        IndosMasterRepository indosRepository = Mockito.mock(IndosMasterRepository.class);
        BerthAllocationRepository allocationRepository = Mockito.mock(BerthAllocationRepository.class);
        BerthSeafarerAllocationMapper mapper = Mockito.mock(BerthSeafarerAllocationMapper.class);
        BerthSeafarerAllocationServices services = new BerthSeafarerAllocationServices(repository, berthRepository, indosRepository, allocationRepository, mapper);

        UUID berthId = UUID.randomUUID();
        Berth berth = new Berth();
        berth.setId(berthId);

        UUID indosId = UUID.randomUUID();
        IndosMaster indos = new IndosMaster();
        indos.setId(indosId);

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime later = now.plusDays(7);

        BerthSeafarerAllocationRequestDTO requestDTO = BerthSeafarerAllocationRequestDTO.builder()
                .berthId(berthId)
                .indosMasterId(indosId)
                .startDate(now)
                .endDate(later)
                .build();

        BerthSeafarerAllocation entity = new BerthSeafarerAllocation();
        entity.setStartDate(now);
        entity.setEndDate(later);

        Mockito.when(berthRepository.findById(berthId)).thenReturn(Optional.of(berth));
        Mockito.when(indosRepository.findById(indosId)).thenReturn(Optional.of(indos));
        Mockito.when(mapper.toEntity(requestDTO)).thenReturn(entity);
        Mockito.when(repository.save(entity)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(entity)).thenAnswer(invocation -> {
            BerthSeafarerAllocation e = invocation.getArgument(0);
            return BerthSeafarerAllocationResponseDTO.builder()
                    .berthId(e.getBerth() != null ? e.getBerth().getId() : null)
                    .indosMasterId(e.getIndosMaster() != null ? e.getIndosMaster().getId() : null)
                    .startDate(e.getStartDate())
                    .endDate(e.getEndDate())
                    .build();
        });

        BerthSeafarerAllocationResponseDTO result = services.createAllocation(requestDTO);

        assertEquals(now, result.getStartDate());
        assertEquals(later, result.getEndDate());
        assertEquals(berthId, result.getBerthId());
        assertEquals(indosId, result.getIndosMasterId());
        Mockito.verify(repository).save(entity);
    }

    @Test
    public void testServicePatch() {
        BerthSeafarerAllocationRepository repository = Mockito.mock(BerthSeafarerAllocationRepository.class);
        BerthRepository berthRepository = Mockito.mock(BerthRepository.class);
        IndosMasterRepository indosRepository = Mockito.mock(IndosMasterRepository.class);
        BerthAllocationRepository allocationRepository = Mockito.mock(BerthAllocationRepository.class);
        BerthSeafarerAllocationMapper mapper = Mockito.mock(BerthSeafarerAllocationMapper.class);
        BerthSeafarerAllocationServices services = new BerthSeafarerAllocationServices(repository, berthRepository, indosRepository, allocationRepository, mapper);

        UUID allocationId = UUID.randomUUID();
        UUID berthId = UUID.randomUUID();
        Berth berth = new Berth();
        berth.setId(berthId);

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime later = now.plusDays(7);

        BerthSeafarerAllocation existing = new BerthSeafarerAllocation();
        existing.setId(allocationId);
        existing.setStartDate(now);
        existing.setEndDate(later);

        BerthSeafarerAllocationPatchRequestDTO patchDTO = BerthSeafarerAllocationPatchRequestDTO.builder()
                .berthId(berthId)
                .endDate(later.plusDays(3))
                .build();

        Mockito.when(repository.findById(allocationId)).thenReturn(Optional.of(existing));
        Mockito.when(berthRepository.findById(berthId)).thenReturn(Optional.of(berth));
        Mockito.when(repository.save(existing)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(existing)).thenAnswer(invocation -> {
            BerthSeafarerAllocation e = invocation.getArgument(0);
            return BerthSeafarerAllocationResponseDTO.builder()
                    .id(e.getId())
                    .berthId(e.getBerth() != null ? e.getBerth().getId() : null)
                    .indosMasterId(e.getIndosMaster() != null ? e.getIndosMaster().getId() : null)
                    .startDate(e.getStartDate())
                    .endDate(e.getEndDate())
                    .build();
        });

        BerthSeafarerAllocationResponseDTO result = services.patchAllocation(allocationId, patchDTO);

        assertEquals(berthId, result.getBerthId());
        assertEquals(now, result.getStartDate()); // unchanged
        assertEquals(later.plusDays(3), result.getEndDate());
        Mockito.verify(repository).save(existing);
    }
}
