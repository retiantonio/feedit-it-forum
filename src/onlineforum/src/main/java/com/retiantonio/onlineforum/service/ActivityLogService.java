package com.retiantonio.onlineforum.service;

import com.retiantonio.onlineforum.dtos.response.ActivityLogResponse;
import com.retiantonio.onlineforum.exceptions.ResourceNotFoundException;
import com.retiantonio.onlineforum.exceptions.UnauthorizedException;
import com.retiantonio.onlineforum.model.ActivityLog;
import com.retiantonio.onlineforum.model.Moderator;
import com.retiantonio.onlineforum.model.UserAbstract;
import com.retiantonio.onlineforum.repository.ActivityLogRepository;
import com.retiantonio.onlineforum.repository.ModeratorRepository;
import com.retiantonio.onlineforum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final ModeratorRepository moderatorRepository;

    private Moderator getCurrentModerator() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return moderatorRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Moderator not found"));
    }

    public void log(String action, String targetType, Long targetId) {
        ActivityLog log = new ActivityLog();
        log.setOwner(getCurrentModerator());
        log.setAction(action);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        activityLogRepository.save(log);
    }

    private ActivityLogResponse toResponse(ActivityLog log) {
        ActivityLogResponse res = new ActivityLogResponse();
        res.setId(log.getId());
        res.setModeratorUsername(log.getOwner().getUsername());
        res.setAction(log.getAction());
        res.setTargetType(log.getTargetType());
        res.setTargetId(log.getTargetId());
        res.setTimestamp(log.getTimestamp());
        return res;
    }

    public List<ActivityLogResponse> getAll() {
        return activityLogRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public List<ActivityLogResponse> getByModerator() {
        Moderator moderator = getCurrentModerator();
        return activityLogRepository.findByOwner_Id(moderator.getId())
                .stream().map(this::toResponse).toList();
    }
}