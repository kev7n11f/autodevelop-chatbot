#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep '=' | grep -v '^[[:space:]]*$' | xargs)
  source .env
  set +a
fi

# GitHub configuration
# export GITHUB_TOKEN and other secrets are now loaded from .env

# Stripe credentials
# export STRIPE_SECRET_KEY and other secrets are now loaded from .env

# OpenAI key
# export OPENAI_API_KEY is now loaded from .env

# Optional: Heroku deployment
# export HEROKU_API_KEY and HEROKU_APP_NAME are now loaded from .env