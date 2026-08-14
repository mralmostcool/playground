package spring.playground.modules;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import spring.playground.modules.referenceData.institute.*;
import spring.playground.modules.referenceData.rank.*;
import spring.playground.modules.seafarer.indos.*;
import spring.playground.modules.course.*;
import spring.playground.modules.seafarer.enrollment.*;
import spring.playground.modules.shipping.company.*;
import spring.playground.modules.shipping.vessel.*;
import spring.playground.modules.shipping.berth.*;
import spring.playground.modules.shipping.berthAllocation.*;
import spring.playground.modules.training.berthSeafarerAllocation.*;
import spring.playground.modules.training.contract.*;

class MappersTestSuiteTest {

    @Test
    void testInstituteMapper() {
        Institute entity = Institute.builder()
                .id(UUID.randomUUID())
                .name("Global Marine Institute")
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        InstituteResponseDTO response = InstituteMapper.INSTANCE.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(entity.getId(), response.getId());
        assertEquals(entity.getName(), response.getName());

        InstituteRequestDTO request = InstituteRequestDTO.builder()
                .name("Global Marine Institute")
                .build();

        Institute mappedEntity = InstituteMapper.INSTANCE.toEntity(request);
        assertNotNull(mappedEntity);
        assertEquals(request.getName(), mappedEntity.getName());
    }

    @Test
    void testRankMasterMapper() {
        RankMaster entity = RankMaster.builder()
                .id(UUID.randomUUID())
                .name("Captain")
                .level(1)
                .createdAt(OffsetDateTime.now())
                .build();

        RankMasterResponseDTO response = RankMasterMapper.INSTANCE.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(entity.getId(), response.getId());
        assertEquals(entity.getName(), response.getName());
        assertEquals(entity.getLevel(), response.getLevel());

        RankMasterRequestDTO request = RankMasterRequestDTO.builder()
                .name("Captain")
                .level(1)
                .build();

        RankMaster mappedEntity = RankMasterMapper.INSTANCE.toEntity(request);
        assertNotNull(mappedEntity);
        assertEquals(request.getName(), mappedEntity.getName());
        assertEquals(request.getLevel(), mappedEntity.getLevel());
    }

    @Test
    void testIndosMasterMapper() {
        RankMaster rank = RankMaster.builder().id(UUID.randomUUID()).build();
        IndosMaster entity = IndosMaster.builder()
                .id(UUID.randomUUID())
                .indos("1234567")
                .firstName("John")
                .rank(rank)
                .isActive(true)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        IndosMasterResponseDTO response = IndosMasterMapper.INSTANCE.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(entity.getId(), response.getId());
        assertEquals(rank.getId(), response.getRankId());

        IndosMasterRequestDTO request = IndosMasterRequestDTO.builder()
                .indos("1234567")
                .firstName("John")
                .rankId(rank.getId())
                .isActive(true)
                .build();

        IndosMaster mappedEntity = IndosMasterMapper.INSTANCE.toEntity(request);
        assertNotNull(mappedEntity);
        assertEquals(request.getRankId(), mappedEntity.getRank().getId());
    }

    @Test
    void testPreSeaCoursesMapper() {
        Institute inst = Institute.builder().id(UUID.randomUUID()).build();
        PreSeaCourses entity = PreSeaCourses.builder()
                .id(UUID.randomUUID())
                .name("GP Rating")
                .isActive(true)
                .startDate(OffsetDateTime.now())
                .institute(inst)
                .build();

        PreSeaCoursesResponseDTO response = PreSeaCoursesMapper.INSTANCE.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(inst.getId(), response.getInstituteId());

        PreSeaCoursesRequestDTO request = PreSeaCoursesRequestDTO.builder()
                .name("GP Rating")
                .isActive(true)
                .startDate(OffsetDateTime.now())
                .instituteId(inst.getId())
                .build();

        PreSeaCourses mappedEntity = PreSeaCoursesMapper.INSTANCE.toEntity(request);
        assertNotNull(mappedEntity);
        assertEquals(request.getInstituteId(), mappedEntity.getInstitute().getId());
    }

