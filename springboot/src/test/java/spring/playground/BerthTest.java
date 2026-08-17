package spring.playground;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import spring.playground.modules.shipping.berth.Berth;
import spring.playground.modules.shipping.berth.BerthController;
import spring.playground.modules.shipping.berth.BerthMapper;
import spring.playground.modules.shipping.berth.BerthPatchRequestDTO;
import spring.playground.modules.shipping.berth.BerthRepository;
import spring.playground.modules.shipping.berth.BerthRequestDTO;
import spring.playground.modules.shipping.berth.BerthResponseDTO;
import spring.playground.modules.shipping.berth.BerthServices;

public class BerthTest {

    @Test
    public void testControllerCreate() {
        BerthServices service = Mockito.mock(BerthServices.class);
        BerthController controller = new BerthController(service);

        UUID id = UUID.randomUUID();
        BerthRequestDTO requestDTO = BerthRequestDTO.builder()
                .berthName("Berth A")
                .isActive(true)
                .build();

        BerthResponseDTO responseDTO = BerthResponseDTO.builder()
                .id(id)
                .berthName("Berth A")
                .isActive(true)
                .build();

        Mockito.when(service.createBerth(requestDTO)).thenReturn(responseDTO);

        ResponseEntity<BerthResponseDTO> response = controller.createBerth(requestDTO);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Berth A", response.getBody().getBerthName());
    }

    @Test
    public void testControllerGetById() {
        BerthServices service = Mockito.mock(BerthServices.class);
        BerthController controller = new BerthController(service);

        UUID id = UUID.randomUUID();
        BerthResponseDTO responseDTO = BerthResponseDTO.builder()
                .id(id)
                .berthName("Berth B")
                .isActive(true)
                .build();

        Mockito.when(service.getBerthById(id)).thenReturn(responseDTO);

        ResponseEntity<BerthResponseDTO> response = controller.getBerthById(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Berth B", response.getBody().getBerthName());
    }

    @Test
    public void testControllerUpdate() {
        BerthServices service = Mockito.mock(BerthServices.class);
        BerthController controller = new BerthController(service);

        UUID id = UUID.randomUUID();
        BerthRequestDTO requestDTO = BerthRequestDTO.builder()
                .berthName("Berth B Updated")
                .isActive(true)
                .build();

        BerthResponseDTO responseDTO = BerthResponseDTO.builder()
                .id(id)
                .berthName("Berth B Updated")
                .isActive(true)
                .build();

        Mockito.when(service.updateBerth(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<BerthResponseDTO> response = controller.updateBerth(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Berth B Updated", response.getBody().getBerthName());
    }

    @Test
    public void testControllerPatch() {
        BerthServices service = Mockito.mock(BerthServices.class);
        BerthController controller = new BerthController(service);

        UUID id = UUID.randomUUID();
        BerthPatchRequestDTO requestDTO = BerthPatchRequestDTO.builder()
                .berthName("Berth B Patched")
                .build();

        BerthResponseDTO responseDTO = BerthResponseDTO.builder()
                .id(id)
                .berthName("Berth B Patched")
                .isActive(true)
                .build();

        Mockito.when(service.patchBerth(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<BerthResponseDTO> response = controller.patchBerth(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Berth B Patched", response.getBody().getBerthName());
    }

    @Test
    public void testControllerDelete() {
        BerthServices service = Mockito.mock(BerthServices.class);
        BerthController controller = new BerthController(service);
        UUID id = UUID.randomUUID();

        Mockito.doNothing().when(service).deleteBerth(id);

        ResponseEntity<Void> response = controller.deleteBerth(id);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        Mockito.verify(service).deleteBerth(id);
    }

    @Test
    public void testServiceCreate() {
        BerthRepository repository = Mockito.mock(BerthRepository.class);
        BerthMapper mapper = Mockito.mock(BerthMapper.class);
        BerthServices services = new BerthServices(repository, mapper);

        BerthRequestDTO requestDTO = BerthRequestDTO.builder()
                .berthName("Berth C")
                .isActive(true)
                .build();

        Berth entity = new Berth();
        entity.setBerthName("Berth C");
        entity.setIsActive(true);

        Mockito.when(mapper.toEntity(requestDTO)).thenReturn(entity);
        Mockito.when(repository.save(entity)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(entity)).thenAnswer(invocation -> {
            Berth b = invocation.getArgument(0);
            return BerthResponseDTO.builder()
                    .berthName(b.getBerthName())
                    .isActive(b.getIsActive())
                    .build();
        });

        BerthResponseDTO result = services.createBerth(requestDTO);

        assertEquals("Berth C", result.getBerthName());
        Mockito.verify(repository).save(entity);
    }

    @Test
    public void testServicePatch() {
        BerthRepository repository = Mockito.mock(BerthRepository.class);
        BerthMapper mapper = Mockito.mock(BerthMapper.class);
        BerthServices services = new BerthServices(repository, mapper);

        UUID berthId = UUID.randomUUID();

        Berth existing = new Berth();
        existing.setId(berthId);
        existing.setBerthName("Berth C");
        existing.setIsActive(true);

        BerthPatchRequestDTO patchDTO = BerthPatchRequestDTO.builder()
                .berthName("Berth C Patched")
                .isActive(false)
                .build();

        Mockito.when(repository.findById(berthId)).thenReturn(Optional.of(existing));
        Mockito.when(repository.save(existing)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(existing)).thenAnswer(invocation -> {
            Berth b = invocation.getArgument(0);
            return BerthResponseDTO.builder()
                    .id(b.getId())
                    .berthName(b.getBerthName())
                    .isActive(b.getIsActive())
                    .build();
        });

        BerthResponseDTO result = services.patchBerth(berthId, patchDTO);

        assertEquals("Berth C Patched", result.getBerthName());
        assertEquals(false, result.getIsActive());
        Mockito.verify(repository).save(existing);
    }
}
