import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
    server: {
        port: 3000,      // Đổi port tại đây
        host: true       // Cho phép truy cập từ ngoài (tuỳ chọn)
    }
})
