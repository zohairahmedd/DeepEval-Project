import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TestResult {
  name: string
  passed: boolean
  score: number
  threshold: number
  input: string
  expected: string
  actual: string
}

interface TestResultDisplayProps {
  results: {
    success: boolean
    results: TestResult[]
    summary: {
      total: number
      passed: number
      failed: number
    }
    error?: string
  }
}

export function TestResultDisplay({ results }: TestResultDisplayProps) {
  if (results.error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-base">Test Execution Failed</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{results.error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-semibold text-foreground">{results.summary.total}</div>
            <p className="text-sm text-muted-foreground">Total Tests</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-semibold text-green-500">{results.summary.passed}</div>
            <p className="text-sm text-muted-foreground">Passed</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-semibold text-destructive">{results.summary.failed}</div>
            <p className="text-sm text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {results.results.map((result, index) => (
          <Card
            key={index}
            className={cn(
              "border",
              result.passed ? "border-green-500/20 bg-green-500/5" : "border-destructive/20 bg-destructive/5",
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <CardTitle className="text-base">{result.name}</CardTitle>
                    <CardDescription>
                      Score: {(result.score * 100).toFixed(0)}% (Threshold: {(result.threshold * 100).toFixed(0)}%)
                    </CardDescription>
                  </div>
                </div>
                <div
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-medium",
                    result.passed ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive",
                  )}
                >
                  {result.passed ? "PASS" : "FAIL"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Input</p>
                <p className="text-sm text-foreground">{result.input}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Expected Output</p>
                  <p className="text-sm text-foreground">{result.expected}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Actual Output</p>
                  <p className="text-sm text-foreground">{result.actual}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
