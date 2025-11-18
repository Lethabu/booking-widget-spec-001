# Clarifications for SPEC-001

## Q1: What happens if a customer doesn't have WhatsApp?
**A**: Fallback to SMS. If neither available, show in-app confirmation.

## Q2: How are employee schedules created in SuperSaaS?
**A**: Use "Duplicate" function from main schedule (ID: 695384). Each employee gets their own schedule ID stored in `employees.supersaas_schedule_id`.

## Q3: What time zone should be used?
**A**: Africa/Johannesburg (UTC+2). All timestamps stored in UTC, displayed in local time.

## Q4: How are cancellations handled?
**A**: Customer can cancel via link up to 24h before. Auto-refund deposit if applicable. Slot becomes immediately available.

## Q5: SuperSaaS sync frequency?
**A**: Webhook on change + polling every 30 seconds for redundancy.

## Technical Debt Items
- [ ] Implement webhook endpoint in booking app
- [ ] Add retry logic for failed syncs
- [ ] Cache SuperSaaS responses in KV (5 min TTL)
