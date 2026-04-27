package com.meena.frauddetection.repository;

import com.meena.frauddetection.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findTop500ByOrderByIdDesc();
}
