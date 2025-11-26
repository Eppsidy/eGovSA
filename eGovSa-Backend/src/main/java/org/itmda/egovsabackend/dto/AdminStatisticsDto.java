package org.itmda.egovsabackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatisticsDto {
    private long totalApplications;
    private long pendingReview;  // "Under Review" status
    private long approved;       // "Completed" status
    private long rejected;       // "Rejected" status
    private long inProgress;     // "In Progress" status
    private long pendingPayment; // "Pending Payment" status
}
