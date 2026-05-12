package com.retiantonio.onlineforum.repository;

import com.retiantonio.onlineforum.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByOwner_Id(Long moderatorId);

}
