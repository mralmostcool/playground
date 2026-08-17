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

import spring.playground.modules.shipping.berth.Berth;
import spring.playground.modules.shipping.berth.BerthRepository;
import spring.playground.modules.shipping.berthAllocation.BerthAllocation;
import spring.playground.modules.shipping.berthAllocation.BerthAllocationController;
import spring.playground.modules.shipping.berthAllocation.BerthAllocationMapper;
import spring.playground.modules.shipping.berthAllocation.BerthAllocationPatchRequestDTO;
import spring.playground.modules.shipping.berthAllocation.BerthAllocationRepository;
import spring.playground.modules.shipping.berthAllocation.BerthAllocationRequestDTO;
import spring.playground.modules.shipping.berthAllocation.BerthAllocationResponseDTO;
import spring.playground.modules.shipping.berthAllocation.BerthAllocationServices;
import spring.playground.modules.shipping.vessel.Vessel;
import spring.playground.modules.shipping.vessel.VesselRepository;

public class BerthAllocationTest {

    @Test
    public void testControllerCreate() {
        BerthAllocationServices service = Mockito.mock(BerthAllocationServices.class);
        BerthAllocationController controller = new BerthAllocationController(service);

        UUID id = UUID.randomUUID();
        UUID berthId = UUID.randomUUID();
        UUID vesselId = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime later = now.plusHours(2);

        BerthAllocationRequestDTO requestDTO = BerthAllocationRequestDTO.builder()
                .berthId(berthId)
                .vesselId(vesselId)
                .startDate(now)
                .endDate(later)
                .build();

        BerthAllocationResponseDTO responseDTO = BerthAllocationResponseDTO.builder()
                .id(id)
                .berthId(berthId)
                .vesselId(vesselId)
                .startDate(now)
                .endDate(later)
                .build();

        Mockito.when(service.createAllocation(requestDTO)).thenReturn(responseDTO);

        ResponseEntity<BerthAllocationResponseDTO> response = controller.createAllocation(requestDTO);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(berthId, response.getBody().getBerthId());
        assertEquals(vesselId, response.getBody().getVesselId());
    }

