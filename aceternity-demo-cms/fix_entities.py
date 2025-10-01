#!/usr/bin/env python3
import re
import sys

def fix_jsx_entities(content):
    """Fix unescaped entities in JSX strings"""
    lines = content.split('\n')
    result = []

    for line in lines:
        # Skip if line is already an import or contains code patterns
        if any(skip in line for skip in ['import ', 'from ', 'export ', 'const ', 'let ', 'var ', 'function ', '=> {', 'className=']):
            # Fix only within string literals for these lines
            # Look for strings within quotes that need fixing
            fixed_line = line
            # Fix apostrophes in JSX text (not in attributes)
            if '>' in line and '<' in line:
                # This is JSX content
                # Find text between > and <
                parts = re.split(r'(<[^>]+>)', fixed_line)
                for i, part in enumerate(parts):
                    if not part.startswith('<'):
                        # This is text content, fix entities
                        part = part.replace("'", "&apos;")
                        part = part.replace('"', "&quot;")
                        parts[i] = part
                fixed_line = ''.join(parts)
            result.append(fixed_line)
        else:
            # Fix apostrophes and quotes in regular JSX text
            fixed_line = line
            if '>' in line and '<' in line and 'className' not in line:
                # Replace apostrophes not in attributes
                parts = re.split(r'(<[^>]+>)', fixed_line)
                for i, part in enumerate(parts):
                    if not part.startswith('<'):
                        part = part.replace("'", "&apos;")
                        # Handle quotes carefully
                        if '"' in part and not part.strip().startswith('"'):
                            part = part.replace('"', "&quot;")
                        parts[i] = part
                fixed_line = ''.join(parts)
            result.append(fixed_line)

    return '\n'.join(result)

if __name__ == '__main__':
    file_path = sys.argv[1]
    with open(file_path, 'r') as f:
        content = f.read()

    fixed_content = fix_jsx_entities(content)

    with open(file_path, 'w') as f:
        f.write(fixed_content)

    print(f"Fixed entities in {file_path}")
