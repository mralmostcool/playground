package spring.playground.modules.referenceData.rank;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RankMasterRepository extends JpaRepository<RankMaster, UUID> {

}
