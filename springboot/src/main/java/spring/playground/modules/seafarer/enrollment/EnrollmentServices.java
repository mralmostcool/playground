package spring.playground.modules.seafarer.enrollment;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import spring.playground._config.exception.resource.NotFoundException;
import spring.playground.modules.course.PreSeaCourses;
import spring.playground.modules.course.PreSeaCoursesRepository;
import spring.playground.modules.seafarer.indos.IndosMaster;
import spring.playground.modules.seafarer.indos.IndosMasterRepository;

@Service
@RequiredArgsConstructor
public class EnrollmentServices {

    private final EnrollmentRepository enrollmentRepository;
    private final PreSeaCoursesRepository preSeaCoursesRepository;
    private final IndosMasterRepository indosMasterRepository;
    private final EnrollmentMapper enrollmentMapper;

    @Transactional
    public EnrollmentResponseDTO createEnrollment(EnrollmentRequestDTO requestDTO) {
        PreSeaCourses preSeaCourse = preSeaCoursesRepository.findById(requestDTO.getPreSeaCourseId())
                .orElseThrow(() -> new NotFoundException("Pre-sea course not found with id: " + requestDTO.getPreSeaCourseId()));
        IndosMaster indosMaster = indosMasterRepository.findById(requestDTO.getIndosMasterId())
                .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + requestDTO.getIndosMasterId()));

        Enrollment entity = enrollmentMapper.toEntity(requestDTO);
        entity.setPreSeaCourse(preSeaCourse);
        entity.setIndosMaster(indosMaster);
        Enrollment saved = enrollmentRepository.save(entity);
        return enrollmentMapper.toResponseDTO(saved);
    }

    public List<EnrollmentResponseDTO> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(enrollmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public EnrollmentResponseDTO getEnrollmentById(UUID id) {
        Enrollment entity = enrollmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Enrollment not found with id: " + id));
        return enrollmentMapper.toResponseDTO(entity);
    }

    @Transactional
    public EnrollmentResponseDTO updateEnrollment(UUID id, EnrollmentRequestDTO requestDTO) {
        Enrollment existing = enrollmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Enrollment not found with id: " + id));

        PreSeaCourses preSeaCourse = preSeaCoursesRepository.findById(requestDTO.getPreSeaCourseId())
                .orElseThrow(() -> new NotFoundException("Pre-sea course not found with id: " + requestDTO.getPreSeaCourseId()));
        IndosMaster indosMaster = indosMasterRepository.findById(requestDTO.getIndosMasterId())
                .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + requestDTO.getIndosMasterId()));

        existing.setPreSeaCourse(preSeaCourse);
        existing.setIndosMaster(indosMaster);
        existing.setStatus(requestDTO.getStatus());
        existing.setRemarks(requestDTO.getRemarks());

        Enrollment saved = enrollmentRepository.save(existing);
        return enrollmentMapper.toResponseDTO(saved);
    }

    @Transactional
    public EnrollmentResponseDTO patchEnrollment(UUID id, EnrollmentPatchRequestDTO patchDTO) {
        Enrollment existing = enrollmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Enrollment not found with id: " + id));

        if (patchDTO.getPreSeaCourseId() != null) {
            PreSeaCourses preSeaCourse = preSeaCoursesRepository.findById(patchDTO.getPreSeaCourseId())
                    .orElseThrow(() -> new NotFoundException("Pre-sea course not found with id: " + patchDTO.getPreSeaCourseId()));
            existing.setPreSeaCourse(preSeaCourse);
        }
        if (patchDTO.getIndosMasterId() != null) {
            IndosMaster indosMaster = indosMasterRepository.findById(patchDTO.getIndosMasterId())
                    .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + patchDTO.getIndosMasterId()));
            existing.setIndosMaster(indosMaster);
        }
        if (patchDTO.getStatus() != null) {
            existing.setStatus(patchDTO.getStatus());
        }
        if (patchDTO.getRemarks() != null) {
            existing.setRemarks(patchDTO.getRemarks());
        }

        Enrollment saved = enrollmentRepository.save(existing);
        return enrollmentMapper.toResponseDTO(saved);
    }

    @Transactional
    public void deleteEnrollment(UUID id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new NotFoundException("Enrollment not found with id: " + id);
        }
        enrollmentRepository.deleteById(id);
    }
}
