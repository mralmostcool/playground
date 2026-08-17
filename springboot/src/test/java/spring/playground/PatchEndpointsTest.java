package spring.playground;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import spring.playground.modules.referenceData.institute.Institute;
import spring.playground.modules.referenceData.institute.InstituteController;
import spring.playground.modules.referenceData.institute.InstituteMapper;
import spring.playground.modules.referenceData.institute.InstitutePatchRequestDTO;
import spring.playground.modules.referenceData.institute.InstituteRepository;
import spring.playground.modules.referenceData.institute.InstituteResponseDTO;
import spring.playground.modules.referenceData.institute.InstituteServices;

import spring.playground.modules.referenceData.rank.RankMaster;
import spring.playground.modules.referenceData.rank.RankMasterController;
import spring.playground.modules.referenceData.rank.RankMasterMapper;
import spring.playground.modules.referenceData.rank.RankMasterPatchRequestDTO;
import spring.playground.modules.referenceData.rank.RankMasterRepository;
import spring.playground.modules.referenceData.rank.RankMasterResponseDTO;
import spring.playground.modules.referenceData.rank.RankMasterServices;

import spring.playground.modules.seafarer.indos.IndosMaster;
import spring.playground.modules.seafarer.indos.IndosMasterController;
import spring.playground.modules.seafarer.indos.IndosMasterMapper;
import spring.playground.modules.seafarer.indos.IndosMasterPatchRequestDTO;
import spring.playground.modules.seafarer.indos.IndosMasterRepository;
import spring.playground.modules.seafarer.indos.IndosMasterResponseDTO;
import spring.playground.modules.seafarer.indos.IndosMasterServices;

public class PatchEndpointsTest {

    // --- INSTITUTE TESTS ---

    @Test
    public void testInstituteControllerPatch() {
        InstituteServices service = Mockito.mock(InstituteServices.class);
        InstituteController controller = new InstituteController(service);
        UUID id = UUID.randomUUID();
        InstitutePatchRequestDTO patchDTO = new InstitutePatchRequestDTO("Patched Institute");
        InstituteResponseDTO responseDTO = InstituteResponseDTO.builder().id(id).name("Patched Institute").build();

        Mockito.when(service.patchInstitute(id, patchDTO)).thenReturn(responseDTO);

        ResponseEntity<InstituteResponseDTO> response = controller.patchInstitute(id, patchDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Patched Institute", response.getBody().getName());
    }

    @Test
    public void testInstituteServicePatch() {
        InstituteRepository repository = Mockito.mock(InstituteRepository.class);
        InstituteMapper mapper = Mockito.mock(InstituteMapper.class);
        InstituteServices services = new InstituteServices(repository, mapper);
        UUID id = UUID.randomUUID();

        Institute existing = new Institute();
        existing.setId(id);
        existing.setName("Original Name");

        Mockito.when(repository.findById(id)).thenReturn(Optional.of(existing));
        Mockito.when(repository.saveAndFlush(Mockito.any())).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(Mockito.any())).thenAnswer(invocation -> {
            Institute entity = invocation.getArgument(0);
            return InstituteResponseDTO.builder().id(entity.getId()).name(entity.getName()).build();
        });

        InstitutePatchRequestDTO patchDTO = new InstitutePatchRequestDTO("Patched Name");
        InstituteResponseDTO result = services.patchInstitute(id, patchDTO);

        assertEquals("Patched Name", result.getName());
        assertEquals("Patched Name", existing.getName());
        Mockito.verify(repository).saveAndFlush(existing);
    }

    // --- RANK MASTER TESTS ---

