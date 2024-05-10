import createJiti from 'jiti'
import { fileURLToPath } from 'node:url'

const jiti = createJiti(fileURLToPath(import.meta.url))

// Validate env during build.
jiti('./src/env')

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default nextConfig
