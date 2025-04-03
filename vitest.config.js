import dotenv from 'dotenv'
import { defineConfig } from 'vitest/config'

dotenv.config({ path: '.env.test' })

export default defineConfig({
  test: {
    environment: 'node',
    server: {
      deps: {
        inline: [
          '@graphql-tools/load-files',
          '@graphql-tools/merge',
          '@graphql-tools/schema',
          '@graphql-tools/utils'
        ]
      }
    },
    include: ['test/graphql/**/*.test.js']
  }
})
