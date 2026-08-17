package spring.playground;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import spring.playground.modules.course.PreSeaCourses;
import spring.playground.modules.course.PreSeaCoursesRepository;
import spring.playground.modules.seafarer.enrollment.Enrollment;
import spring.playground.modules.seafarer.enrollment.Enrollment.EnrollmentStatus;
import spring.playground.modules.seafarer.enrollment.EnrollmentController;
import spring.playground.modules.seafarer.enrollment.EnrollmentMapper;
import spring.playground.modules.seafarer.enrollment.EnrollmentPatchRequestDTO;
import spring.playground.modules.seafarer.enrollment.EnrollmentRepository;
import spring.playground.modules.seafarer.enrollment.EnrollmentRequestDTO;
import spring.playground.modules.seafarer.enrollment.EnrollmentResponseDTO;
import spring.playground.modules.seafarer.enrollment.EnrollmentServices;
import spring.playground.modules.seafarer.indos.IndosMaster;
import spring.playground.modules.seafarer.indos.IndosMasterRepository;

public class EnrollmentTest {

    @Test
    public void testControllerCreate() {
        EnrollmentServices service = Mockito.mock(EnrollmentServices.class);
        EnrollmentController controller = new EnrollmentController(service);

        UUID id = UUID.randomUUID();
        UUID courseId = UUID.randomUUID();
        UUID indosId = UUID.randomUUID();
        EnrollmentRequestDTO requestDTO = EnrollmentRequestDTO.builder()
                .preSeaCourseId(courseId)
                .indosMasterId(indosId)
                .status(EnrollmentStatus.ENROLLED)
                .remarks("First enrollment")
                .build();

        EnrollmentResponseDTO responseDTO = EnrollmentResponseDTO.builder()
                .id(id)
                .preSeaCourseId(courseId)
                .indosMasterId(indosId)
                .status(EnrollmentStatus.ENROLLED)
                .remarks("First enrollment")
                .build();

        Mockito.when(service.createEnrollment(requestDTO)).thenReturn(responseDTO);

        ResponseEntity<EnrollmentResponseDTO> response = controller.createEnrollment(requestDTO);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("First enrollment", response.getBody().getRemarks());
        assertEquals(courseId, response.getBody().getPreSeaCourseId());
    }

