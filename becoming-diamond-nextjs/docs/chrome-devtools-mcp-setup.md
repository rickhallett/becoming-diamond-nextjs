# Chrome DevTools MCP Server Setup

## Installation Complete

**Date**: 2025-12-20
**Status**: Installed, requires restart to activate

## What Was Installed

The official Chrome DevTools MCP server from Google Chrome team has been successfully installed and configured in your Claude Code environment.

## Installation Command Used

```bash
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
```

## Configuration Details

**Location**: `~/.claude.json`

**Configuration**:
```json
{
  "chrome-devtools": {
    "type": "stdio",
    "command": "npx",
    "args": [
      "chrome-devtools-mcp@latest"
    ],
    "env": {}
  }
}
```

## Capabilities

Once activated (after restart), the MCP server provides the following browser debugging capabilities:

### Network Monitoring
- Real-time network request inspection
- Full request/response headers
- Timing information for each request
- Cookie tracking across requests

### Browser Control
- Launch and control Chrome browser instances
- Navigate to URLs programmatically
- Execute JavaScript in page context
- Take screenshots at any point

### Session & State Inspection
- Inspect cookies and session storage
- View local storage contents
- Monitor authentication state
- Track session lifecycle

### Debugging
- Capture console errors and warnings
- Monitor JavaScript execution
- Inspect DOM elements
- Track redirects with full context

### Performance Analysis
- Record performance traces
- Extract actionable performance insights
- Analyze page load timing

## Activation Steps

### 1. Restart Claude Code

The MCP server requires a Claude Code restart to become active:

```bash
# Exit current Claude Code session
# Restart Claude Code in this directory
cd /home/mrkai/code/becoming-diamond-nextjs/becoming-diamond-nextjs
claude code
```

### 2. Verify MCP Server is Active

After restart, Claude will have access to Chrome DevTools tools for browser control and inspection.

## Use Case: Debug Production OAuth Flow

### Current Production Issue

**Problem**: Google OAuth fails on production but works locally
- Redirects to: `https://www.becomingdiamond.com/auth/signin?callbackUrl=https%3A%2F%2Fwww.becomingdiamond.com%2Fapp%2Fprofile`
- Never shows Google consent screen
- Works perfectly on localhost

**Root Cause Hypothesis**: Corrupted session cookie causing middleware to think user is authenticated, triggering immediate redirect away from signin page before OAuth can initiate.

### Debug Plan Using Chrome DevTools MCP

Once MCP server is active, the debugging workflow will be:

1. **Launch Controlled Browser**
   - Open Chrome via MCP server
   - Navigate to production signin page
   - Inspect initial cookie state

2. **Monitor OAuth Initiation**
   - Click "Sign in with Google" button
   - Capture all network requests
   - Track redirects with full headers
   - Verify OAuth URL construction

3. **Inspect Session State**
   - Check all cookies set on the domain
   - Verify `__Secure-authjs.session-token` cookie
   - Inspect any corrupted or expired session data

4. **Capture Middleware Behavior**
   - Monitor redirect responses
   - Check middleware authorization logic execution
   - Verify callback URL parameters

5. **Document Exact Failure Point**
   - Screenshot each step
   - Log all network activity
   - Identify where OAuth flow breaks

### Expected Findings

The MCP server will help identify:
- Whether corrupted session cookie exists
- Exact point where redirect loop occurs
- Any JavaScript errors in console
- Network failures or timeout issues
- Middleware behavior in production environment

## Technical Background

### What is MCP?

Model Context Protocol (MCP) is an open-source standard for connecting large language models (LLMs) to external tools and data sources.

### How Chrome DevTools MCP Works

The server uses Chrome DevTools Protocol (CDP) to control the browser - the same low-level commands that DevTools or automation frameworks use. It provides AI assistants with the ability to:
- Inspect DOM elements
- Intercept network requests
- Execute JavaScript in page context
- Monitor console output
- Capture performance metrics

### Requirements

- **Node.js**: 22 or newer
- **Chrome Browser**: Current version (stable, canary, beta, or dev)
- **Claude Code**: Latest version

## Advanced Configuration Options

If you need to customize the MCP server behavior, edit `~/.claude.json`:

```json
{
  "chrome-devtools": {
    "type": "stdio",
    "command": "npx",
    "args": [
      "chrome-devtools-mcp@latest",
      "--channel=stable",        // Chrome channel: stable, canary, beta, dev
      "--headless=false",         // Run with visible browser (true for headless)
      "--isolated=true"           // Use temporary user data directory
    ],
    "env": {}
  }
}
```

### Configuration Parameters

- `--channel`: Specify Chrome channel (`stable`, `canary`, `beta`, `dev`)
- `--headless`: Run in headless mode (`true` or `false`)
- `--isolated`: Use temporary user data directory (`true` or `false`)
- `--browser-url`: Connect to existing Chrome instance
- `--executable-path`: Path to custom Chrome executable

## Resources

### Official Documentation
- [Chrome DevTools MCP Blog Post](https://developer.chrome.com/blog/chrome-devtools-mcp)
- [GitHub Repository](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [NPM Package](https://www.npmjs.com/package/chrome-devtools-mcp)

### Additional Reading
- [Google AI Announcement](https://www.marktechpost.com/2025/09/23/google-ai-introduces-the-public-preview-of-chrome-devtools-mcp-making-your-coding-agent-control-and-inspect-a-live-chrome-browser/)
- [Chrome DevTools MCP: Complete Guide 2025](https://vladimirsiedykh.com/blog/chrome-devtools-mcp-ai-browser-debugging-complete-guide-2025)
- [Bridging AI Assistants with Browser Reality](https://orchestrator.dev/blog/2025-12-13-chrome-devtools-mcp-article/)

## Troubleshooting

### MCP Server Not Loading

If the MCP server doesn't appear after restart:

1. Check configuration syntax in `~/.claude.json`
2. Verify Node.js version: `node --version` (must be 22+)
3. Test npx can run the server: `npx chrome-devtools-mcp@latest --help`
4. Check Claude Code logs for MCP errors

### Chrome Not Launching

If Chrome fails to launch via MCP:

1. Verify Chrome is installed and in PATH
2. Try specifying explicit channel: `--channel=stable`
3. Use custom executable path if needed
4. Check for Chrome processes blocking port access

### Permission Issues

If encountering permission errors:

1. Ensure Chrome has necessary permissions
2. Check firewall rules for localhost connections
3. Verify user data directory is writable

## Next Steps After Restart

1. Restart Claude Code in this project directory
2. Confirm Chrome DevTools MCP server is active
3. Request OAuth flow debugging using browser monitoring
4. Analyze captured data to identify root cause
5. Implement fix based on findings
6. Verify fix in production

## Related Documentation

- `/docs/specs/` - Feature specifications
- `/docs/guides/` - Developer guides
- `/README.md` - Environment setup
- `/CLAUDE.md` - Architecture documentation
