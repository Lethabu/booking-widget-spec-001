# SPEC-001: Booking Widget Implementation

## User Story
**As a** customer of Instyle Hair Boutique  
**I want to** book an appointment online  
**So that** I can secure my preferred service, employee, and time slot

## Acceptance Criteria

### Functional Requirements
1. **Service Selection**: Display all 5 services with correct pricing
   - Middle & Side Installation: R300, 60 min
   - Maphondo & Lines Installation: R350, 60 min
   - Soft Glam Makeup: R450, 120 min
   - Gel Maphondo Styling: R350, 120 min
   - Frontal Ponytail Installation: R950, 120 min

2. **Employee Selection**: Show 4 employees with availability
   - Thandi Mthembu
   - Nomsa Dlamini
   - Zanele Khumalo
   - Precious Ndaba

3. **Calendar Integration**: Real-time availability from SuperSaaS
   - Must sync every 30 seconds
   - Show available slots in green, booked in red
   - Block past dates and holidays

4. **Booking Confirmation**: Immediate confirmation via SMS/WhatsApp
   - Send to customer phone number
   - Include: Service, employee, time, location, cancel link

5. **Payment Flow**: Integrate Paystack for deposits
   - 50% deposit required for bookings >R500
   - Store payment status in database

### Non-Functional Requirements
- **Performance**: First load < 2s, LCP < 1.5s
- **Accessibility**: WCAG 2.1 AA compliant
- **Security**: Rate limit 10 requests/minute per IP
- **Reliability**: 99.9% uptime SLA
- **Mobile**: Fully responsive, PWA installable

### Edge Cases
1. **Concurrent Bookings**: Two customers booking same slot simultaneously
   - Solution: Optimistic locking with version fields
2. **SuperSaaS Down**: Graceful degradation with cached data
3. **Payment Failure**: Rollback booking, notify customer
4. **No-Show Policy**: Auto-cancel after 15 min, free up slot

### Integration Points
- **SuperSaaS API**: Schedule ID 695384
- **Paystack API**: Secret key from environment
- **WhatsApp Business API**: Meta Business verification
- **Cloudflare D1**: Tenant isolation via RLS

### Success Metrics
- **Conversion Rate**: 15% of visitors complete booking
- **Error Rate**: < 0.1% failed bookings
- **Sync Latency**: < 5 seconds from SuperSaaS
- **Mobile Usage**: > 60% of bookings from mobile
