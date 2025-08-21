#!/bin/bash
cd /home/kavia/workspace/code-generation/fitness-website-for-all-92279-92406/FitnessWebsiteForAllMonolith
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