    @Test
    public void testRankControllerPatch() {
        RankMasterServices service = Mockito.mock(RankMasterServices.class);
        RankMasterController controller = new RankMasterController(service);
        UUID id = UUID.randomUUID();
        RankMasterPatchRequestDTO patchDTO = new RankMasterPatchRequestDTO("Patched Rank", 4);
        RankMasterResponseDTO responseDTO = RankMasterResponseDTO.builder().id(id).name("Patched Rank").level(4).build();

        Mockito.when(service.patchRank(id, patchDTO)).thenReturn(responseDTO);

        ResponseEntity<RankMasterResponseDTO> response = controller.patchRank(id, patchDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Patched Rank", response.getBody().getName());
        assertEquals(4, response.getBody().getLevel());
    }

    @Test
    public void testRankServicePatch() {
        RankMasterRepository repository = Mockito.mock(RankMasterRepository.class);
        RankMasterMapper mapper = Mockito.mock(RankMasterMapper.class);
        RankMasterServices services = new RankMasterServices(repository, mapper);
        UUID id = UUID.randomUUID();

        RankMaster existing = new RankMaster();
        existing.setId(id);
        existing.setName("Original Rank");
        existing.setLevel(1);

        Mockito.when(repository.findById(id)).thenReturn(Optional.of(existing));
        Mockito.when(repository.save(Mockito.any())).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(Mockito.any())).thenAnswer(invocation -> {
            RankMaster entity = invocation.getArgument(0);
            return RankMasterResponseDTO.builder().id(entity.getId()).name(entity.getName()).level(entity.getLevel()).build();
        });

        RankMasterPatchRequestDTO patchDTO = new RankMasterPatchRequestDTO("Patched Rank", 3);
        RankMasterResponseDTO result = services.patchRank(id, patchDTO);

        assertEquals("Patched Rank", result.getName());
        assertEquals(3, result.getLevel());
        Mockito.verify(repository).save(existing);
    }

    // --- INDOS MASTER TESTS ---

    @Test
    public void testIndosControllerPatch() {
        IndosMasterServices service = Mockito.mock(IndosMasterServices.class);
        IndosMasterController controller = new IndosMasterController(service);
        UUID id = UUID.randomUUID();
        IndosMasterPatchRequestDTO patchDTO = new IndosMasterPatchRequestDTO("1234567", "PatchedFirst", null, true);
        IndosMasterResponseDTO responseDTO = IndosMasterResponseDTO.builder().id(id).firstName("PatchedFirst").isActive(true).build();

        Mockito.when(service.patchIndos(id, patchDTO)).thenReturn(responseDTO);

        ResponseEntity<IndosMasterResponseDTO> response = controller.patchIndos(id, patchDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("PatchedFirst", response.getBody().getFirstName());
        assertEquals(true, response.getBody().getIsActive());
    }

    @Test
    public void testIndosServicePatch() {
        IndosMasterRepository repository = Mockito.mock(IndosMasterRepository.class);
        RankMasterRepository rankRepository = Mockito.mock(RankMasterRepository.class);
        IndosMasterMapper mapper = Mockito.mock(IndosMasterMapper.class);
        IndosMasterServices services = new IndosMasterServices(repository, rankRepository, mapper);
        UUID id = UUID.randomUUID();

        RankMaster rank = new RankMaster();
        UUID rankId = UUID.randomUUID();
        rank.setId(rankId);

        IndosMaster existing = new IndosMaster();
        existing.setId(id);
        existing.setFirstName("OriginalFirst");
        existing.setIsActive(false);

        Mockito.when(repository.findById(id)).thenReturn(Optional.of(existing));
        Mockito.when(rankRepository.findById(rankId)).thenReturn(Optional.of(rank));
        Mockito.when(repository.save(Mockito.any())).thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(mapper.toResponseDTO(Mockito.any())).thenAnswer(invocation -> {
            IndosMaster entity = invocation.getArgument(0);
            return IndosMasterResponseDTO.builder()
                    .id(entity.getId())
                    .firstName(entity.getFirstName())
                    .isActive(entity.getIsActive())
                    .rankId(entity.getRank() != null ? entity.getRank().getId() : null)
                    .build();
        });

        IndosMasterPatchRequestDTO patchDTO = new IndosMasterPatchRequestDTO(null, "PatchedFirst", rankId, true);
        IndosMasterResponseDTO result = services.patchIndos(id, patchDTO);

        assertEquals("PatchedFirst", result.getFirstName());
        assertEquals(true, result.getIsActive());
        assertEquals(rankId, result.getRankId());
        Mockito.verify(repository).save(existing);
    }
}
