package spring.playground;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import spring.playground.modules.shipping.vessel.Vessel;
import spring.playground.modules.shipping.vessel.VesselController;
import spring.playground.modules.shipping.vessel.VesselMapper;
import spring.playground.modules.shipping.vessel.VesselPatchRequestDTO;
import spring.playground.modules.shipping.vessel.VesselRepository;
import spring.playground.modules.shipping.vessel.VesselRequestDTO;
import spring.playground.modules.shipping.vessel.VesselResponseDTO;
import spring.playground.modules.shipping.vessel.VesselServices;

public class VesselTest {

    @Test
    public void testControllerCreate() {
        VesselServices service = Mockito.mock(VesselServices.class);
        VesselController controller = new VesselController(service);

        UUID id = UUID.randomUUID();
        VesselRequestDTO requestDTO = VesselRequestDTO.builder()
                .imo("9876543")
                .name("Titanic II")
                .flag("Panama")
                .isActive(true)
                .build();

        VesselResponseDTO responseDTO = VesselResponseDTO.builder()
                .id(id)
                .imo("9876543")
                .name("Titanic II")
                .flag("Panama")
                .isActive(true)
                .build();

        Mockito.when(service.createVessel(requestDTO)).thenReturn(responseDTO);

        ResponseEntity<VesselResponseDTO> response = controller.createVessel(requestDTO);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Titanic II", response.getBody().getName());
        assertEquals("9876543", response.getBody().getImo());
    }

    @Test
    public void testControllerGetById() {
        VesselServices service = Mockito.mock(VesselServices.class);
        VesselController controller = new VesselController(service);

        UUID id = UUID.randomUUID();
        VesselResponseDTO responseDTO = VesselResponseDTO.builder()
                .id(id)
                .imo("1234567")
                .name("Enterprise")
                .flag("USA")
                .isActive(true)
                .build();

        Mockito.when(service.getVesselById(id)).thenReturn(responseDTO);

        ResponseEntity<VesselResponseDTO> response = controller.getVesselById(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Enterprise", response.getBody().getName());
    }

    @Test
    public void testControllerUpdate() {
        VesselServices service = Mockito.mock(VesselServices.class);
        VesselController controller = new VesselController(service);

        UUID id = UUID.randomUUID();
        VesselRequestDTO requestDTO = VesselRequestDTO.builder()
                .imo("1234567")
                .name("Enterprise Updated")
                .flag("USA")
                .isActive(true)
                .build();

        VesselResponseDTO responseDTO = VesselResponseDTO.builder()
                .id(id)
                .imo("1234567")
                .name("Enterprise Updated")
                .flag("USA")
                .isActive(true)
                .build();

        Mockito.when(service.updateVessel(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<VesselResponseDTO> response = controller.updateVessel(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Enterprise Updated", response.getBody().getName());
    }

    @Test
    public void testControllerPatch() {
        VesselServices service = Mockito.mock(VesselServices.class);
        VesselController controller = new VesselController(service);

        UUID id = UUID.randomUUID();
        VesselPatchRequestDTO requestDTO = VesselPatchRequestDTO.builder()
                .name("Enterprise Patched")
                .build();

        VesselResponseDTO responseDTO = VesselResponseDTO.builder()
                .id(id)
                .imo("1234567")
                .name("Enterprise Patched")
                .flag("USA")
                .isActive(true)
                .build();

        Mockito.when(service.patchVessel(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<VesselResponseDTO> response = controller.patchVessel(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Enterprise Patched", response.getBody().getName());
    }

    @Test
    public void testControllerDelete() {
        VesselServices service = Mockito.mock(VesselServices.class);
        VesselController controller = new VesselController(service);
        UUID id = UUID.randomUUID();

        Mockito.doNothing().when(service).deleteVessel(id);

        ResponseEntity<Void> response = controller.deleteVessel(id);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        Mockito.verify(service).deleteVessel(id);
    }

    @Test
    public void testServiceCreate() {
        VesselRepository repository = Mockito.mock(VesselRepository.class);
        VesselMapper mapper = Mockito.mock(VesselMapper.class);
        VesselServices services = new VesselServices(repository, mapper);

        VesselRequestDTO requestDTO = VesselRequestDTO.builder()
                .imo("9111111")
                .name("Oceanic")
                .flag("UK")
                .isActive(true)
                .build();

        Vessel entity = new Vessel();
        entity.setImo("9111111");
        entity.setName("Oceanic");
        entity.setFlag("UK");
        entity.setIsActive(true);

        Mockito.when(mapper.toEntity(requestDTO)).thenReturn(entity);
        Mockito.when(repository.save(entity)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(entity)).thenAnswer(invocation -> {
            Vessel v = invocation.getArgument(0);
            return VesselResponseDTO.builder()
                    .imo(v.getImo())
                    .name(v.getName())
                    .flag(v.getFlag())
                    .isActive(v.getIsActive())
                    .build();
        });

        VesselResponseDTO result = services.createVessel(requestDTO);

        assertEquals("Oceanic", result.getName());
        assertEquals("9111111", result.getImo());
        Mockito.verify(repository).save(entity);
    }

    @Test
    public void testServicePatch() {
        VesselRepository repository = Mockito.mock(VesselRepository.class);
        VesselMapper mapper = Mockito.mock(VesselMapper.class);
        VesselServices services = new VesselServices(repository, mapper);

        UUID courseId = UUID.randomUUID();

        Vessel existing = new Vessel();
        existing.setId(courseId);
        existing.setImo("9111111");
        existing.setName("Oceanic");
        existing.setFlag("UK");
        existing.setIsActive(true);

        VesselPatchRequestDTO patchDTO = VesselPatchRequestDTO.builder()
                .name("Oceanic II")
                .flag("Liberia")
                .build();

        Mockito.when(repository.findById(courseId)).thenReturn(Optional.of(existing));
        Mockito.when(repository.save(existing)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(existing)).thenAnswer(invocation -> {
            Vessel v = invocation.getArgument(0);
            return VesselResponseDTO.builder()
                    .id(v.getId())
                    .imo(v.getImo())
                    .name(v.getName())
                    .flag(v.getFlag())
                    .isActive(v.getIsActive())
                    .build();
        });

        VesselResponseDTO result = services.patchVessel(courseId, patchDTO);

        assertEquals("Oceanic II", result.getName());
        assertEquals("Liberia", result.getFlag());
        assertEquals(true, result.getIsActive()); // unchanged
        Mockito.verify(repository).save(existing);
    }
}
