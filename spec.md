# Divine Mantras

## Current State
Empty workspace — full rebuild from scratch.

## Requested Changes (Diff)

### Add
- Home screen with 14 deity category cards
- Mantra library per deity: Sanskrit text, transliteration, meaning (EN/Hindi/Telugu)
- Audio player per mantra using real archive.org URLs
- Service Worker cache-first strategy for offline audio after first play
- Full stotras section: Vishnu Sahasranamam, Lalitha Sahasranamam, Hanuman Chalisa
- Guided meditation screen with 108-bead mala counter
- Daily mantra suggestion (deterministic by date)
- Browser-based reminder notifications
- Multilingual UI toggle: English / हिंदी / తెలుగు

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Minimal Motoko backend (no content stored in backend — all hardcoded in frontend)
2. Frontend: all mantra/stotra data arrays hardcoded in TypeScript data files
3. Routing: Home → Deity → Mantra detail; Stotras; Meditation; Daily
4. Audio: HTML5 <audio> element with archive.org src URLs
5. Service Worker registered in index.html for cache-first audio caching
6. Mala counter: click/tap bead increments count, resets at 108
7. Language toggle stored in localStorage
8. Daily mantra: index = dayOfYear % totalMantras
