import { useState, useEffect, useCallback } from "react";
interface AISuggestionState {
    suggestion: string | null,
    isLoading: boolean,
    position: { line: number, column: number } | null,
    decoration: string[],
    isEnabled: boolean
}

interface UseAISuggestionReturn extends AISuggestionState {
    toggleEnabled: () => void;
    fetchSuggestion: (type: string, editor: any) => Promise<void>;
    acceptSuggestion: (editor: any, monaco: any) => void;
    rejectSuggestion: (editor: any) => any;
    clearSuggestion: (editor: any) => void;
}

export const useAISuggestion = (): UseAISuggestionReturn => {
    const [state, setState] = useState<AISuggestionState>({
        suggestion: null,
        isLoading: false,
        position: null,
        decoration: [],
        isEnabled: true
    });

    const toggleEnabled = useCallback(() => {
        setState(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
    }, []);

    const fetchSuggestion = useCallback(async (type: string, editor: any) => {
        setState((currentState) => {
            if (!currentState.isEnabled) {
                console.log("AI Suggestions is Disabled");
                return currentState
            };
            if (!editor) {
                console.log("Editor is not available");
                return currentState
            }

            const model = editor.getModel();
            const cursorPosition = editor.getPosition();

            if (!model || !cursorPosition) {
                console.warn("Editor model or cursor position is not available.");
                return currentState;
            }

            const newState = { ...currentState, isLoading: true };

            (async () => {
                try {

                    const payload = {
                        fileContent: model.getValue(),
                        cursorLine: cursorPosition.lineNumber - 1,
                        cursorColumn: cursorPosition.column - 1,
                        suggestionType: type
                    }
                    console.log("Request Payload: ", payload);

                    const res = await fetch("/api/code-suggestion", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    })

                    if (!res.ok) {
                        throw new Error(`API request failed with status ${res.status}`);
                    }

                    const data = await res.json();

                    if (data.suggestion) {
                        const suggestionText = data.suggestion.trim();
                        setState((prev) => ({
                            ...prev,
                            suggestion: suggestionText,
                            position: {
                                line: cursorPosition.lineNumber,
                                column: cursorPosition.column
                            },
                            isLoading: false
                        }))
                    } else {
                        console.log("No suggestions Received");
                        setState((prev) => ({ ...prev, isLoading: false }))

                    }

                } catch (error) {
                    console.error("Error fetching code suggestion:", error);
                    setState((prev) => ({ ...prev, isLoading: false }));
                }
            })()


            return newState


        })
    }, []);

    const acceptSuggestion = useCallback(
        (editor: any, monaco: any) => {
            setState((currentState) => {
                if (!currentState.suggestion || !currentState.position || !editor || !monaco) {
                    return currentState;
                }

                const { line, column } = currentState.position;
                const sanitizedSuggestion = currentState.suggestion.replace(/^\d+:\s*/gm, "");

                editor.executeEdits("", [
                    {
                        range: new monaco.Range(line, column, line, column),
                        text: sanitizedSuggestion,
                        forceMoveMarkers: true,
                    },
                ]);

                // Clear decorations
                if (editor && currentState.decoration.length > 0) {
                    editor.deltaDecorations(currentState.decoration, []);
                }

                return {
                    ...currentState,
                    suggestion: null,
                    position: null,
                    decoration: [],
                };
            });
        },
        []);


    const rejectSuggestion = useCallback((editor: any) => {
        setState((currentState) => {
            if (editor && currentState.decoration.length > 0) {
                editor.deltaDecorations(currentState.decoration, []);
            }
            return {
                ...currentState,
                suggestion: null,
                position: null,
                decoration: [],
            };
        });
    }, []);

    const clearSuggestion = useCallback((editor: any) => {
        setState((currentState) => {
            if (editor && currentState.decoration.length > 0) {
                editor.deltaDecorations(currentState.decoration, []);
            }
            return {
                ...currentState,
                suggestion: null,
                position: null,
                decoration: [],
            };
        });
    }, []);

    return {
        ...state,
        toggleEnabled,
        fetchSuggestion,
        acceptSuggestion,
        rejectSuggestion,
        clearSuggestion
    };
}
