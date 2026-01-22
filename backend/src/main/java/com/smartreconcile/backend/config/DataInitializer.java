package com.smartreconcile.backend.config;

import com.smartreconcile.backend.invoice.entity.Invoice;
import com.smartreconcile.backend.invoice.entity.InvoiceStatus;
import com.smartreconcile.backend.invoice.repository.InvoiceRepository;
import com.smartreconcile.backend.payment.entity.Payment;
import com.smartreconcile.backend.payment.entity.PaymentMethod;
import com.smartreconcile.backend.payment.entity.PaymentStatus;
import com.smartreconcile.backend.payment.repository.PaymentRepository;
import com.smartreconcile.backend.vendor.entity.Vendor;
import com.smartreconcile.backend.vendor.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    VendorRepository vendorRepository;

    @Autowired
    InvoiceRepository invoiceRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create Roles if they don't exist
        if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
            roleRepository.save(new Role(ERole.ROLE_FINANCE_MANAGER));
            roleRepository.save(new Role(ERole.ROLE_ACCOUNTS));
            roleRepository.save(new Role(ERole.ROLE_VENDOR));
        }

        // 2. Create Accounts and link Vendor
        User admin = userRepository.findByEmail("admin@smartreconcile.com")
                .orElseGet(() -> createUser("admin@smartreconcile.com", "admin123", "Admin User", ERole.ROLE_ADMIN));

        User finance = userRepository.findByEmail("finance@smartreconcile.com")
                .orElseGet(() -> createUser("finance@smartreconcile.com", "finance123", "Finance Manager",
                        ERole.ROLE_FINANCE_MANAGER));

        User accounts = userRepository.findByEmail("accounts@smartreconcile.com")
                .orElseGet(() -> createUser("accounts@smartreconcile.com", "accounts123", "Accounts Executive",
                        ERole.ROLE_ACCOUNTS));

        User vendorUser = userRepository.findByEmail("vendor@smartreconcile.com")
                .orElseGet(
                        () -> createUser("vendor@smartreconcile.com", "vendor123", "Vendor User", ERole.ROLE_VENDOR));

        // 3. Create Sample Vendor Linked to Vendor User
        if (vendorRepository.count() == 0) {
            Vendor vendor = new Vendor();
            vendor.setName("Tech Parts Inc.");
            vendor.setTaxId("GST12345678");
            vendor.setContactEmail("vendor@smartreconcile.com");
            vendor.setPhone("+1 (555) 012-3456");
            vendor.setAddress("456 Industry Way, Silicon Valley, CA");
            vendor.setUser(vendorUser);
            vendorRepository.save(vendor);

            // 4. Create Sample Invoices
            createInvoice(vendor, "INV-2024-001", new BigDecimal("5000.00"), new BigDecimal("0.00"),
                    InvoiceStatus.CREATED, 15);
            createInvoice(vendor, "INV-2024-002", new BigDecimal("12500.00"), new BigDecimal("4500.00"),
                    InvoiceStatus.PARTIALLY_PAID, 5);
            createInvoice(vendor, "INV-2024-003", new BigDecimal("3200.00"), new BigDecimal("0.00"),
                    InvoiceStatus.OVERDUE, -10);

            // 5. Create Sample Payments
            createPayment(vendor, "TRX-PAY-101", new BigDecimal("4500.00"), PaymentStatus.FULLY_ALLOCATED,
                    "Allocated to INV-002");
            createPayment(null, "TRX-PAY-102", new BigDecimal("2500.00"), PaymentStatus.UNALLOCATED,
                    "Unallocated Bulk Payment");

            System.out.println("SAMPLE DATA SEEDED SUCCESSFULLY");
        }
    }

    private User createUser(String email, String password, String name, ERole roleName) {
        User user = new User(email, encoder.encode(password), name);
        Set<Role> roles = new HashSet<>();
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " is not found."));
        roles.add(role);
        user.setRoles(roles);
        User savedUser = userRepository.save(user);
        System.out.println("USER CREATED: email=" + email + " (Role: " + roleName + ")");
        return savedUser;
    }

    private void createInvoice(Vendor v, String num, BigDecimal total, BigDecimal paid, InvoiceStatus status,
            int daysOffset) {
        Invoice inv = new Invoice();
        inv.setVendor(v);
        inv.setInvoiceNumber(num);
        inv.setAmountTotal(total);
        inv.setAmountPaid(paid);
        inv.setStatus(status);
        inv.setIssueDate(LocalDate.now().minusDays(30));
        inv.setDueDate(LocalDate.now().plusDays(daysOffset));
        inv.calculateDue();
        invoiceRepository.save(inv);
    }

    private void createPayment(Vendor v, String ref, BigDecimal amount, PaymentStatus status, String desc) {
        Payment p = new Payment();
        p.setVendor(v);
        p.setTransactionReference(ref);
        p.setAmount(amount);
        p.setPaymentDate(LocalDate.now().minusDays(5));
        p.setMethod(PaymentMethod.BANK_TRANSFER);
        p.setStatus(status);
        p.setDescription(desc);
        if (status == PaymentStatus.FULLY_ALLOCATED) {
            p.setAmountAllocated(amount);
        }
        paymentRepository.save(p);
    }
}
