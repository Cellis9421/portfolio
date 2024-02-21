/** @type {import('next').NextConfig} */
const nextConfig = { };


// Check environment we're running in
const isDev = process.env.NODE_ENV === 'development';

// Setting output and distDir based on environment to avoid a known bug with Next.js dev server and this configuration
// @see https://stackoverflow.com/questions/77578942/missing-required-error-components-refreshing-next-js
if (!isDev) {
    // set output to 'export' to build static files
    nextConfig.output = 'export';
    // set output directory to 'docs' for github pages
    nextConfig.distDir = 'docs';
    // Set assetPrefix to the current directory
    // nextConfig.assetPrefix = '/';
}

export default nextConfig;
