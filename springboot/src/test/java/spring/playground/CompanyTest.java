package spring.playground;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import spring.playground.modules.shipping.company.Company;
import spring.playground.modules.shipping.company.CompanyController;
import spring.playground.modules.shipping.company.CompanyMapper;
import spring.playground.modules.shipping.company.CompanyPatchRequestDTO;
import spring.playground.modules.shipping.company.CompanyRepository;
import spring.playground.modules.shipping.company.CompanyRequestDTO;
import spring.playground.modules.shipping.company.CompanyResponseDTO;
import spring.playground.modules.shipping.company.CompanyServices;

public class CompanyTest {

    @Test
    public void testControllerCreate() {
        CompanyServices service = Mockito.mock(CompanyServices.class);
        CompanyController controller = new CompanyController(service);

        UUID id = UUID.randomUUID();
        CompanyRequestDTO requestDTO = CompanyRequestDTO.builder()
                .name("Ocean Shipping Corp")
                .registrationNo("REG-123456")
                .isActive(true)
                .build();

        CompanyResponseDTO responseDTO = CompanyResponseDTO.builder()
                .id(id)
                .name("Ocean Shipping Corp")
                .registrationNo("REG-123456")
                .isActive(true)
                .build();

        Mockito.when(service.createCompany(requestDTO)).thenReturn(responseDTO);

        ResponseEntity<CompanyResponseDTO> response = controller.createCompany(requestDTO);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Ocean Shipping Corp", response.getBody().getName());
        assertEquals("REG-123456", response.getBody().getRegistrationNo());
    }

    @Test
    public void testControllerGetById() {
        CompanyServices service = Mockito.mock(CompanyServices.class);
        CompanyController controller = new CompanyController(service);

        UUID id = UUID.randomUUID();
        CompanyResponseDTO responseDTO = CompanyResponseDTO.builder()
                .id(id)
                .name("Pacific Carriers")
                .registrationNo("REG-999999")
                .isActive(true)
                .build();

        Mockito.when(service.getCompanyById(id)).thenReturn(responseDTO);

        ResponseEntity<CompanyResponseDTO> response = controller.getCompanyById(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Pacific Carriers", response.getBody().getName());
    }

    @Test
    public void testControllerUpdate() {
        CompanyServices service = Mockito.mock(CompanyServices.class);
        CompanyController controller = new CompanyController(service);

        UUID id = UUID.randomUUID();
        CompanyRequestDTO requestDTO = CompanyRequestDTO.builder()
                .name("Pacific Carriers Updated")
                .registrationNo("REG-999999")
                .isActive(true)
                .build();

        CompanyResponseDTO responseDTO = CompanyResponseDTO.builder()
                .id(id)
                .name("Pacific Carriers Updated")
                .registrationNo("REG-999999")
                .isActive(true)
                .build();

        Mockito.when(service.updateCompany(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<CompanyResponseDTO> response = controller.updateCompany(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Pacific Carriers Updated", response.getBody().getName());
    }

    @Test
    public void testControllerPatch() {
        CompanyServices service = Mockito.mock(CompanyServices.class);
        CompanyController controller = new CompanyController(service);

        UUID id = UUID.randomUUID();
        CompanyPatchRequestDTO requestDTO = CompanyPatchRequestDTO.builder()
                .name("Pacific Carriers Patched")
                .build();

        CompanyResponseDTO responseDTO = CompanyResponseDTO.builder()
                .id(id)
                .name("Pacific Carriers Patched")
                .registrationNo("REG-999999")
                .isActive(true)
                .build();

        Mockito.when(service.patchCompany(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<CompanyResponseDTO> response = controller.patchCompany(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Pacific Carriers Patched", response.getBody().getName());
    }

    @Test
    public void testControllerDelete() {
        CompanyServices service = Mockito.mock(CompanyServices.class);
        CompanyController controller = new CompanyController(service);
        UUID id = UUID.randomUUID();

        Mockito.doNothing().when(service).deleteCompany(id);

        ResponseEntity<Void> response = controller.deleteCompany(id);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        Mockito.verify(service).deleteCompany(id);
    }

    @Test
    public void testServiceCreate() {
        CompanyRepository repository = Mockito.mock(CompanyRepository.class);
        CompanyMapper mapper = Mockito.mock(CompanyMapper.class);
        CompanyServices services = new CompanyServices(repository, mapper);

        CompanyRequestDTO requestDTO = CompanyRequestDTO.builder()
                .name("Atlantic Marine")
                .registrationNo("REG-444444")
                .isActive(true)
                .build();

        Company entity = new Company();
        entity.setName("Atlantic Marine");
        entity.setRegistrationNo("REG-444444");
        entity.setIsActive(true);

        Mockito.when(mapper.toEntity(requestDTO)).thenReturn(entity);
        Mockito.when(repository.save(entity)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(entity)).thenAnswer(invocation -> {
            Company c = invocation.getArgument(0);
            return CompanyResponseDTO.builder()
                    .name(c.getName())
                    .registrationNo(c.getRegistrationNo())
                    .isActive(c.getIsActive())
                    .build();
        });

        CompanyResponseDTO result = services.createCompany(requestDTO);

        assertEquals("Atlantic Marine", result.getName());
        assertEquals("REG-444444", result.getRegistrationNo());
        Mockito.verify(repository).save(entity);
    }

    @Test
    public void testServicePatch() {
        CompanyRepository repository = Mockito.mock(CompanyRepository.class);
        CompanyMapper mapper = Mockito.mock(CompanyMapper.class);
        CompanyServices services = new CompanyServices(repository, mapper);

        UUID companyId = UUID.randomUUID();

        Company existing = new Company();
        existing.setId(companyId);
        existing.setName("Atlantic Marine");
        existing.setRegistrationNo("REG-444444");
        existing.setIsActive(true);

        CompanyPatchRequestDTO patchDTO = CompanyPatchRequestDTO.builder()
                .name("Atlantic Marine II")
                .registrationNo("REG-555555")
                .build();

        Mockito.when(repository.findById(companyId)).thenReturn(Optional.of(existing));
        Mockito.when(repository.save(existing)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(existing)).thenAnswer(invocation -> {
            Company c = invocation.getArgument(0);
            return CompanyResponseDTO.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .registrationNo(c.getRegistrationNo())
                    .isActive(c.getIsActive())
                    .build();
        });

        CompanyResponseDTO result = services.patchCompany(companyId, patchDTO);

        assertEquals("Atlantic Marine II", result.getName());
        assertEquals("REG-555555", result.getRegistrationNo());
        assertEquals(true, result.getIsActive()); // unchanged
        Mockito.verify(repository).save(existing);
    }
}
