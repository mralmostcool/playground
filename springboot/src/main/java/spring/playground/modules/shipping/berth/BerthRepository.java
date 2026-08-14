package spring.playground.modules.shipping.berth;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BerthRepository extends JpaRepository<Berth, UUID> {

}
