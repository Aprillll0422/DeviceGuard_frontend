<template>
  <div>
    <!-- 固定在顶部的按钮 -->
    <button 
      @click="scrollToTarget" 
      style="position:fixed;top:20px;right:20px;padding:12px 24px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;z-index:100;box-shadow:0 4px 15px rgba(37,99,235,0.3);"
    >
      跳到下方组件
    </button>

    <!-- 占位内容，让页面有足够高度可以滚动 -->
    <div style="height:100vh;background:linear-gradient(to bottom,#f0f9ff,#e0f2fe);display:flex;align-items:center;justify-content:center;flex-direction:column;">
      <h1 style="font-size:3rem;color:#1e40af;">页面顶部</h1>
      <p style="font-size:1.2rem;color:#4b5563;margin-top:20px;">向下滚动或点击右上角按钮测试平滑滚动</p>
    </div>

    <div style="height:100vh;"></div>
    <div style="height:100vh;"></div>

    <!-- 目标组件（我们要滚动到的位置） -->
    <section ref="targetSection" style="height:100vh;background:#1e40af;display:flex;align-items:center;justify-content:center;flex-direction:column;">
      <h2 style="font-size:2.5rem;color:white;margin-bottom:20px;">这里是目标组件！</h2>
      <p style="font-size:1.2rem;color:rgba(255,255,255,0.9);">你已经成功平滑滚动到这里了 🎉</p>
    </section>

    <div style="height:100vh;background:#f3f4f6;"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 获取目标元素的 ref
const targetSection = ref(null)

// 点击按钮执行平滑滚动
const scrollToTarget = () => {
  if (targetSection.value) {
    targetSection.value.scrollIntoView({
      behavior: 'smooth',  // 平滑滚动（关键！）
      block: 'center',     // 垂直方向：滚动到视口中间（可选：'start'、'end'、'nearest'）
      inline: 'nearest'    // 水平方向（通常不需要改）
    })
  }
}
</script>

<style scoped>
/* 可选：全局样式让页面更美观 */
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
}
</style>