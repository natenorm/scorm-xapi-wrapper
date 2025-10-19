#!/bin/bash

# SCORM Vanilla JavaScript Course Setup
# Usage: ./setup-vanilla.sh [course-name]

COURSE_NAME=${1:-my-vanilla-course}
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🎓 Creating Vanilla JavaScript SCORM Course"
echo "📦 Course name: $COURSE_NAME"
echo ""

# Check if course folder already exists
if [ -d "../$COURSE_NAME" ]; then
  echo "❌ Error: Folder ../$COURSE_NAME already exists!"
  echo "   Choose a different name or delete the existing folder."
  exit 1
fi

# Copy template
echo "📋 Copying vanilla starter template..."
cp -r "$SCRIPT_DIR/templates/vanilla-starter" "../$COURSE_NAME"

# Update package.json name
if [ -f "../$COURSE_NAME/package.json" ]; then
  cd "../$COURSE_NAME"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"name\": \"vanilla-scorm-course\"/\"name\": \"$COURSE_NAME\"/" package.json
  else
    sed -i "s/\"name\": \"vanilla-scorm-course\"/\"name\": \"$COURSE_NAME\"/" package.json
  fi
  cd - > /dev/null
fi

echo "✅ Vanilla course created successfully!"
echo ""
echo "📍 Location: ../$COURSE_NAME"
echo "📦 Template: Plain HTML/CSS/JavaScript"
echo ""
echo "Next steps:"
echo "  cd ../$COURSE_NAME"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "🚀 Happy course building!"

