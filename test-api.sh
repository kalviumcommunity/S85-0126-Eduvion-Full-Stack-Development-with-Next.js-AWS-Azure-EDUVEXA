#!/bin/bash

echo "=== Testing Zod Validation API ==="
echo ""

echo "✅ TEST 1: Passing Test - Valid User Data"
echo "Testing with: name=Alice, email=alice@example.com, age=25"
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","age":25}' \
  --silent | jq .
echo ""
echo ""

echo "❌ TEST 2: Failing Test - Invalid Name (Too Short)"
echo "Testing with: name=A (too short), email=alice@example.com, age=25"
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"alice@example.com","age":25}' \
  --silent | jq .
echo ""
echo ""

echo "❌ TEST 3: Failing Test - Invalid Email"
echo "Testing with: name=Bob, email=bademail (invalid), age=25"
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","email":"bademail","age":25}' \
  --silent | jq .
echo ""
echo ""

echo "❌ TEST 4: Failing Test - Age Below 18"
echo "Testing with: name=Charlie, email=charlie@example.com, age=15"
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Charlie","email":"charlie@example.com","age":15}' \
  --silent | jq .
echo ""
echo ""

echo "❌ TEST 5: Failing Test - Missing Fields"
echo "Testing with: Only name provided"
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"David"}' \
  --silent | jq .
echo ""
echo ""

echo "✅ TEST 6: GET endpoint - Retrieve users"
echo "Testing GET /api/users"
curl -X GET "http://localhost:3000/api/users?page=1&limit=2" \
  --silent | jq .
