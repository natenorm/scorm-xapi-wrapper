#!/bin/bash

# SCORM Course Setup Script
# Usage: ./setup-course.sh [course-name] [template]

COURSE_NAME=${1:-my-first-course}
TEMPLATE=${2:-vanilla}
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🎓 Creating SCORM Course: $COURSE_NAME"
echo "📋 Using template: $TEMPLATE-starter"
echo ""

# Check if course folder already exists
if [ -d "../$COURSE_NAME" ]; then
  echo "❌ Error: Folder ../$COURSE_NAME already exists!"
  echo "   Choose a different name or delete the existing folder."
  exit 1
fi

# Check if template exists
if [ ! -d "$SCRIPT_DIR/templates/${TEMPLATE}-starter" ]; then
  echo "❌ Error: Template '$TEMPLATE-starter' not found!"
  echo ""
  echo "Available templates:"
  echo "  - vanilla (HTML/CSS/JS)"
  echo "  - react (React + Vite)"
  echo "  - vue (Vue + Vite)"
  exit 1
fi

# Copy template
echo "📦 Copying template files..."
cp -r "$SCRIPT_DIR/templates/${TEMPLATE}-starter" "../$COURSE_NAME"

# Update package.json name
if [ -f "../$COURSE_NAME/package.json" ]; then
  cd "../$COURSE_NAME"
  # Use sed to replace the package name
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"name\": \".*\"/\"name\": \"$COURSE_NAME\"/" package.json
  else
    # Linux
    sed -i "s/\"name\": \".*\"/\"name\": \"$COURSE_NAME\"/" package.json
  fi
  cd - > /dev/null
fi

echo "✅ Course created successfully!"
echo ""
echo "📍 Location: ../$COURSE_NAME"
echo ""
echo "Next steps:"
echo "  cd ../$COURSE_NAME"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "🚀 Happy course building!"

