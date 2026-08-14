package spring.playground.modules.seafarer.indos;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IndosMasterRepository extends JpaRepository<IndosMaster, UUID> {

}
