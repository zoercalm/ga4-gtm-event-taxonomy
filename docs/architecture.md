# Implementation and manual QA

| Event | Trigger | Verification |
|---|---|---|
| view_item | Product details visible | Product SKU and displayed price match |
| add_to_cart | Successful cart update | Not fired on failed add |
| begin_checkout | Enter checkout | Cart value and quantities match |
| purchase | Confirmed order | Stable transaction ID; value excludes tax/shipping |

Keep one shared transaction Set for the page lifecycle. Connect the validated payload to window.dataLayer in an application integration; the supplied demo uses an array only.

GTM setup: custom-event triggers matching the four names; GA4 event tags with ecommerce data from the data layer. Configure measurement ID and consent handling in the target environment. Before release, use GTM Preview and GA4 DebugView to verify exactly one purchase, no firing on failed payment, currency and items, empty-cart paths, repeat rendering, consent denied/granted, and cross-domain checkout if applicable. These live checks have not been performed by this repository.

References:
- https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
- https://developers.google.com/analytics/devguides/collection/ga4/reference/events
- https://developers.google.com/analytics/devguides/collection/ga4/validate-ecommerce
