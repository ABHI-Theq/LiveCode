import { metadata } from "@/app/layout";
import { type NextRequest, NextResponse } from "next/server";
import { extname } from "path";


interface CodeSuggestionRequest {
    fileContent: string,
    cursorLine: number,
    cursorColumn: number,
    suggestionType: string,
    fileName?: string
}

interface CodeContext {
    language: string
    framework: string
    beforeContext: string
    currentLine: string
    afterContext: string
    cursorPosition: { line: number; column: number }
    isInFunction: boolean
    isInClass: boolean
    isAfterComment: boolean
    incompletePatterns: string[]
}


export async function POST(req: NextRequest) {

    const data: CodeSuggestionRequest = await req.json();
    try {
        const { fileContent, cursorLine, cursorColumn, suggestionType, fileName } = data;
        if (!fileContent || cursorLine < 0 || !suggestionType) {
            return NextResponse.json({ success: false, error: "Invalid Input Paramters" }, {
                status: 400
            })
        }

        const context = analyzeContext(fileContent, cursorLine, cursorColumn, fileName);

        //build Prompt

        const prompt = buildPrompt(context, suggestionType);

        //calling AI SERVICE

        const suggestion = generateSuggestion(prompt)

        return NextResponse.json({
            suggestion,
            context,
            metadata: {
                language: context.language,
                framework: context.framework,
                position: context.cursorPosition,
                generatedAt: new Date().toISOString()
            }
        })

    } catch (error) {
        console.error("Context analysis error:", error)
        return NextResponse.json({ error: "Internal server error", message: error instanceof Error ? error.message : "Some internal error occured" }, { status: 500 })
    }
}

function analyzeContext(fileContent: string, cursorLine: number, cursorColumn: number, fileName?: string):CodeContext {
    const lines = fileContent.split('\n')
    const currentLine = lines[cursorLine] || ''

    //context radius marking
    const contextRadius = 13;
    const startLine = Math.max(0, cursorLine - contextRadius)
    const endLine = Math.min(lines.length, cursorLine + contextRadius)

    const beforeContext = lines.slice(startLine, cursorLine).join("\n")
    const afterContext = lines.slice(cursorLine, endLine).join("\n")

    //detect language and framework
    const language = detectLanguage(fileContent, fileName)
    const framework = detectFramework(fileContent)

    //analyze code patterns
    const isInFunction=detectInFunction(lines,cursorLine)
    const isInClass=detectInClass(lines,cursorLine)
    const isAfterComment=detectAfterComment(currentLine,cursorColumn)
    const incompletePatterns=detectIncompletePatterns(currentLine,cursorColumn)

    return {
        language,
        framework,
        beforeContext,
        currentLine,
        afterContext,
        cursorPosition:{line:cursorLine,column:cursorColumn},
        isInFunction,
        isInClass,
        isAfterComment,
        incompletePatterns
    }
}



function buildPrompt(context: CodeContext, suggestionType: string): string {
    return `You are an expert code completion assistant. Generate a ${suggestionType} suggestion.
  
  Language: ${context.language}
  Framework: ${context.framework}
  
  Context:
  ${context.beforeContext}
  ${context.currentLine.substring(0, context.cursorPosition.column)}|CURSOR|${context.currentLine.substring(context.cursorPosition.column)}
  ${context.afterContext}
  
  Analysis:
  - In Function: ${context.isInFunction}
  - In Class: ${context.isInClass}
  - After Comment: ${context.isAfterComment}
  - Incomplete Patterns: ${context.incompletePatterns.join(", ") || "None"}
  
  Instructions:
  1. Provide only the code that should be inserted at the cursor
  2. Maintain proper indentation and style
  3. Follow ${context.language} best practices
  4. Make the suggestion contextually appropriate
  
  Generate suggestion:`
  }

async function generateSuggestion(prompt:string):Promise<string>{
    try {
        const response=await fetch("/http://localhost:11434/api/generate",{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({
                model:"codellama:latest",
                prompt,
                stream:false,
                options:{
                    temprature:0.7,
                    max_tokens:300
                }
            })
        })
        if(!response.ok){
            throw new Error(`AI service error: ${response.statusText}`)
        }
        const data=await response.json()
        let suggestion=data.response
        if (suggestion.includes("```")) {
            const codeMatch = suggestion.match(/```[\w]*\n?([\s\S]*?)```/)
            suggestion = codeMatch ? codeMatch[1].trim() : suggestion
          }
      
          // Remove cursor markers if present
          suggestion = suggestion.replace(/\|CURSOR\|/g, "").trim()
      
          return suggestion
    } catch (error) {
        console.error("AI generation error:", error)
        return "// AI suggestion unavailable"
      }   
    }   


function detectLanguage(content: string, fileName?: string) {
    if (fileName) {
        const ext = fileName.split('.')[1]?.toLowerCase()
        const extMap: Record<string, string> = {
            ts: "TypeScript",
            tsx: "TypeScript",
            js: "JavaScript",
            jsx: "JavaScript",
            py: "Python",
            java: "Java",
            go: "Go",
            rs: "Rust",
            php: "PHP",
        }

        if (ext && extMap[ext]) return extMap[ext];
    }

    if (content.includes('interface ') || content.includes(':string')) return "Typescript";
    if (content.includes("def ") || content.includes("import")) return "Python";
    if (content.includes("func ") || content.includes("package ")) return "Go";

    return "Javascript";
}

function detectFramework(content: string): string {
    if (content.includes("import React") || content.includes("useState")) return "React"
    if (content.includes("import Vue") || content.includes("<template>")) return "Vue"
    if (content.includes("@angular/") || content.includes("@Component")) return "Angular"
    if (content.includes("next/") || content.includes("getServerSideProps")) return "Next.js"
    return "None"
}


function detectInFunction(lines: string[], currentLine: number): boolean {
    for (let i = currentLine - 1; i >= 0; i--) {
      const line = lines[i]
      if (line?.match(/^\s*(function|def|const\s+\w+\s*=|let\s+\w+\s*=)/)) return true
      if (line?.match(/^\s*}/)) break
    }
    return false
  }
  
  function detectInClass(lines: string[], currentLine: number): boolean {
    for (let i = currentLine - 1; i >= 0; i--) {
      const line = lines[i]
      if (line?.match(/^\s*(class|interface)\s+/)) return true
    }
    return false
  }
  
  function detectAfterComment(line: string, column: number): boolean {
    const beforeCursor = line.substring(0, column)
    return /\/\/.*$/.test(beforeCursor) || /#.*$/.test(beforeCursor)
  }
  
  function detectIncompletePatterns(line: string, column: number): string[] {
    const beforeCursor = line.substring(0, column)
    const patterns: string[] = []
  
    if (/^\s*(if|while|for)\s*\($/.test(beforeCursor.trim())) patterns.push("conditional")
    if (/^\s*(function|def)\s*$/.test(beforeCursor.trim())) patterns.push("function")
    if (/\{\s*$/.test(beforeCursor)) patterns.push("object")
    if (/\[\s*$/.test(beforeCursor)) patterns.push("array")
    if (/=\s*$/.test(beforeCursor)) patterns.push("assignment")
    if (/\.\s*$/.test(beforeCursor)) patterns.push("method-call")
  
    return patterns
  }
  
  function getLastNonEmptyLine(lines: string[], currentLine: number): string {
    for (let i = currentLine - 1; i >= 0; i--) {
      const line = lines[i]
      if (line.trim() !== "") return line
    }
    return ""
  }