    @Test
    public void testControllerGetById() {
        BerthAllocationServices service = Mockito.mock(BerthAllocationServices.class);
        BerthAllocationController controller = new BerthAllocationController(service);

        UUID id = UUID.randomUUID();
        BerthAllocationResponseDTO responseDTO = BerthAllocationResponseDTO.builder()
                .id(id)
                .startDate(OffsetDateTime.now())
                .build();

        Mockito.when(service.getAllocationById(id)).thenReturn(responseDTO);

        ResponseEntity<BerthAllocationResponseDTO> response = controller.getAllocationById(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    public void testControllerUpdate() {
        BerthAllocationServices service = Mockito.mock(BerthAllocationServices.class);
        BerthAllocationController controller = new BerthAllocationController(service);

        UUID id = UUID.randomUUID();
        UUID berthId = UUID.randomUUID();
        UUID vesselId = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();

        BerthAllocationRequestDTO requestDTO = BerthAllocationRequestDTO.builder()
                .berthId(berthId)
                .vesselId(vesselId)
                .startDate(now)
                .endDate(now.plusHours(1))
                .build();

        BerthAllocationResponseDTO responseDTO = BerthAllocationResponseDTO.builder()
                .id(id)
                .berthId(berthId)
                .vesselId(vesselId)
                .startDate(now)
                .endDate(now.plusHours(1))
                .build();

        Mockito.when(service.updateAllocation(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<BerthAllocationResponseDTO> response = controller.updateAllocation(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    public void testControllerPatch() {
        BerthAllocationServices service = Mockito.mock(BerthAllocationServices.class);
        BerthAllocationController controller = new BerthAllocationController(service);

        UUID id = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();
        BerthAllocationPatchRequestDTO requestDTO = BerthAllocationPatchRequestDTO.builder()
                .startDate(now)
                .build();

        BerthAllocationResponseDTO responseDTO = BerthAllocationResponseDTO.builder()
                .id(id)
                .startDate(now)
                .build();

        Mockito.when(service.patchAllocation(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<BerthAllocationResponseDTO> response = controller.patchAllocation(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(now, response.getBody().getStartDate());
    }

    @Test
    public void testControllerDelete() {
        BerthAllocationServices service = Mockito.mock(BerthAllocationServices.class);
        BerthAllocationController controller = new BerthAllocationController(service);
        UUID id = UUID.randomUUID();

        Mockito.doNothing().when(service).deleteAllocation(id);

        ResponseEntity<Void> response = controller.deleteAllocation(id);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        Mockito.verify(service).deleteAllocation(id);
    }

    @Test
    public void testServiceCreate() {
        BerthAllocationRepository repository = Mockito.mock(BerthAllocationRepository.class);
        BerthRepository berthRepository = Mockito.mock(BerthRepository.class);
        VesselRepository vesselRepository = Mockito.mock(VesselRepository.class);
        BerthAllocationMapper mapper = Mockito.mock(BerthAllocationMapper.class);
        BerthAllocationServices services = new BerthAllocationServices(repository, berthRepository, vesselRepository, mapper);

        UUID berthId = UUID.randomUUID();
        Berth berth = new Berth();
        berth.setId(berthId);

        UUID vesselId = UUID.randomUUID();
        Vessel vessel = new Vessel();
        vessel.setId(vesselId);

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime later = now.plusHours(2);

        BerthAllocationRequestDTO requestDTO = BerthAllocationRequestDTO.builder()
                .berthId(berthId)
                .vesselId(vesselId)
                .startDate(now)
                .endDate(later)
                .build();

        BerthAllocation entity = new BerthAllocation();
        entity.setStartDate(now);
        entity.setEndDate(later);

        Mockito.when(berthRepository.findById(berthId)).thenReturn(Optional.of(berth));
        Mockito.when(vesselRepository.findById(vesselId)).thenReturn(Optional.of(vessel));
        Mockito.when(mapper.toEntity(requestDTO)).thenReturn(entity);
        Mockito.when(repository.save(entity)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(entity)).thenAnswer(invocation -> {
            BerthAllocation e = invocation.getArgument(0);
            return BerthAllocationResponseDTO.builder()
                    .berthId(e.getBerth() != null ? e.getBerth().getId() : null)
                    .vesselId(e.getVessel() != null ? e.getVessel().getId() : null)
                    .startDate(e.getStartDate())
                    .endDate(e.getEndDate())
                    .build();
        });

        BerthAllocationResponseDTO result = services.createAllocation(requestDTO);

        assertEquals(now, result.getStartDate());
        assertEquals(later, result.getEndDate());
        assertEquals(berthId, result.getBerthId());
        assertEquals(vesselId, result.getVesselId());
        Mockito.verify(repository).save(entity);
    }

    @Test
    public void testServicePatch() {
        BerthAllocationRepository repository = Mockito.mock(BerthAllocationRepository.class);
        BerthRepository berthRepository = Mockito.mock(BerthRepository.class);
        VesselRepository vesselRepository = Mockito.mock(VesselRepository.class);
        BerthAllocationMapper mapper = Mockito.mock(BerthAllocationMapper.class);
        BerthAllocationServices services = new BerthAllocationServices(repository, berthRepository, vesselRepository, mapper);

        UUID allocationId = UUID.randomUUID();
        UUID berthId = UUID.randomUUID();
        Berth berth = new Berth();
        berth.setId(berthId);

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime later = now.plusHours(2);

        BerthAllocation existing = new BerthAllocation();
        existing.setId(allocationId);
        existing.setStartDate(now);
        existing.setEndDate(later);

        BerthAllocationPatchRequestDTO patchDTO = BerthAllocationPatchRequestDTO.builder()
                .berthId(berthId)
                .endDate(later.plusHours(1))
                .build();

        Mockito.when(repository.findById(allocationId)).thenReturn(Optional.of(existing));
        Mockito.when(berthRepository.findById(berthId)).thenReturn(Optional.of(berth));
        Mockito.when(repository.save(existing)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(existing)).thenAnswer(invocation -> {
            BerthAllocation e = invocation.getArgument(0);
            return BerthAllocationResponseDTO.builder()
                    .id(e.getId())
                    .berthId(e.getBerth() != null ? e.getBerth().getId() : null)
                    .vesselId(e.getVessel() != null ? e.getVessel().getId() : null)
                    .startDate(e.getStartDate())
                    .endDate(e.getEndDate())
                    .build();
        });

        BerthAllocationResponseDTO result = services.patchAllocation(allocationId, patchDTO);

        assertEquals(berthId, result.getBerthId());
        assertEquals(now, result.getStartDate()); // unchanged
        assertEquals(later.plusHours(1), result.getEndDate());
        Mockito.verify(repository).save(existing);
    }
}
