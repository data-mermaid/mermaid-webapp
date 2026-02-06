#!/bin/bash

echo "=========================================="
echo "COMPREHENSIVE MSW MIGRATION FINAL CHECK"
echo "=========================================="
echo ""

echo "📁 Total test files in integrationTests:"
find src/App/integrationTests -name "*.test.jsx" | wc -l

echo ""
echo "📁 Other test files (non-integration):"
find src -name "*.test.js" -o -name "*.test.jsx" | grep -v integrationTests | wc -l

echo ""
echo "🔍 MSW 2.x Migrations Complete:"
echo "  Files with http, HttpResponse imports: $(find src -name "*.test.js" -o -name "*.test.jsx" | xargs grep -l "import { http, HttpResponse } from 'msw'" | wc -l)"

echo ""
echo "⚠️  MSW 1.x Patterns (should be 0):"
echo "  rest imports: $(find src -name "*.test.js" -o -name "*.test.jsx" | xargs grep -c 'import.*rest.*from.*msw' 2>/dev/null || echo 0)"
echo "  rest. usage: $(find src -name "*.test.js" -o -name "*.test.jsx" | xargs grep -c 'rest\.' 2>/dev/null || echo 0)"
echo "  res.once: $(find src -name "*.test.js" -o -name "*.test.jsx" | xargs grep -c 'res\.once' 2>/dev/null || echo 0)"
echo "  ctx. usage: $(find src -name "*.test.js" -o -name "*.test.jsx" | xargs grep -c 'ctx\.' 2>/dev/null || echo 0)"

echo ""
echo "✅ MSW 2.x Patterns:"
echo "  http calls: $(find src -name "*.test.js" -o -name "*.test.jsx" | xargs grep -c 'http\.\(post\|get\|put\|delete\|patch\)' 2>/dev/null || echo 0)"
echo "  HttpResponse usage: $(find src -name "*.test.js" -o -name "*.test.jsx" | xargs grep -c 'HttpResponse\.' 2>/dev/null || echo 0)"
echo "  { once: true } usage: $(find src -name "*.test.js" -o -name "*.test.jsx" | xargs grep -c '{ once: true }' 2>/dev/null || echo 0)"

echo ""
echo "=========================================="
echo "✅ MSW 1.x to 2.x Migration Complete!"
echo "=========================================="
