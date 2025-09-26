#!/usr/bin/env python3
"""
Script to fix frontmatter in markdown files.
Converts 'date:' to 'pubDatetime:' and adds missing 'description' field.
"""

import os
import re
import glob
from datetime import datetime

def fix_frontmatter(file_path):
    """Fix frontmatter in a single markdown file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split content into lines
    lines = content.split('\n')

    # Find the YAML frontmatter boundaries
    if not lines or lines[0].strip() != '---':
        print(f"Skipping {file_path}: no frontmatter found")
        return False

    # Find end of frontmatter
    end_marker = -1
    for i, line in enumerate(lines[1:], 1):
        if line.strip() == '---':
            end_marker = i
            break

    if end_marker == -1:
        print(f"Skipping {file_path}: invalid frontmatter")
        return False

    # Extract frontmatter
    frontmatter_lines = lines[1:end_marker]
    body_lines = lines[end_marker+1:]

    # Check what needs to be fixed
    changes_made = False
    has_date = False
    has_pubdatetime = False
    has_description = False
    has_title = False

    new_frontmatter_lines = []

    for line in frontmatter_lines:
        if line.startswith('date:'):
            # Convert date: to pubDatetime:
            date_value = line[5:].strip()
            new_frontmatter_lines.append(f'pubDatetime: {date_value}')
            has_date = True
            changes_made = True
        elif line.startswith('pubDatetime:'):
            new_frontmatter_lines.append(line)
            has_pubdatetime = True
        elif line.startswith('description:'):
            new_frontmatter_lines.append(line)
            has_description = True
        elif line.startswith('title:'):
            new_frontmatter_lines.append(line)
            has_title = True
            title_value = line[6:].strip()
        else:
            new_frontmatter_lines.append(line)

    # Add description if missing
    if not has_description:
        if has_title:
            # Generate description from title
            title_clean = title_value.strip('"').strip("'")
            description = f"关于{title_clean}的详细笔记和总结"
        else:
            # Use filename as fallback
            filename = os.path.basename(file_path)
            filename_clean = filename.replace('.md', '').replace('-', ' ')
            description = f"关于{filename_clean}的详细笔记和总结"

        # Find position to insert description (after title if exists)
        insert_pos = 0
        for i, line in enumerate(new_frontmatter_lines):
            if line.startswith('title:'):
                insert_pos = i + 1
                break

        new_frontmatter_lines.insert(insert_pos, f"description: {description}")
        changes_made = True

    # If there was date field but no pubDatetime, we already converted it
    # If there was no date field at all, we need to add pubDatetime
    if not has_date and not has_pubdatetime:
        # Add a default datetime (use current time)
        current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        new_frontmatter_lines.insert(0, f"pubDatetime: {current_datetime}")
        changes_made = True

    # Write back the file if changes were made
    if changes_made:
        new_content = "---\n" + "\n".join(new_frontmatter_lines) + "\n---\n" + "\n".join(body_lines)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {file_path}")
        return True

    return False

def main():
    """Fix all markdown files in the blog directory."""
    blog_dir = "src/data/blog"
    pattern = os.path.join(blog_dir, "**", "*.md")

    files_to_fix = glob.glob(pattern, recursive=True)
    print(f"Found {len(files_to_fix)} markdown files to check")

    fixed_count = 0
    for file_path in files_to_fix:
        try:
            if fix_frontmatter(file_path):
                fixed_count += 1
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    print(f"Fixed {fixed_count} files")

if __name__ == "__main__":
    main()