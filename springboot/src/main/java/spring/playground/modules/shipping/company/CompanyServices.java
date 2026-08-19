package spring.playground.modules.shipping.company;

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

@Service
@RequiredArgsConstructor
public class CompanyServices {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    @Transactional
    @CacheEvict(value = "companies_all", allEntries = true)
    public CompanyResponseDTO createCompany(CompanyRequestDTO requestDTO) {
        Company entity = companyMapper.toEntity(requestDTO);
        Company saved = companyRepository.save(entity);
        return companyMapper.toResponseDTO(saved);
    }

    @Cacheable(value = "companies_all")
    public List<CompanyResponseDTO> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(companyMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "companies", key = "#id")
    public CompanyResponseDTO getCompanyById(UUID id) {
        Company entity = companyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Company not found with id: " + id));
        return companyMapper.toResponseDTO(entity);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "companies", key = "#id"),
        @CacheEvict(value = "companies_all", allEntries = true)
    })
    public CompanyResponseDTO updateCompany(UUID id, CompanyRequestDTO requestDTO) {
        Company existing = companyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Company not found with id: " + id));

        existing.setName(requestDTO.getName());
        existing.setRegistrationNo(requestDTO.getRegistrationNo());
        existing.setIsActive(requestDTO.getIsActive());

        Company saved = companyRepository.save(existing);
        return companyMapper.toResponseDTO(saved);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "companies", key = "#id"),
        @CacheEvict(value = "companies_all", allEntries = true)
    })
    public CompanyResponseDTO patchCompany(UUID id, CompanyPatchRequestDTO patchDTO) {
        Company existing = companyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Company not found with id: " + id));

        if (patchDTO.getName() != null) {
            existing.setName(patchDTO.getName());
        }
        if (patchDTO.getRegistrationNo() != null) {
            existing.setRegistrationNo(patchDTO.getRegistrationNo());
        }
        if (patchDTO.getIsActive() != null) {
            existing.setIsActive(patchDTO.getIsActive());
        }

        Company saved = companyRepository.save(existing);
        return companyMapper.toResponseDTO(saved);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "companies", key = "#id"),
        @CacheEvict(value = "companies_all", allEntries = true)
    })
    public void deleteCompany(UUID id) {
        if (!companyRepository.existsById(id)) {
            throw new NotFoundException("Company not found with id: " + id);
        }
        companyRepository.deleteById(id);
    }
}
