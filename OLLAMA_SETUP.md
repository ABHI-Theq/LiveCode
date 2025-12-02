# Ollama Setup for AI Code Suggestions

This project uses **Ollama** to provide AI-powered code suggestions in the playground editor.

## What is Ollama?

Ollama is a local AI model runner that allows you to run large language models on your machine without sending data to external services.

## Installation

### 1. Install Ollama

Visit [https://ollama.ai](https://ollama.ai) and download Ollama for your operating system:

- **Windows**: Download and run the installer
- **macOS**: `brew install ollama` or download from website
- **Linux**: `curl -fsSL https://ollama.ai/install.sh | sh`

### 2. Pull the CodeLlama Model

After installing Ollama, open a terminal and run:

```bash
ollama pull codellama:latest
```

This will download the CodeLlama model (approximately 3.8GB).

### 3. Verify Ollama is Running

Check if Ollama is running:

```bash
ollama list
```

You should see `codellama:latest` in the list.

## How It Works

1. **Automatic Detection**: The app automatically checks if Ollama is running when you open the playground
2. **Warning Banner**: If Ollama is not available, a yellow warning banner appears
3. **Auto-Disable**: AI suggestions are automatically disabled if Ollama is not running
4. **Manual Toggle**: You can manually enable/disable AI suggestions using the toggle button

## Features

- ✅ Automatic Ollama availability checking
- ✅ Visual warning when Ollama is not available
- ✅ Auto-disable AI when Ollama is down
- ✅ Prevents unnecessary API calls
- ✅ Periodic health checks (every 30 seconds)

## Troubleshooting

### Ollama Not Detected

1. **Check if Ollama is running**:
   ```bash
   curl http://127.0.0.1:11434/api/tags
   ```

2. **Start Ollama** (if not running):
   ```bash
   ollama serve
   ```

3. **Verify the model is installed**:
   ```bash
   ollama list
   ```

### Port Issues

Ollama runs on port `11434` by default. If you need to change this:

1. Update the port in `src/lib/ollama-checker.ts`
2. Update the port in `src/app/api/code-suggestion/route.ts`

## API Endpoints

- **Ollama Health Check**: `GET http://127.0.0.1:11434/api/tags`
- **Code Suggestion**: `POST /api/code-suggestion`

## Configuration

The Ollama configuration is located in:
- `src/lib/ollama-checker.ts` - Availability checking logic
- `src/app/api/code-suggestion/route.ts` - AI generation endpoint
- `src/components/OllamaStatusBanner.tsx` - Status banner UI

## Model Options

You can use different models by changing the model name in `src/app/api/code-suggestion/route.ts`:

```typescript
model: "codellama:latest"  // Change to your preferred model
```

Available code models:
- `codellama:latest` (recommended)
- `codellama:7b`
- `codellama:13b`
- `codellama:34b`

## Performance

- **First Request**: May take 2-5 seconds (model loading)
- **Subsequent Requests**: Usually < 1 second
- **Memory Usage**: ~4-8GB RAM depending on model size
