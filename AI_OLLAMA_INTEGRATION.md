# AI Code Suggestions with Ollama Integration

## Overview

This implementation adds intelligent Ollama availability checking to the AI code suggestion feature. The system automatically detects if Ollama is running and disables AI suggestions if it's not available.

## Changes Made

### 1. **Ollama Checker Utility** (`src/lib/ollama-checker.ts`)
- `checkOllamaAvailability()`: Checks if Ollama is running on port 11434
- `checkOllamaModel()`: Verifies if a specific model is available
- 3-second timeout for connection attempts
- Returns detailed status with error messages

### 2. **API Route Updates** (`src/app/api/code-suggestion/route.ts`)
- Added Ollama availability check before processing requests
- Returns 503 (Service Unavailable) if Ollama is not running
- Removed unused imports (`metadata`, `extname`, `getLastNonEmptyLine`)
- Provides clear error messages to the client

### 3. **AI Hook Enhancement** (`src/features/ai/hooks/useAISuggestion.tsx`)
- Added `ollamaAvailable` state tracking
- Automatic Ollama check on component mount
- Auto-disables AI if Ollama is not available
- Prevents enabling AI when Ollama is down
- Handles 503 errors from API and auto-disables

### 4. **Status Banner Component** (`src/components/OllamaStatusBanner.tsx`)
- Visual warning when Ollama is not available
- Periodic health checks (every 30 seconds)
- Dismissible banner
- Links to Ollama installation page
- Clean, accessible UI with icons

### 5. **Playground Integration** (`src/app/playground/[id]/page.tsx`)
- Added OllamaStatusBanner to the playground
- Positioned at the top for visibility
- Integrates seamlessly with existing UI

## Features

### ✅ Automatic Detection
- Checks Ollama availability on app load
- No manual configuration needed

### ✅ Visual Feedback
- Yellow warning banner when Ollama is unavailable
- Clear error messages
- Installation instructions

### ✅ Auto-Disable
- AI suggestions automatically disabled if Ollama is down
- Prevents unnecessary API calls
- Saves resources

### ✅ Smart Recovery
- Periodic health checks
- Auto-enables when Ollama becomes available
- Graceful error handling

### ✅ User Control
- Manual toggle still available
- Cannot enable if Ollama is down
- Clear feedback on why AI is disabled

## User Experience Flow

```
1. User opens playground
   ↓
2. System checks Ollama availability
   ↓
3a. Ollama Available          3b. Ollama Not Available
    ✅ AI enabled                  ⚠️ Warning banner shown
    ✅ Suggestions work            ❌ AI auto-disabled
                                   📝 Installation instructions
   ↓
4. User types code
   ↓
5a. AI generates suggestions  5b. No API calls made
    ⚡ Fast response              💾 Resources saved
```

## Technical Details

### Ollama Connection
- **Endpoint**: `http://127.0.0.1:11434/api/tags`
- **Timeout**: 3 seconds
- **Method**: GET request
- **Check Frequency**: Every 30 seconds

### API Error Handling
- **503**: Ollama not available → Auto-disable AI
- **400**: Invalid parameters → Show error
- **500**: Server error → Log and continue

### State Management
```typescript
interface AISuggestionState {
  suggestion: string | null
  isLoading: boolean
  position: { line: number, column: number } | null
  decoration: string[]
  isEnabled: boolean
  ollamaAvailable: boolean  // NEW
}
```

## Configuration

### Change Ollama Port
If Ollama runs on a different port, update:

1. `src/lib/ollama-checker.ts`:
   ```typescript
   const response = await fetch('http://127.0.0.1:YOUR_PORT/api/tags', ...)
   ```

2. `src/app/api/code-suggestion/route.ts`:
   ```typescript
   const response = await fetch("http://127.0.0.1:YOUR_PORT/api/generate", ...)
   ```

### Change Model
Update in `src/app/api/code-suggestion/route.ts`:
```typescript
model: "your-model-name:tag"
```

### Adjust Check Frequency
Update in `src/components/OllamaStatusBanner.tsx`:
```typescript
const interval = setInterval(checkOllama, YOUR_INTERVAL_MS);
```

## Testing

### Test Ollama Detection
1. **With Ollama Running**:
   - Open playground
   - No warning banner
   - AI toggle enabled
   - Suggestions work

2. **Without Ollama**:
   - Open playground
   - Yellow warning banner appears
   - AI toggle disabled
   - No API calls made

3. **Ollama Stops Mid-Session**:
   - Try to get suggestion
   - API returns 503
   - AI auto-disables
   - Warning banner appears

### Manual Testing
```bash
# Check Ollama status
curl http://127.0.0.1:11434/api/tags

# Test API endpoint
curl -X POST http://localhost:3000/api/code-suggestion \
  -H "Content-Type: application/json" \
  -d '{
    "fileContent": "const x = ",
    "cursorLine": 0,
    "cursorColumn": 10,
    "suggestionType": "completion"
  }'
```

## Benefits

1. **Better UX**: Users know immediately if AI won't work
2. **Resource Efficient**: No wasted API calls
3. **Clear Guidance**: Installation instructions provided
4. **Automatic Recovery**: Works when Ollama starts
5. **Error Prevention**: Prevents confusing error states

## Future Enhancements

- [ ] Add model selection UI
- [ ] Show Ollama version in banner
- [ ] Add "Retry" button in banner
- [ ] Cache Ollama status for performance
- [ ] Add Ollama installation wizard
- [ ] Support multiple AI providers
- [ ] Add telemetry for Ollama usage

## Files Modified

1. ✅ `src/lib/ollama-checker.ts` (NEW)
2. ✅ `src/app/api/code-suggestion/route.ts` (MODIFIED)
3. ✅ `src/features/ai/hooks/useAISuggestion.tsx` (MODIFIED)
4. ✅ `src/components/OllamaStatusBanner.tsx` (NEW)
5. ✅ `src/app/playground/[id]/page.tsx` (MODIFIED)
6. ✅ `OLLAMA_SETUP.md` (NEW)

## Conclusion

This implementation provides a robust, user-friendly way to handle Ollama availability. Users get clear feedback, the system prevents errors, and resources are used efficiently.
