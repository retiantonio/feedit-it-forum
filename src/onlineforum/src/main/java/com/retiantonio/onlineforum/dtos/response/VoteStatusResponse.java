package com.retiantonio.onlineforum.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VoteStatusResponse {
    private Long postId;
    private int direction; // 1 or -1
}
