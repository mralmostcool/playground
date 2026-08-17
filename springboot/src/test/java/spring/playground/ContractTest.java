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

import spring.playground.modules.seafarer.enrollment.Enrollment;
import spring.playground.modules.seafarer.enrollment.EnrollmentRepository;
import spring.playground.modules.seafarer.indos.IndosMaster;
import spring.playground.modules.seafarer.indos.IndosMasterRepository;
import spring.playground.modules.shipping.company.Company;
import spring.playground.modules.shipping.company.CompanyRepository;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocation;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocationRepository;
import spring.playground.modules.training.contract.Contract;
import spring.playground.modules.training.contract.Contract.ContractStatus;
import spring.playground.modules.training.contract.ContractController;
import spring.playground.modules.training.contract.ContractMapper;
import spring.playground.modules.training.contract.ContractPatchRequestDTO;
import spring.playground.modules.training.contract.ContractRepository;
import spring.playground.modules.training.contract.ContractRequestDTO;
import spring.playground.modules.training.contract.ContractResponseDTO;
import spring.playground.modules.training.contract.ContractServices;

public class ContractTest {

    @Test
    public void testControllerCreate() {
        ContractServices service = Mockito.mock(ContractServices.class);
        ContractController controller = new ContractController(service);

        UUID id = UUID.randomUUID();
        UUID indosId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID enrollmentId = UUID.randomUUID();
        UUID allocationId = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();

        ContractRequestDTO requestDTO = ContractRequestDTO.builder()
                .indosMasterId(indosId)
                .companyId(companyId)
                .enrollmentId(enrollmentId)
                .berthSeafarerAllocationId(allocationId)
                .status(ContractStatus.DRAFT)
                .signOnDate(now)
                .signOnPort("Mumbai")
                .signOnCountry("India")
                .signOffDate(now.plusMonths(6))
                .signOffPort("Singapore")
                .signOffCountry("Singapore")
                .build();

        ContractResponseDTO responseDTO = ContractResponseDTO.builder()
                .id(id)
                .indosMasterId(indosId)
                .companyId(companyId)
                .enrollmentId(enrollmentId)
                .berthSeafarerAllocationId(allocationId)
                .status(ContractStatus.DRAFT)
                .signOnPort("Mumbai")
                .build();

        Mockito.when(service.createContract(requestDTO)).thenReturn(responseDTO);

        ResponseEntity<ContractResponseDTO> response = controller.createContract(requestDTO);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Mumbai", response.getBody().getSignOnPort());
        assertEquals(indosId, response.getBody().getIndosMasterId());
    }

