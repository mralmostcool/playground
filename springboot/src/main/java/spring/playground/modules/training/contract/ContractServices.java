package spring.playground.modules.training.contract;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import spring.playground._config.exception.resource.NotFoundException;
import spring.playground.modules.seafarer.enrollment.Enrollment;
import spring.playground.modules.seafarer.enrollment.EnrollmentRepository;
import spring.playground.modules.seafarer.indos.IndosMaster;
import spring.playground.modules.seafarer.indos.IndosMasterRepository;
import spring.playground.modules.shipping.company.Company;
import spring.playground.modules.shipping.company.CompanyRepository;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocation;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocationRepository;

@Service
@RequiredArgsConstructor
public class ContractServices {

    private final ContractRepository contractRepository;
    private final IndosMasterRepository indosMasterRepository;
    private final CompanyRepository companyRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final BerthSeafarerAllocationRepository berthSeafarerAllocationRepository;
    private final ContractMapper mapper;

    @Transactional
    @CacheEvict(value = "contracts_all", allEntries = true)
    public ContractResponseDTO createContract(ContractRequestDTO requestDTO) {
        IndosMaster indosMaster = indosMasterRepository.findById(requestDTO.getIndosMasterId())
                .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + requestDTO.getIndosMasterId()));
        Company company = companyRepository.findById(requestDTO.getCompanyId())
                .orElseThrow(() -> new NotFoundException("Company not found with id: " + requestDTO.getCompanyId()));
        Enrollment enrollment = enrollmentRepository.findById(requestDTO.getEnrollmentId())
                .orElseThrow(() -> new NotFoundException("Enrollment not found with id: " + requestDTO.getEnrollmentId()));
        BerthSeafarerAllocation berthSeafarerAllocation = berthSeafarerAllocationRepository.findById(requestDTO.getBerthSeafarerAllocationId())
                .orElseThrow(() -> new NotFoundException("Berth seafarer allocation not found with id: " + requestDTO.getBerthSeafarerAllocationId()));

        Contract entity = mapper.toEntity(requestDTO);
        entity.setIndosMaster(indosMaster);
        entity.setCompany(company);
        entity.setEnrollment(enrollment);
        entity.setBerthSeafarerAllocation(berthSeafarerAllocation);

        Contract saved = contractRepository.save(entity);
        return mapper.toResponseDTO(saved);
    }

    @Cacheable(value = "contracts_all")
    public List<ContractResponseDTO> getAllContracts() {
        return contractRepository.findAll().stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "contracts", key = "#id")
    public ContractResponseDTO getContractById(UUID id) {
        Contract entity = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Contract not found with id: " + id));
        return mapper.toResponseDTO(entity);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "contracts", key = "#id"),
        @CacheEvict(value = "contracts_all", allEntries = true)
    })
    public ContractResponseDTO updateContract(UUID id, ContractRequestDTO requestDTO) {
        Contract existing = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Contract not found with id: " + id));

        IndosMaster indosMaster = indosMasterRepository.findById(requestDTO.getIndosMasterId())
                .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + requestDTO.getIndosMasterId()));
        Company company = companyRepository.findById(requestDTO.getCompanyId())
                .orElseThrow(() -> new NotFoundException("Company not found with id: " + requestDTO.getCompanyId()));
        Enrollment enrollment = enrollmentRepository.findById(requestDTO.getEnrollmentId())
                .orElseThrow(() -> new NotFoundException("Enrollment not found with id: " + requestDTO.getEnrollmentId()));
        BerthSeafarerAllocation berthSeafarerAllocation = berthSeafarerAllocationRepository.findById(requestDTO.getBerthSeafarerAllocationId())
                .orElseThrow(() -> new NotFoundException("Berth seafarer allocation not found with id: " + requestDTO.getBerthSeafarerAllocationId()));

        existing.setIndosMaster(indosMaster);
        existing.setCompany(company);
        existing.setEnrollment(enrollment);
        existing.setBerthSeafarerAllocation(berthSeafarerAllocation);
        existing.setStatus(requestDTO.getStatus());
        existing.setSignOnDate(requestDTO.getSignOnDate());
        existing.setSignOnPort(requestDTO.getSignOnPort());
        existing.setSignOnCountry(requestDTO.getSignOnCountry());
        existing.setSignOffDate(requestDTO.getSignOffDate());
        existing.setSignOffPort(requestDTO.getSignOffPort());
        existing.setSignOffCountry(requestDTO.getSignOffCountry());
        existing.setActualSignOnDate(requestDTO.getActualSignOnDate());
        existing.setActualSignOnPort(requestDTO.getActualSignOnPort());
        existing.setActualSignOnCountry(requestDTO.getActualSignOnCountry());
        existing.setActualSignOffDate(requestDTO.getActualSignOffDate());
        existing.setActualSignOffPort(requestDTO.getActualSignOffPort());
        existing.setActualSignOffCountry(requestDTO.getActualSignOffCountry());
        existing.setRemarks(requestDTO.getRemarks());

        Contract saved = contractRepository.save(existing);
        return mapper.toResponseDTO(saved);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "contracts", key = "#id"),
        @CacheEvict(value = "contracts_all", allEntries = true)
    })
    public ContractResponseDTO patchContract(UUID id, ContractPatchRequestDTO patchDTO) {
        Contract existing = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Contract not found with id: " + id));

        if (patchDTO.getIndosMasterId() != null) {
            IndosMaster indosMaster = indosMasterRepository.findById(patchDTO.getIndosMasterId())
                    .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + patchDTO.getIndosMasterId()));
            existing.setIndosMaster(indosMaster);
        }
        if (patchDTO.getCompanyId() != null) {
            Company company = companyRepository.findById(patchDTO.getCompanyId())
                    .orElseThrow(() -> new NotFoundException("Company not found with id: " + patchDTO.getCompanyId()));
            existing.setCompany(company);
        }
        if (patchDTO.getEnrollmentId() != null) {
            Enrollment enrollment = enrollmentRepository.findById(patchDTO.getEnrollmentId())
                    .orElseThrow(() -> new NotFoundException("Enrollment not found with id: " + patchDTO.getEnrollmentId()));
            existing.setEnrollment(enrollment);
        }
        if (patchDTO.getBerthSeafarerAllocationId() != null) {
            BerthSeafarerAllocation berthSeafarerAllocation = berthSeafarerAllocationRepository.findById(patchDTO.getBerthSeafarerAllocationId())
                    .orElseThrow(() -> new NotFoundException("Berth seafarer allocation not found with id: " + patchDTO.getBerthSeafarerAllocationId()));
            existing.setBerthSeafarerAllocation(berthSeafarerAllocation);
        }
        if (patchDTO.getStatus() != null) {
            existing.setStatus(patchDTO.getStatus());
        }
        if (patchDTO.getSignOnDate() != null) {
            existing.setSignOnDate(patchDTO.getSignOnDate());
        }
        if (patchDTO.getSignOnPort() != null) {
            existing.setSignOnPort(patchDTO.getSignOnPort());
        }
        if (patchDTO.getSignOnCountry() != null) {
            existing.setSignOnCountry(patchDTO.getSignOnCountry());
        }
        if (patchDTO.getSignOffDate() != null) {
            existing.setSignOffDate(patchDTO.getSignOffDate());
        }
        if (patchDTO.getSignOffPort() != null) {
            existing.setSignOffPort(patchDTO.getSignOffPort());
        }
        if (patchDTO.getSignOffCountry() != null) {
            existing.setSignOffCountry(patchDTO.getSignOffCountry());
        }
        if (patchDTO.getActualSignOnDate() != null) {
            existing.setActualSignOnDate(patchDTO.getActualSignOnDate());
        }
        if (patchDTO.getActualSignOnPort() != null) {
            existing.setActualSignOnPort(patchDTO.getActualSignOnPort());
        }
        if (patchDTO.getActualSignOnCountry() != null) {
            existing.setActualSignOnCountry(patchDTO.getActualSignOnCountry());
        }
        if (patchDTO.getActualSignOffDate() != null) {
            existing.setActualSignOffDate(patchDTO.getActualSignOffDate());
        }
        if (patchDTO.getActualSignOffPort() != null) {
            existing.setActualSignOffPort(patchDTO.getActualSignOffPort());
        }
        if (patchDTO.getActualSignOffCountry() != null) {
            existing.setActualSignOffCountry(patchDTO.getActualSignOffCountry());
        }
        if (patchDTO.getRemarks() != null) {
            existing.setRemarks(patchDTO.getRemarks());
        }

        Contract saved = contractRepository.save(existing);
        return mapper.toResponseDTO(saved);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "contracts", key = "#id"),
        @CacheEvict(value = "contracts_all", allEntries = true)
    })
    public void deleteContract(UUID id) {
        if (!contractRepository.existsById(id)) {
            throw new NotFoundException("Contract not found with id: " + id);
        }
        contractRepository.deleteById(id);
    }
}
