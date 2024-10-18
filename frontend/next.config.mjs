import withPWA from 'next-pwa';

const nextConfig = {
    // Các cấu hình Next.js khác ở đây, nếu có
};

export default withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
})(nextConfig);