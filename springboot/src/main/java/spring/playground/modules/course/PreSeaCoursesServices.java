package spring.playground.modules.course;

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
import spring.playground.modules.referenceData.institute.Institute;
import spring.playground.modules.referenceData.institute.InstituteRepository;

@Service
@RequiredArgsConstructor
public class PreSeaCoursesServices {

    private final PreSeaCoursesRepository preSeaCoursesRepository;
    private final InstituteRepository instituteRepository;
    private final PreSeaCoursesMapper preSeaCoursesMapper;

    @Transactional
    @CacheEvict(value = "courses_all", allEntries = true)
    public PreSeaCoursesResponseDTO createCourse(PreSeaCoursesRequestDTO requestDTO) {
        Institute institute = null;
        if (requestDTO.getInstituteId() != null) {
            institute = instituteRepository.findById(requestDTO.getInstituteId())
                    .orElseThrow(() -> new NotFoundException("Institute not found with id: " + requestDTO.getInstituteId()));
        }

        PreSeaCourses entity = preSeaCoursesMapper.toEntity(requestDTO);
        entity.setInstitute(institute);
        PreSeaCourses saved = preSeaCoursesRepository.save(entity);
        return preSeaCoursesMapper.toResponseDTO(saved);
    }

    @Cacheable(value = "courses_all")
    public List<PreSeaCoursesResponseDTO> getAllCourses() {
        return preSeaCoursesRepository.findAll().stream()
                .map(preSeaCoursesMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "courses", key = "#id")
    public PreSeaCoursesResponseDTO getCourseById(UUID id) {
        PreSeaCourses entity = preSeaCoursesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Course not found with id: " + id));
        return preSeaCoursesMapper.toResponseDTO(entity);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "courses", key = "#id"),
        @CacheEvict(value = "courses_all", allEntries = true)
    })
    public PreSeaCoursesResponseDTO updateCourse(UUID id, PreSeaCoursesRequestDTO requestDTO) {
        PreSeaCourses existing = preSeaCoursesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Course not found with id: " + id));

        Institute institute = null;
        if (requestDTO.getInstituteId() != null) {
            institute = instituteRepository.findById(requestDTO.getInstituteId())
                    .orElseThrow(() -> new NotFoundException("Institute not found with id: " + requestDTO.getInstituteId()));
        }

        existing.setName(requestDTO.getName());
        existing.setIsActive(requestDTO.getIsActive());
        existing.setStartDate(requestDTO.getStartDate());
        existing.setInstitute(institute);

        PreSeaCourses saved = preSeaCoursesRepository.save(existing);
        return preSeaCoursesMapper.toResponseDTO(saved);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "courses", key = "#id"),
        @CacheEvict(value = "courses_all", allEntries = true)
    })
    public PreSeaCoursesResponseDTO patchCourse(UUID id, PreSeaCoursesPatchRequestDTO patchDTO) {
        PreSeaCourses existing = preSeaCoursesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Course not found with id: " + id));

        if (patchDTO.getName() != null) {
            existing.setName(patchDTO.getName());
        }
        if (patchDTO.getIsActive() != null) {
            existing.setIsActive(patchDTO.getIsActive());
        }
        if (patchDTO.getStartDate() != null) {
            existing.setStartDate(patchDTO.getStartDate());
        }
        if (patchDTO.getInstituteId() != null) {
            Institute institute = instituteRepository.findById(patchDTO.getInstituteId())
                    .orElseThrow(() -> new NotFoundException("Institute not found with id: " + patchDTO.getInstituteId()));
            existing.setInstitute(institute);
        }

        PreSeaCourses saved = preSeaCoursesRepository.save(existing);
        return preSeaCoursesMapper.toResponseDTO(saved);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "courses", key = "#id"),
        @CacheEvict(value = "courses_all", allEntries = true)
    })
    public void deleteCourse(UUID id) {
        if (!preSeaCoursesRepository.existsById(id)) {
            throw new NotFoundException("Course not found with id: " + id);
        }
        preSeaCoursesRepository.deleteById(id);
    }
}