    @Test
    void testEnrollmentMapper() {
        PreSeaCourses course = PreSeaCourses.builder().id(UUID.randomUUID()).build();
        IndosMaster indos = IndosMaster.builder().id(UUID.randomUUID()).build();
        Enrollment entity = Enrollment.builder()
                .id(UUID.randomUUID())
                .preSeaCourse(course)
                .indosMaster(indos)
                .status(Enrollment.EnrollmentStatus.ENROLLED)
                .build();

        EnrollmentResponseDTO response = EnrollmentMapper.INSTANCE.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(course.getId(), response.getPreSeaCourseId());
        assertEquals(indos.getId(), response.getIndosMasterId());

        EnrollmentRequestDTO request = EnrollmentRequestDTO.builder()
                .preSeaCourseId(course.getId())
                .indosMasterId(indos.getId())
                .status(Enrollment.EnrollmentStatus.COMPLETED)
                .build();

        Enrollment mappedEntity = EnrollmentMapper.INSTANCE.toEntity(request);
        assertNotNull(mappedEntity);
        assertEquals(request.getPreSeaCourseId(), mappedEntity.getPreSeaCourse().getId());
        assertEquals(request.getIndosMasterId(), mappedEntity.getIndosMaster().getId());
    }

    @Test
    void testCompanyMapper() {
        Company entity = Company.builder()
                .id(UUID.randomUUID())
                .name("Maersk")
                .registrationNo("R123")
                .isActive(true)
                .build();

        CompanyResponseDTO response = CompanyMapper.INSTANCE.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(entity.getId(), response.getId());

        CompanyRequestDTO request = CompanyRequestDTO.builder()
                .name("Maersk")
                .registrationNo("R123")
                .isActive(true)
                .build();

        Company mappedEntity = CompanyMapper.INSTANCE.toEntity(request);
        assertNotNull(mappedEntity);
        assertEquals(request.getName(), mappedEntity.getName());
    }

    @Test
    void testVesselMapper() {
        Vessel entity = Vessel.builder()
                .id(UUID.randomUUID())
                .imo("9876543")
                .name("Vessel One")
                .flag("Panama")
                .isActive(true)
                .build();

        VesselResponseDTO response = VesselMapper.INSTANCE.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(entity.getId(), response.getId());

        VesselRequestDTO request = VesselRequestDTO.builder()
                .imo("9876543")
                .name("Vessel One")
                .flag("Panama")
                .isActive(true)
                .build();

        Vessel mappedEntity = VesselMapper.INSTANCE.toEntity(request);
        assertNotNull(mappedEntity);
        assertEquals(request.getImo(), mappedEntity.getImo());
    }

    @Test
    void testBerthMapper() {
        Berth entity = Berth.builder()
                .id(UUID.randomUUID())
                .berthName("Berth A")
                .isActive(true)
                .build();

        BerthResponseDTO response = BerthMapper.INSTANCE.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(entity.getId(), response.getId());

        BerthRequestDTO request = BerthRequestDTO.builder()
                .berthName("Berth A")
                .isActive(true)
                .build();

        Berth mappedEntity = BerthMapper.INSTANCE.toEntity(request);
        assertNotNull(mappedEntity);
        assertEquals(request.getBerthName(), mappedEntity.getBerthName());
    }

    @Test
    void testBerthAllocationMapper() {
        Berth berth = Berth.builder().id(UUID.randomUUID()).build();
        Vessel vessel = Vessel.builder().id(UUID.randomUUID()).build();
        BerthAllocation entity = BerthAllocation.builder()
                .id(UUID.randomUUID())
                .berth(berth)
                .vessel(vessel)
                .startDate(OffsetDateTime.now())
                .endDate(OffsetDateTime.now())
                .build();

        BerthAllocationResponseDTO response = BerthAllocationMapper.INSTANCE.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(berth.getId(), response.getBerthId());
        assertEquals(vessel.getId(), response.getVesselId());

        BerthAllocationRequestDTO request = BerthAllocationRequestDTO.builder()
                .berthId(berth.getId())
                .vesselId(vessel.getId())
                .startDate(OffsetDateTime.now())
                .endDate(OffsetDateTime.now())
                .build();

        BerthAllocation mappedEntity = BerthAllocationMapper.INSTANCE.toEntity(request);
        assertNotNull(mappedEntity);
        assertEquals(request.getBerthId(), mappedEntity.getBerth().getId());
        assertEquals(request.getVesselId(), mappedEntity.getVessel().getId());
    }