    @Test
    public void testControllerGetById() {
        ContractServices service = Mockito.mock(ContractServices.class);
        ContractController controller = new ContractController(service);

        UUID id = UUID.randomUUID();
        ContractResponseDTO responseDTO = ContractResponseDTO.builder()
                .id(id)
                .status(ContractStatus.ACTIVE)
                .remarks("Active Contract")
                .build();

        Mockito.when(service.getContractById(id)).thenReturn(responseDTO);

        ResponseEntity<ContractResponseDTO> response = controller.getContractById(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(ContractStatus.ACTIVE, response.getBody().getStatus());
    }

    @Test
    public void testControllerUpdate() {
        ContractServices service = Mockito.mock(ContractServices.class);
        ContractController controller = new ContractController(service);

        UUID id = UUID.randomUUID();
        UUID indosId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID enrollmentId = UUID.randomUUID();
        UUID allocationId = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();

        ContractRequestDTO requestDTO = ContractRequestDTO.builder()
                .indosMasterId(indosId)
                .companyId(companyId)
                .enrollmentId(enrollmentId)
                .berthSeafarerAllocationId(allocationId)
                .status(ContractStatus.ACTIVE)
                .signOnDate(now)
                .signOnPort("Mumbai")
                .signOnCountry("India")
                .signOffDate(now.plusMonths(6))
                .signOffPort("Singapore")
                .signOffCountry("Singapore")
                .build();

        ContractResponseDTO responseDTO = ContractResponseDTO.builder()
                .id(id)
                .indosMasterId(indosId)
                .status(ContractStatus.ACTIVE)
                .build();

        Mockito.when(service.updateContract(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<ContractResponseDTO> response = controller.updateContract(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(ContractStatus.ACTIVE, response.getBody().getStatus());
    }

    @Test
    public void testControllerPatch() {
        ContractServices service = Mockito.mock(ContractServices.class);
        ContractController controller = new ContractController(service);

        UUID id = UUID.randomUUID();
        ContractPatchRequestDTO requestDTO = ContractPatchRequestDTO.builder()
                .remarks("Patched Remarks")
                .build();

        ContractResponseDTO responseDTO = ContractResponseDTO.builder()
                .id(id)
                .remarks("Patched Remarks")
                .build();

        Mockito.when(service.patchContract(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<ContractResponseDTO> response = controller.patchContract(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Patched Remarks", response.getBody().getRemarks());
    }

    @Test
    public void testControllerDelete() {
        ContractServices service = Mockito.mock(ContractServices.class);
        ContractController controller = new ContractController(service);
        UUID id = UUID.randomUUID();

        Mockito.doNothing().when(service).deleteContract(id);

        ResponseEntity<Void> response = controller.deleteContract(id);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        Mockito.verify(service).deleteContract(id);
    }

    @Test
    public void testServiceCreate() {
        ContractRepository repository = Mockito.mock(ContractRepository.class);
        IndosMasterRepository indosRepository = Mockito.mock(IndosMasterRepository.class);
        CompanyRepository companyRepository = Mockito.mock(CompanyRepository.class);
        EnrollmentRepository enrollmentRepository = Mockito.mock(EnrollmentRepository.class);
        BerthSeafarerAllocationRepository berthSeafarerAllocationRepository = Mockito.mock(BerthSeafarerAllocationRepository.class);
        ContractMapper mapper = Mockito.mock(ContractMapper.class);
        ContractServices services = new ContractServices(repository, indosRepository, companyRepository, enrollmentRepository, berthSeafarerAllocationRepository, mapper);

        UUID indosId = UUID.randomUUID();
        IndosMaster indos = new IndosMaster();
        indos.setId(indosId);

        UUID companyId = UUID.randomUUID();
        Company company = new Company();
        company.setId(companyId);

        UUID enrollmentId = UUID.randomUUID();
        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);

        UUID allocationId = UUID.randomUUID();
        BerthSeafarerAllocation allocation = new BerthSeafarerAllocation();
        allocation.setId(allocationId);

        OffsetDateTime now = OffsetDateTime.now();

        ContractRequestDTO requestDTO = ContractRequestDTO.builder()
                .indosMasterId(indosId)
                .companyId(companyId)
                .enrollmentId(enrollmentId)
                .berthSeafarerAllocationId(allocationId)
                .status(ContractStatus.DRAFT)
                .signOnDate(now)
                .signOnPort("Mumbai")
                .signOnCountry("India")
                .signOffDate(now.plusMonths(6))
                .signOffPort("Singapore")
                .signOffCountry("Singapore")
                .build();

        Contract entity = new Contract();
        entity.setStatus(ContractStatus.DRAFT);
        entity.setSignOnPort("Mumbai");

        Mockito.when(indosRepository.findById(indosId)).thenReturn(Optional.of(indos));
        Mockito.when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
        Mockito.when(enrollmentRepository.findById(enrollmentId)).thenReturn(Optional.of(enrollment));
        Mockito.when(berthSeafarerAllocationRepository.findById(allocationId)).thenReturn(Optional.of(allocation));
        Mockito.when(mapper.toEntity(requestDTO)).thenReturn(entity);
        Mockito.when(repository.save(entity)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(entity)).thenAnswer(invocation -> {
            Contract c = invocation.getArgument(0);
            return ContractResponseDTO.builder()
                    .indosMasterId(c.getIndosMaster() != null ? c.getIndosMaster().getId() : null)
                    .companyId(c.getCompany() != null ? c.getCompany().getId() : null)
                    .enrollmentId(c.getEnrollment() != null ? c.getEnrollment().getId() : null)
                    .berthSeafarerAllocationId(c.getBerthSeafarerAllocation() != null ? c.getBerthSeafarerAllocation().getId() : null)
                    .status(c.getStatus())
                    .signOnPort(c.getSignOnPort())
                    .build();
        });

        ContractResponseDTO result = services.createContract(requestDTO);

        assertEquals("Mumbai", result.getSignOnPort());
        assertEquals(indosId, result.getIndosMasterId());
        assertEquals(companyId, result.getCompanyId());
        Mockito.verify(repository).save(entity);
    }

    @Test
    public void testServicePatch() {
        ContractRepository repository = Mockito.mock(ContractRepository.class);
        IndosMasterRepository indosRepository = Mockito.mock(IndosMasterRepository.class);
        CompanyRepository companyRepository = Mockito.mock(CompanyRepository.class);
        EnrollmentRepository enrollmentRepository = Mockito.mock(EnrollmentRepository.class);
        BerthSeafarerAllocationRepository berthSeafarerAllocationRepository = Mockito.mock(BerthSeafarerAllocationRepository.class);
        ContractMapper mapper = Mockito.mock(ContractMapper.class);
        ContractServices services = new ContractServices(repository, indosRepository, companyRepository, enrollmentRepository, berthSeafarerAllocationRepository, mapper);

        UUID contractId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        Company company = new Company();
        company.setId(companyId);

        Contract existing = new Contract();
        existing.setId(contractId);
        existing.setStatus(ContractStatus.DRAFT);
        existing.setSignOnPort("Mumbai");

        ContractPatchRequestDTO patchDTO = ContractPatchRequestDTO.builder()
                .companyId(companyId)
                .status(ContractStatus.ACTIVE)
                .build();

        Mockito.when(repository.findById(contractId)).thenReturn(Optional.of(existing));
        Mockito.when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
        Mockito.when(repository.save(existing)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(existing)).thenAnswer(invocation -> {
            Contract c = invocation.getArgument(0);
            return ContractResponseDTO.builder()
                    .id(c.getId())
                    .companyId(c.getCompany() != null ? c.getCompany().getId() : null)
                    .status(c.getStatus())
                    .signOnPort(c.getSignOnPort())
                    .build();
        });

        ContractResponseDTO result = services.patchContract(contractId, patchDTO);

        assertEquals(companyId, result.getCompanyId());
        assertEquals(ContractStatus.ACTIVE, result.getStatus());
        assertEquals("Mumbai", result.getSignOnPort()); // unchanged
        Mockito.verify(repository).save(existing);
    }
}
