package spring.playground;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import spring.playground.modules.course.PreSeaCourses;
import spring.playground.modules.course.PreSeaCoursesController;
import spring.playground.modules.course.PreSeaCoursesMapper;
import spring.playground.modules.course.PreSeaCoursesPatchRequestDTO;
import spring.playground.modules.course.PreSeaCoursesRepository;
import spring.playground.modules.course.PreSeaCoursesRequestDTO;
import spring.playground.modules.course.PreSeaCoursesResponseDTO;
import spring.playground.modules.course.PreSeaCoursesServices;
import spring.playground.modules.referenceData.institute.Institute;
import spring.playground.modules.referenceData.institute.InstituteRepository;

public class PreSeaCoursesTest {

    @Test
    public void testControllerCreate() {
        PreSeaCoursesServices service = Mockito.mock(PreSeaCoursesServices.class);
        PreSeaCoursesController controller = new PreSeaCoursesController(service);

        UUID id = UUID.randomUUID();
        UUID instId = UUID.randomUUID();
        PreSeaCoursesRequestDTO requestDTO = PreSeaCoursesRequestDTO.builder()
                .name("B.Sc. Nautical Science")
                .isActive(true)
                .startDate(LocalDate.of(2026, 8, 1))
                .instituteId(instId)
                .build();

        PreSeaCoursesResponseDTO responseDTO = PreSeaCoursesResponseDTO.builder()
                .id(id)
                .name("B.Sc. Nautical Science")
                .isActive(true)
                .startDate(LocalDate.of(2026, 8, 1))
                .instituteId(instId)
                .build();

        Mockito.when(service.createCourse(requestDTO)).thenReturn(responseDTO);

        ResponseEntity<PreSeaCoursesResponseDTO> response = controller.createCourse(requestDTO);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("B.Sc. Nautical Science", response.getBody().getName());
        assertEquals(instId, response.getBody().getInstituteId());
    }

