<template>
    <button @click="downloadFile" class="btn-primary" style="margin-top:20px;" >
    {{ downloading ? '下载中...' : '下载规则文件' }}
  </button>
</template>
<script setup>
import { ref } from 'vue'
const downloading = ref(false)
const downloadFile = async () => {
  downloading.value = true
  try{
    const link = document.createElement('a')
    link.href = 'https://fastly.jsdelivr.net/gh/feymanpaper/GKD_subscription@main/dist/gkd.json5'
    link.download = 'deviceguard_rules.json5'  
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }catch(err){
    try {
            const response = await fetch('https://raw.githubusercontent.com/feymanpaper/GKD_subscription/main/dist/gkd.json5')
            
            if (!response.ok) throw new Error('下载失败')
            
            const blob = await response.blob()  // 转成二进制 Blob
            
            // 创建下载链接
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'deviceguard_rules.json5'  // 这里文件名一定会生效
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            // 清理内存
            window.URL.revokeObjectURL(url)
        } catch (err) {
            // openAlert('下载失败，请检查网络连接，推荐使用科学上网加速下载')
        } finally {
            downloading.value = false
        }
  }finally{
    downloading.value = false
  }
}
</script>