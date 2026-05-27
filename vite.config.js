// @MX:NOTE: GitHub Pages 서브경로 호스팅용 base path.
// 로컬 dev/preview는 '/', Pages 배포는 BASE_URL env로 주입.
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
});