    @Test
    public void testControllerGetById() {
        PreSeaCoursesServices service = Mockito.mock(PreSeaCoursesServices.class);
        PreSeaCoursesController controller = new PreSeaCoursesController(service);

        UUID id = UUID.randomUUID();
        PreSeaCoursesResponseDTO responseDTO = PreSeaCoursesResponseDTO.builder()
                .id(id)
                .name("GP Rating")
                .isActive(true)
                .startDate(LocalDate.of(2026, 8, 1))
                .build();

        Mockito.when(service.getCourseById(id)).thenReturn(responseDTO);

        ResponseEntity<PreSeaCoursesResponseDTO> response = controller.getCourseById(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("GP Rating", response.getBody().getName());
    }

    @Test
    public void testControllerUpdate() {
        PreSeaCoursesServices service = Mockito.mock(PreSeaCoursesServices.class);
        PreSeaCoursesController controller = new PreSeaCoursesController(service);

        UUID id = UUID.randomUUID();
        PreSeaCoursesRequestDTO requestDTO = PreSeaCoursesRequestDTO.builder()
                .name("GP Rating Updated")
                .isActive(true)
                .startDate(LocalDate.of(2026, 8, 1))
                .build();

        PreSeaCoursesResponseDTO responseDTO = PreSeaCoursesResponseDTO.builder()
                .id(id)
                .name("GP Rating Updated")
                .isActive(true)
                .startDate(LocalDate.of(2026, 8, 1))
                .build();

        Mockito.when(service.updateCourse(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<PreSeaCoursesResponseDTO> response = controller.updateCourse(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("GP Rating Updated", response.getBody().getName());
    }

    @Test
    public void testControllerPatch() {
        PreSeaCoursesServices service = Mockito.mock(PreSeaCoursesServices.class);
        PreSeaCoursesController controller = new PreSeaCoursesController(service);

        UUID id = UUID.randomUUID();
        PreSeaCoursesPatchRequestDTO requestDTO = PreSeaCoursesPatchRequestDTO.builder()
                .name("GP Rating Patched")
                .build();

        PreSeaCoursesResponseDTO responseDTO = PreSeaCoursesResponseDTO.builder()
                .id(id)
                .name("GP Rating Patched")
                .isActive(true)
                .startDate(LocalDate.of(2026, 8, 1))
                .build();

        Mockito.when(service.patchCourse(id, requestDTO)).thenReturn(responseDTO);

        ResponseEntity<PreSeaCoursesResponseDTO> response = controller.patchCourse(id, requestDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("GP Rating Patched", response.getBody().getName());
    }

    @Test
    public void testControllerDelete() {
        PreSeaCoursesServices service = Mockito.mock(PreSeaCoursesServices.class);
        PreSeaCoursesController controller = new PreSeaCoursesController(service);
        UUID id = UUID.randomUUID();

        Mockito.doNothing().when(service).deleteCourse(id);

        ResponseEntity<Void> response = controller.deleteCourse(id);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        Mockito.verify(service).deleteCourse(id);
    }

    @Test
    public void testServiceCreate() {
        PreSeaCoursesRepository repository = Mockito.mock(PreSeaCoursesRepository.class);
        InstituteRepository instituteRepository = Mockito.mock(InstituteRepository.class);
        PreSeaCoursesMapper mapper = Mockito.mock(PreSeaCoursesMapper.class);
        PreSeaCoursesServices services = new PreSeaCoursesServices(repository, instituteRepository, mapper);

        UUID instId = UUID.randomUUID();
        Institute institute = new Institute();
        institute.setId(instId);

        PreSeaCoursesRequestDTO requestDTO = PreSeaCoursesRequestDTO.builder()
                .name("DNS")
                .isActive(true)
                .startDate(LocalDate.of(2026, 8, 1))
                .instituteId(instId)
                .build();

        PreSeaCourses entity = new PreSeaCourses();
        entity.setName("DNS");
        entity.setIsActive(true);
        entity.setStartDate(LocalDate.of(2026, 8, 1));

        Mockito.when(instituteRepository.findById(instId)).thenReturn(Optional.of(institute));
        Mockito.when(mapper.toEntity(requestDTO)).thenReturn(entity);
        Mockito.when(repository.save(entity)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(entity)).thenAnswer(invocation -> {
            PreSeaCourses course = invocation.getArgument(0);
            return PreSeaCoursesResponseDTO.builder()
                    .name(course.getName())
                    .isActive(course.getIsActive())
                    .startDate(course.getStartDate())
                    .instituteId(course.getInstitute() != null ? course.getInstitute().getId() : null)
                    .build();
        });

        PreSeaCoursesResponseDTO result = services.createCourse(requestDTO);

        assertEquals("DNS", result.getName());
        assertEquals(instId, result.getInstituteId());
        Mockito.verify(repository).save(entity);
    }

    @Test
    public void testServicePatch() {
        PreSeaCoursesRepository repository = Mockito.mock(PreSeaCoursesRepository.class);
        InstituteRepository instituteRepository = Mockito.mock(InstituteRepository.class);
        PreSeaCoursesMapper mapper = Mockito.mock(PreSeaCoursesMapper.class);
        PreSeaCoursesServices services = new PreSeaCoursesServices(repository, instituteRepository, mapper);

        UUID courseId = UUID.randomUUID();
        UUID instId = UUID.randomUUID();
        Institute institute = new Institute();
        institute.setId(instId);

        PreSeaCourses existing = new PreSeaCourses();
        existing.setId(courseId);
        existing.setName("DNS Old");
        existing.setIsActive(false);
        existing.setStartDate(LocalDate.of(2026, 1, 1));

        PreSeaCoursesPatchRequestDTO patchDTO = PreSeaCoursesPatchRequestDTO.builder()
                .name("DNS New")
                .instituteId(instId)
                .build();

        Mockito.when(repository.findById(courseId)).thenReturn(Optional.of(existing));
        Mockito.when(instituteRepository.findById(instId)).thenReturn(Optional.of(institute));
        Mockito.when(repository.save(existing)).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(existing)).thenAnswer(invocation -> {
            PreSeaCourses course = invocation.getArgument(0);
            return PreSeaCoursesResponseDTO.builder()
                    .id(course.getId())
                    .name(course.getName())
                    .isActive(course.getIsActive())
                    .startDate(course.getStartDate())
                    .instituteId(course.getInstitute() != null ? course.getInstitute().getId() : null)
                    .build();
        });

        PreSeaCoursesResponseDTO result = services.patchCourse(courseId, patchDTO);

        assertEquals("DNS New", result.getName());
        assertEquals(instId, result.getInstituteId());
        assertEquals(false, result.getIsActive()); // unchanged
        Mockito.verify(repository).save(existing);
    }
}
