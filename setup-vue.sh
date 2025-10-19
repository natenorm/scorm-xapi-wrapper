#!/bin/bash

# SCORM Vue Course Setup
# Usage: ./setup-vue.sh [course-name]

COURSE_NAME=${1:-my-vue-course}
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "💚 Creating Vue SCORM Course"
echo "📦 Course name: $COURSE_NAME"
echo ""

# Check if course folder already exists
if [ -d "../$COURSE_NAME" ]; then
  echo "❌ Error: Folder ../$COURSE_NAME already exists!"
  echo "   Choose a different name or delete the existing folder."
  exit 1
fi

# Copy template
echo "📋 Copying Vue starter template..."
cp -r "$SCRIPT_DIR/templates/vue-starter" "../$COURSE_NAME"

# Update package.json name
if [ -f "../$COURSE_NAME/package.json" ]; then
  cd "../$COURSE_NAME"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"name\": \"vue-scorm-course\"/\"name\": \"$COURSE_NAME\"/" package.json
  else
    sed -i "s/\"name\": \"vue-scorm-course\"/\"name\": \"$COURSE_NAME\"/" package.json
  fi
  cd - > /dev/null
fi

echo "✅ Vue course created successfully!"
echo ""
echo "📍 Location: ../$COURSE_NAME"
echo "💚 Template: Vue 3 + Vite"
echo ""
echo "Next steps:"
echo "  cd ../$COURSE_NAME"
echo "  npm install"
echo "  npm run dev        # Opens at http://localhost:5173"
echo ""
echo "🚀 Happy course building!"

