import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST() {
  try {
    // Run the Python test script
    const { stdout, stderr } = await execAsync("python scripts/deepeval_tests.py", {
      env: { ...process.env },
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    })

    if (stderr && !stderr.includes("WARNING")) {
      console.error("[v0] Test stderr:", stderr)
    }

    // Parse the JSON output from the Python script
    const results = JSON.parse(stdout)

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("[v0] Error running tests:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to run tests",
        results: [],
        summary: { total: 0, passed: 0, failed: 0 },
      },
      { status: 500 },
    )
  }
}
