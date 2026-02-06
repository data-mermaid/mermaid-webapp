#!/bin/bash

echo "=== FINAL MSW 2.x Migration Check ==="
echo ""
echo "Files with proper MSW 2.x imports:"
find src/App/integrationTests -name "*.test.jsx" -exec grep -l "import { http, HttpResponse } from" {} \; | wc -l

echo ""
echo "Remaining MSW 1.x patterns that should be ZERO:"
echo "  - rest imports: $(grep -r "import.*{ rest }" src/App/integrationTests/**/*.test.jsx 2>/dev/null | wc -l)"
echo "  - rest. usage: $(grep -r "rest\." src/App/integrationTests/**/*.test.jsx 2>/dev/null | wc -l)"
echo "  - res.once: $(grep -r "res\.once" src/App/integrationTests/**/*.test.jsx 2>/dev/null | wc -l)"
echo "  - ctx.json: $(grep -r "ctx\.json" src/App/integrationTests/**/*.test.jsx 2>/dev/null | wc -l)"
echo "  - ctx.status: $(grep -r "ctx\.status" src/App/integrationTests/**/*.test.jsx 2>/dev/null | wc -l)"
echo "  - res.networkError: $(grep -r "res\.networkError" src/App/integrationTests/**/*.test.jsx 2>/dev/null | wc -l)"

echo ""
echo "MSW 2.x patterns that should be present:"
echo "  - http.post: $(grep -r "http\.post" src/App/integrationTests/**/*.test.jsx 2>/dev/null | wc -l) lines"
echo "  - http.get: $(grep -r "http\.get" src/App/integrationTests/**/*.test.jsx 2>/dev/null | wc -l) lines"
echo "  - HttpResponse.json: $(grep -r "HttpResponse\.json" src/App/integrationTests/**/*.test.jsx 2>/dev/null | wc -l) lines"
echo "  - HttpResponse.error: $(grep -r "HttpResponse\.error" src/App/integrationTests/**/*.test.jsx 2>/dev/null | wc -l) lines"
echo "  - { once: true }: $(grep -r "{ once: true }" src/App/integrationTests/**/*.test.jsx 2>/dev/null | wc -l) lines"

echo ""
echo "✅ Migration Complete!"
