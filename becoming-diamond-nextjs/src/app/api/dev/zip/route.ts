import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 60; // Allow up to 60 seconds for AI processing

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const searchParams = request.nextUrl.searchParams;
    const authParam = searchParams.get('whoistheboss');

    if (authParam !== 'iamtheboss') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check for AI processing mode
    const aiMode = searchParams.get('ai') === 'true';

    // Get repository root (project root) or subdirectory for AI mode
    const repoRoot = process.cwd();
    const workingDir = aiMode ? join(repoRoot, 'src/app/app') : repoRoot;

    // Check for required files
    const configPath = join(repoRoot, 'repomix.config.json');
    const ignorePath = join(repoRoot, '.repomixignore');
    const outputPath = join(repoRoot, 'repomix-output.xml');

    if (!existsSync(configPath)) {
      return NextResponse.json(
        { error: 'repomix.config.json not found in repository root' },
        { status: 400 }
      );
    }

    if (!existsSync(ignorePath)) {
      return NextResponse.json(
        { error: '.repomixignore not found in repository root' },
        { status: 400 }
      );
    }

    // Run repomix synchronously from the appropriate directory
    try {
      execSync('repomix', {
        cwd: workingDir,
        stdio: 'inherit',
        encoding: 'utf-8'
      });
    } catch (execError) {
      return NextResponse.json(
        {
          error: 'Failed to execute repomix',
          details: execError instanceof Error ? execError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Determine output path based on working directory
    const actualOutputPath = aiMode ? join(workingDir, 'repomix-output.xml') : outputPath;

    // Check if output file was created
    if (!existsSync(actualOutputPath)) {
      return NextResponse.json(
        { error: 'repomix-output.xml was not generated' },
        { status: 500 }
      );
    }

    // Read the XML file
    const xmlContent = readFileSync(actualOutputPath, 'utf-8');

    // If AI mode, process with Claude
    if (aiMode) {
      try {
        const exampleFormat = `# Website Copy for Editing

## Page Title (/route)

### Section Name
**Element Type:**
> Content here

**List Items:**
1. Item one
2. Item two

**CTA Buttons:**
- Button text

---

Continue with all pages and sections...`;

        const message = await anthropic.messages.create({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 16000,
          system: `You are a technical content extractor. Your task is to analyze Next.js page files and extract ALL user-facing copy (text content) into a clean, organized markdown document.

Extract and organize:
- Page titles and headings
- All text content (paragraphs, lists, labels)
- Button text and CTAs
- Placeholder text
- Form labels and helper text
- Status messages
- Metadata (titles, descriptions)

Format the output as structured markdown following this pattern:
${exampleFormat}

Be thorough - include EVERYTHING a user would see. Organize by page route, then by section, then by UI element type.`,
          messages: [
            {
              role: 'user',
              content: `Extract all user-facing copy from these Next.js page files and format as structured markdown:\n\n${xmlContent}`
            }
          ],
        });

        const extractedCopy = message.content[0].type === 'text' ? message.content[0].text : '';

        // Return markdown with proper headers
        return new NextResponse(extractedCopy, {
          status: 200,
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Content-Disposition': 'inline; filename="website-copy.md"',
          },
        });
      } catch (aiError) {
        return NextResponse.json(
          {
            error: 'Failed to process with AI',
            details: aiError instanceof Error ? aiError.message : 'Unknown error'
          },
          { status: 500 }
        );
      }
    }

    // Standard XML mode - wrap content in proper XML root elements for browser parsing
    const wrappedXml = `<?xml version="1.0" encoding="UTF-8"?>\n<repository>\n${xmlContent}\n</repository>`;

    // Return XML with proper headers
    return new NextResponse(wrappedXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Disposition': 'inline; filename="repomix-output.xml"',
      },
    });

  } catch (error) {
    console.error('Error in /api/dev/zip:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