    @Test
    public void testControllerGetById() {
        EnrollmentServices service = Mockito.mock(EnrollmentServices.class);
        EnrollmentController controller = new EnrollmentController(service);

        UUID id = UUID.randomUUID();
        EnrollmentResponseDTO responseDTO = EnrollmentResponseDTO.builder()
                .id(id)
                .status(EnrollmentStatus.COMPLETED)
                .remarks("Finished")
                .build();

        Mockito.when(service.getEnrollmentById(id)).thenReturn(responseDTO);

        ResponseEntity<EnrollmentResponseDTO> response = controller.getEnrollmentById(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Finished", response.getBody().getRemarks());
        assertEquals(EnrollmentStatus.COMPLETED, response.getBody().getStatus());
    }

    @Test
    public void testControllerUpdate() {
        EnrollmentServices service = Mockito.mock(EnrollmentServices.class);
        EnrollmentController controller = new EnrollmentController(service);

        UUID id = UUID.randomUUID();
        UUID courseId = UUID.randomUUID();
        UUID indosId = UUID.randomUUID();
        EnrollmentRequestDTO requestDTO = EnrollmentRequestDTO.builder()
                .preSeaCourseId(courseId)
                .indosMasterId(indosId)
                .status(EnrollmentStatus.CANCELLED)
                .remarks("Cancelled enrollment")
                .build();

        EnrollmentResponseDTO responseDTO = EnrollmentResponseDTO.builder()
                .id(id)
                .preSeaCourseId(courseId)
                .indosMasterId(indosId)
                .status(EnrollmentStatus.CANCELLED)
                .remarks("Cancelled enrollment")
                .build();

        Mockito.when(service.updateEnrollment(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<EnrollmentResponseDTO> response = controller.updateEnrollment(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(EnrollmentStatus.CANCELLED, response.getBody().getStatus());
    }

    @Test
    public void testControllerPatch() {
        EnrollmentServices service = Mockito.mock(EnrollmentServices.class);
        EnrollmentController controller = new EnrollmentController(service);

        UUID id = UUID.randomUUID();
        EnrollmentPatchRequestDTO requestDTO = EnrollmentPatchRequestDTO.builder()
                .remarks("Patched Remarks")
                .build();

        EnrollmentResponseDTO responseDTO = EnrollmentResponseDTO.builder()
                .id(id)
                .status(EnrollmentStatus.ENROLLED)
                .remarks("Patched Remarks")
                .build();

        Mockito.when(service.patchEnrollment(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<EnrollmentResponseDTO> response = controller.patchEnrollment(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Patched Remarks", response.getBody().getRemarks());
    }

    @Test
    public void testControllerDelete() {
        EnrollmentServices service = Mockito.mock(EnrollmentServices.class);
        EnrollmentController controller = new EnrollmentController(service);
        UUID id = UUID.randomUUID();

        Mockito.doNothing().when(service).deleteEnrollment(id);

        ResponseEntity<Void> response = controller.deleteEnrollment(id);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        Mockito.verify(service).deleteEnrollment(id);
    }

    @Test
    public void testServiceCreate() {
        EnrollmentRepository repository = Mockito.mock(EnrollmentRepository.class);
        PreSeaCoursesRepository courseRepository = Mockito.mock(PreSeaCoursesRepository.class);
        IndosMasterRepository indosRepository = Mockito.mock(IndosMasterRepository.class);
        EnrollmentMapper mapper = Mockito.mock(EnrollmentMapper.class);
        EnrollmentServices services = new EnrollmentServices(repository, courseRepository, indosRepository, mapper);

        UUID courseId = UUID.randomUUID();
        PreSeaCourses course = new PreSeaCourses();
        course.setId(courseId);

        UUID indosId = UUID.randomUUID();
        IndosMaster indos = new IndosMaster();
        indos.setId(indosId);

        EnrollmentRequestDTO requestDTO = EnrollmentRequestDTO.builder()
                .preSeaCourseId(courseId)
                .indosMasterId(indosId)
                .status(EnrollmentStatus.ENROLLED)
                .remarks("New enrollment")
                .build();

        Enrollment entity = new Enrollment();
        entity.setStatus(EnrollmentStatus.ENROLLED);
        entity.setRemarks("New enrollment");

        Mockito.when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));
        Mockito.when(indosRepository.findById(indosId)).thenReturn(Optional.of(indos));
        Mockito.when(mapper.toEntity(requestDTO)).thenReturn(entity);
        Mockito.when(repository.save(entity)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(entity)).thenAnswer(invocation -> {
            Enrollment e = invocation.getArgument(0);
            return EnrollmentResponseDTO.builder()
                    .preSeaCourseId(e.getPreSeaCourse() != null ? e.getPreSeaCourse().getId() : null)
                    .indosMasterId(e.getIndosMaster() != null ? e.getIndosMaster().getId() : null)
                    .status(e.getStatus())
                    .remarks(e.getRemarks())
                    .build();
        });

        EnrollmentResponseDTO result = services.createEnrollment(requestDTO);

        assertEquals("New enrollment", result.getRemarks());
        assertEquals(courseId, result.getPreSeaCourseId());
        assertEquals(indosId, result.getIndosMasterId());
        Mockito.verify(repository).save(entity);
    }

    @Test
    public void testServicePatch() {
        EnrollmentRepository repository = Mockito.mock(EnrollmentRepository.class);
        PreSeaCoursesRepository courseRepository = Mockito.mock(PreSeaCoursesRepository.class);
        IndosMasterRepository indosRepository = Mockito.mock(IndosMasterRepository.class);
        EnrollmentMapper mapper = Mockito.mock(EnrollmentMapper.class);
        EnrollmentServices services = new EnrollmentServices(repository, courseRepository, indosRepository, mapper);

        UUID enrollmentId = UUID.randomUUID();
        UUID courseId = UUID.randomUUID();
        PreSeaCourses course = new PreSeaCourses();
        course.setId(courseId);

        Enrollment existing = new Enrollment();
        existing.setId(enrollmentId);
        existing.setStatus(EnrollmentStatus.ENROLLED);
        existing.setRemarks("Original");

        EnrollmentPatchRequestDTO patchDTO = EnrollmentPatchRequestDTO.builder()
                .preSeaCourseId(courseId)
                .status(EnrollmentStatus.COMPLETED)
                .build();

        Mockito.when(repository.findById(enrollmentId)).thenReturn(Optional.of(existing));
        Mockito.when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));
        Mockito.when(repository.save(existing)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(existing)).thenAnswer(invocation -> {
            Enrollment e = invocation.getArgument(0);
            return EnrollmentResponseDTO.builder()
                    .id(e.getId())
                    .preSeaCourseId(e.getPreSeaCourse() != null ? e.getPreSeaCourse().getId() : null)
                    .indosMasterId(e.getIndosMaster() != null ? e.getIndosMaster().getId() : null)
                    .status(e.getStatus())
                    .remarks(e.getRemarks())
                    .build();
        });

        EnrollmentResponseDTO result = services.patchEnrollment(enrollmentId, patchDTO);

        assertEquals(courseId, result.getPreSeaCourseId());
        assertEquals(EnrollmentStatus.COMPLETED, result.getStatus());
        assertEquals("Original", result.getRemarks()); // unchanged
        Mockito.verify(repository).save(existing);
    }
}
