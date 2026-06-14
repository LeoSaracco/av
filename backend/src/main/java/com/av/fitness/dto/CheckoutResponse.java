package com.av.fitness.dto;

import java.math.BigDecimal;

public class CheckoutResponse {

    private String orderId;
    private BigDecimal total;
    private String status;

    public CheckoutResponse() {}

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