    @Test
    void testBerthSeafarerAllocationMapper() {
        Berth berth = Berth.builder().id(UUID.randomUUID()).build();
        IndosMaster indos = IndosMaster.builder().id(UUID.randomUUID()).build();
        BerthAllocation allocation = BerthAllocation.builder().id(UUID.randomUUID()).build();

        BerthSeafarerAllocation entity = BerthSeafarerAllocation.builder()
                .id(UUID.randomUUID())
                .berth(berth)
                .indosMaster(indos)
                .berthAllocation(allocation)
                .startDate(OffsetDateTime.now())
                .endDate(OffsetDateTime.now())
                .build();

        BerthSeafarerAllocationResponseDTO response = BerthSeafarerAllocationMapper.INSTANCE.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(berth.getId(), response.getBerthId());
        assertEquals(indos.getId(), response.getIndosMasterId());
        assertEquals(allocation.getId(), response.getBerthAllocationId());

        BerthSeafarerAllocationRequestDTO request = BerthSeafarerAllocationRequestDTO.builder()
                .berthId(berth.getId())
                .indosMasterId(indos.getId())
                .berthAllocationId(allocation.getId())
                .startDate(OffsetDateTime.now())
                .endDate(OffsetDateTime.now())
                .build();

        BerthSeafarerAllocation mappedEntity = BerthSeafarerAllocationMapper.INSTANCE.toEntity(request);
        assertNotNull(mappedEntity);
        assertEquals(request.getBerthId(), mappedEntity.getBerth().getId());
        assertEquals(request.getIndosMasterId(), mappedEntity.getIndosMaster().getId());
        assertEquals(request.getBerthAllocationId(), mappedEntity.getBerthAllocation().getId());
    }

    @Test
    void testContractMapper() {
        IndosMaster indos = IndosMaster.builder().id(UUID.randomUUID()).build();
        Company company = Company.builder().id(UUID.randomUUID()).build();
        Enrollment enrollment = Enrollment.builder().id(UUID.randomUUID()).build();
        BerthSeafarerAllocation allocation = BerthSeafarerAllocation.builder().id(UUID.randomUUID()).build();

        Contract entity = Contract.builder()
                .id(UUID.randomUUID())
                .indosMaster(indos)
                .company(company)
                .enrollment(enrollment)
                .berthSeafarerAllocation(allocation)
                .status(Contract.ContractStatus.ACTIVE)
                .signOnDate(OffsetDateTime.now())
                .signOnPort("Port A")
                .signOnCountry("Country A")
                .signOffDate(OffsetDateTime.now())
                .signOffPort("Port B")
                .signOffCountry("Country B")
                .build();

        ContractResponseDTO response = ContractMapper.INSTANCE.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(indos.getId(), response.getIndosMasterId());
        assertEquals(company.getId(), response.getCompanyId());
        assertEquals(enrollment.getId(), response.getEnrollmentId());
        assertEquals(allocation.getId(), response.getBerthSeafarerAllocationId());
        assertEquals(Contract.ContractStatus.ACTIVE, response.getStatus());

        ContractRequestDTO request = ContractRequestDTO.builder()
                .indosMasterId(indos.getId())
                .companyId(company.getId())
                .enrollmentId(enrollment.getId())
                .berthSeafarerAllocationId(allocation.getId())
                .status(Contract.ContractStatus.COMPLETED)
                .signOnDate(OffsetDateTime.now())
                .signOnPort("Port A")
                .signOnCountry("Country A")
                .signOffDate(OffsetDateTime.now())
                .signOffPort("Port B")
                .signOffCountry("Country B")
                .build();

        Contract mappedEntity = ContractMapper.INSTANCE.toEntity(request);
        assertNotNull(mappedEntity);
        assertEquals(request.getIndosMasterId(), mappedEntity.getIndosMaster().getId());
        assertEquals(request.getCompanyId(), mappedEntity.getCompany().getId());
        assertEquals(request.getEnrollmentId(), mappedEntity.getEnrollment().getId());
        assertEquals(request.getBerthSeafarerAllocationId(), mappedEntity.getBerthSeafarerAllocation().getId());
        assertEquals(Contract.ContractStatus.COMPLETED, mappedEntity.getStatus());
    }
}
