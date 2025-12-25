"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Loader2 } from "lucide-react"
import { TestResultDisplay } from "@/components/test-result-display"

export default function Home() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runTests = async () => {
    setIsRunning(true)
    setResults(null)

    try {
      const response = await fetch("/api/run-tests", {
        method: "POST",
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("[v0] Error running tests:", error)
      setResults({ error: "Failed to run tests" })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">DeepEval Test Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">LLM Chatbot Evaluation Suite</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-foreground">Test Suite</h2>
            <p className="text-sm text-muted-foreground">Run evaluation tests on your LLM chatbot</p>
          </div>
          <Button onClick={runTests} disabled={isRunning} className="gap-2">
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running Tests
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>
        </div>

        {results && <TestResultDisplay results={results} />}

        {!results && !isRunning && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Ready to Test</CardTitle>
              <CardDescription>
                Click "Run All Tests" to evaluate your LLM chatbot across multiple criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Correctness</p>
                    <p className="text-xs text-muted-foreground">
                      Validates accurate responses to mathematical queries
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Helpfulness</p>
                    <p className="text-xs text-muted-foreground">Measures how useful and actionable responses are</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Tone</p>
                    <p className="text-xs text-muted-foreground">Ensures friendly and professional communication</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Conciseness</p>
                    <p className="text-xs text-muted-foreground">Checks for clear and brief responses</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
