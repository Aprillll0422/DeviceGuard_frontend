<template>
  <div>
    <header class="header">
      <div class="container">
        <nav>
          <div class="logo">
            <div>
            
              <i class="ri-shield-user-line" style="font-size:3rem;color:#1d4ed8;"></i>
            </div>
            <span>DeviceGuard</span>
          </div>
          
          <div class="nav-links">
            <div class="header-link" @click="toDoc" >使用文档</div>
            <div class="header-link"  @click="contactUs">联系我们</div>
          </div>
        </nav>
      </div>
    </header>

    <div class="container" style="margin-top:-50px;">
      <!-- 产品介绍 -->
      <section class="hero">
        <div class="hero-text">
          <h1>一键生成应用弹窗消除规则</h1>
          <p>只需连接手机，自动采集应用弹窗广告，智能生成精准、可读性强的消除规则。是一款致力于为用户提供创造一个纯净、无打扰空间的安卓手机软件工具。</p>
          <!-- <button class="btn-primary" @click="startCollect">立即开始使用</button> -->
        </div>
        <div>
          <div class="demo-card">
            <div class="demo-header">DeviceGuard Pro v2.3</div>
            <div class="demo-body">
              <div class="step" v-if="step === 1">
                <i class="ri-usb-fill" style="font-size:5rem;color:var(--primary);margin-bottom:1rem;"></i>
                <div class="step-title">请连接手机</div>
                <div class="step-desc">使用原装数据线连接手机，确保已开启 USB 调试与文件传输权限</div>
                <button class="btn-primary" @click="startCollect">已连接，下一步</button>
              </div>

              <div class="step" v-if="step === 0">
                <div class="step-title">正在获取已安装应用</div>
                <div class="spinner" style="margin:10px 0 10px;"></div>
              </div>

              <div class="step" v-if="step === 2">
                <i class="ri-apps-2-line" style="font-size:5rem;color:var(--primary);margin-bottom:1rem;"></i>
                <div class="step-title">选择需要采集的应用</div>

                <!-- 可选应用列表（带全选/反选） -->
                <div class="app-selector" style="width: 100%; max-width: 520px; margin-bottom: 2rem;">
                  <div class="selector-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <label style="display:flex; align-items:center; cursor:pointer; font-weight:500;">
                      <input type="checkbox" v-model="selectAll" style="width:18px;height:18px;margin-right:8px;cursor:pointer;" />
                      <span>全选</span>
                    </label>
                    <span style="color:var(--gray-600);font-size:0.95rem;">
                      已选中 <strong>{{ selectedCount }}</strong> / {{ appCount }} 个应用
                    </span>
                  </div>

                  <div class="app-list" style="max-height:280px; overflow-y:auto; border:2px solid var(--gray-200); border-radius:10px; padding:12px; background:var(--gray-50);">
                    <label v-for="app in mockApps" :key="app.package" class="app-item" 
                          style="display:flex; align-items:center; padding:10px 8px; border-radius:8px; margin-bottom:4px; cursor:pointer; transition:all 0.2s;"
                          :style="{ background: app.selected ? 'rgba(37,99,235,0.1)' : 'transparent' }">
                      <input type="checkbox" v-model="app.selected" 
                            style="width:18px;height:18px;margin-right:12px;cursor:pointer;" />
                      <div style="flex:1;">
                        <div style="font-weight:500; color:var(--gray-900);">{{ app.name }}</div>
                        <div style="font-size:0.85rem; color:var(--gray-600);">{{ app.package }}</div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- 下一步按钮 -->
                <button class="btn-primary" @click="nextStep">选择完成，下一步</button>
              </div>

              <div class="step" v-if="step === 3">
                <i class="ri-time-line" style="font-size:5rem;color:var(--primary);margin-bottom:0.5rem;"></i>
                <div class="step-title">设置单个应用的采集时长</div>
                <div class="step-desc" style="margin:-20px 0 2rem 0;">
                  采集时间越长，能捕获到的弹窗越多，生成的规则越完整
                </div>

                <!-- 分钟输入框 + 快速选项 -->
                <div class="duration-input-wrapper" style="width:100%;max-width:520px;margin-bottom:2rem;">
                  <!-- 输入框 + 分钟文字在同一行，范围提示在下一行 -->
                  <div style="width:100%;max-width:520px;margin-bottom:2rem;">
                    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                      
                      <!-- 第一行：输入框 + “分钟” 文字 -->
                      <div style="display:flex;align-items:center;gap:14px;">
                        <input 
                          type="number" 
                          v-model.number="customMinutes" 
                          min="10" 
                          max="300"
                          class="duration-input"
                          :class="{ 'error': isMinutesInvalid }"
                          style="width:120px;height:50px;padding:18px 20px;font-size:1.5rem;font-weight:600;text-align:center;
                                border:2px solid var(--gray-300);border-radius:14px;background:white;
                                box-shadow:0 4px 15px rgba(0,0,0,0.06);transition:all 0.3s;"
                        />
                        <span style="font-size:1.2rem;font-weight:600;color:var(--gray-800);">分钟</span>
                      </div>

                      <!-- 第二行：范围提示 -->
                      <div style="color:var(--gray-600);font-size:0.95rem;">
                        ( 时间范围：10 - 300 分钟 )
                      </div>
                    </div>
                  </div>

                  <!-- 快速选择按钮 -->
                  <div style="display:flex;gap:12px;justify-content:center;">
                    <button @click="customMinutes = 30"  :class="{ active: customMinutes === 30 }"  class="quick-btn">30 分钟</button>
                    <button @click="customMinutes = 60" 
                      :class="{ active: customMinutes === 60 }" 
                      class="quick-btn">
                        <div style="font-size:1rem;font-weight:700;line-height:1.2;">1 小时</div>
                        <div style="font-size:1rem;opacity:0.9;margin-top:4px;">（推荐）</div>
                    </button>
                    <button @click="customMinutes = 120" :class="{ active: customMinutes === 120 }" class="quick-btn">2 小时</button>
                  </div>
                </div>

                <!-- 动态显示预计总耗时 -->
                <div style="font-size:1.1rem;color:var(--gray-700);text-align:center;margin:-15px 0 20px 0;">
                  本次采集预计耗时
                  <strong 
                    style="font-size:1.8rem;transition:color 0.3s;"
                    :class="{ 'text-error': isMinutesInvalid }"
                    class="total-time-value"
                  >
                    {{ totalTimeText }}
                  </strong>
                </div>
            
                <!-- 开始采集按钮 -->
                <button class="btn-primary" @click="startCollecting">开始采集</button>
              </div>

              <div class="step" v-if="step === 4">
                <i class="ri-time-line" style="font-size:5rem;color:var(--primary);margin-bottom:0.5rem;"></i>
                <div class="step-title">正在采集应用弹窗信息</div>
                <div class="step-desc" style="max-width:520px;margin-top:-20px;">
                  本次采集已选择 {{ selectedCount }} 个应用，请保持连接...
                </div>
                <!-- 实时 spinner -->
                <div class="spinner" style="margin:10px 0 10px;"></div>

                <!-- 动态剩余时间（大号醒目） -->
                <div style="font-size:1.8rem;font-weight:700;color:var(--primary);margin:20px 0;">
                  {{ remainingTimeText }}
                </div>
                
              </div>

              <div class="step" v-if="step === 5">
                <i class="ri-checkbox-circle-fill success-icon"></i>
                <div class="step-title" >采集完成</div>
                <button class="btn-primary"  @click="generate">生成弹窗消除规则</button>
              </div>

              <div class="step" v-if="step === 6">
                <div class="step-title">正在生成弹窗消除规则</div>
                <!-- 实时 spinner -->
                <div class="spinner" style="margin:10px 0 30px;"></div>
                <div class="step-desc" >预计时间5分钟，请耐心等待</div>
              </div>
              <div class="step" v-if="step === 7">
                <i class="ri-checkbox-circle-fill success-icon"></i>
                <div class="step-title" >规则生成成功！</div>
                <div class="step-desc" style="margin-top: -10px;">已生成 {{ruleCount}} 条精准规则，可直接导入 GKD</div>
                <button class="btn-primary" style="margin-top:-10px;" @click="downloadFile">{{ downloading ? '下载中...' : '下载规则文件' }}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能特性 -->
      <section class="features">
        <h2 class="section-title">核心功能</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <i class="ri-target-line"></i>
            <h3 style="margin-top:-10px;">精准规则</h3>
            <p>基于真实应用网络行为生成，不误伤、不漏网</p>
          </div>
          <div class="feature-card">
            <i class="ri-equalizer-line"></i>
            <h3 style="margin-top:-10px;">自定义采集</h3>
            <p>应用、时间、设备，任君选择</p>
          </div>
          <div class="feature-card">
            <i class="ri-user-5-line"></i>
            <h3 style="margin-top:-10px;">用户友好</h3>
            <p>无需部署，一键生成规则文件，无需复杂配置</p>
          </div>
        </div>
      </section>
      <div style="height:5rem;" ref="doc"></div>
      <div style="width:100%;">
        <h2 class="section-title">使用文档</h2>
        <div class="demo-card" style="padding:40px;">
          <div style="max-width:900px;margin:0 auto;">
            <div style="margin-bottom:3rem;">
              <h3 style="font-size:1.8rem;color:var(--gray-900);margin-bottom:1rem;display:flex;align-items:center;">
                <i class="ri-book-2-line" style="font-size:2.2rem;color:var(--primary);margin-right:12px;"></i>
                快速开始指南
              </h3>
              <ol style="font-size:1.1rem;color:var(--gray-700);line-height:2;padding-left:2rem;">
                <li style="margin-bottom:1rem;">
                  <strong>连接手机</strong>：使用原装数据线连接安卓手机，确保已开启 <strong>USB 调试（开发者选项）</strong> 和 <strong>文件传输（MTP）</strong> 权限。
                </li>
                <li style="margin-bottom:1rem;">
                  点击 <strong>“已连接，下一步”</strong> 按钮，DeviceGuard 会自动获取已安装应用列表。
                </li>
                <li style="margin-bottom:1rem;">
                  在应用列表中勾选需要消除弹窗广告的应用（支持全选）。
                </li>
                <li style="margin-bottom:1rem;">
                  设置每个应用的采集时长（推荐 1 小时，可根据需要调整 10~300 分钟）。
                </li>
                <li style="margin-bottom:1rem;">
                  点击 <strong>“开始采集”</strong>，保持手机连接并正常使用目标应用，让弹窗自然出现。
                </li>
                <li style="margin-bottom:1rem;">
                  采集完成后点击 <strong>“生成弹窗消除规则”</strong>，等待约 5 分钟。
                </li>
                <li style="margin-bottom:1rem;">
                  生成成功后点击 <strong>“下载规则文件”</strong>，得到 <code>deviceguard_rules.json5</code>。
                </li>
                <li style="margin-bottom:0;">
                  将下载的规则文件导入 <strong>GKD（搞快点）</strong> 即可永久消除对应弹窗广告。
                </li>
              </ol>
            </div>

            <div style="margin-bottom:3rem;">
              <h3 style="font-size:1.8rem;color:var(--gray-900);margin-bottom:1rem;display:flex;align-items:center;">
                <i class="ri-lightbulb-line" style="font-size:2.2rem;color:var(--primary);margin-right:12px;"></i>
                使用小贴士
              </h3>
              <ul style="font-size:1.1rem;color:var(--gray-700);line-height:2;padding-left:2rem;">
                <li>采集时间越长，捕获的弹窗种类越多，生成的规则越完整（1~2 小时效果最佳）。</li>
                <li>采集期间请正常使用选中的应用，多触发各种弹窗（如开屏、升级、活动等）。</li>
                <li>若手机断开连接，采集会自动暂停，重新连接后可继续。</li>
                <li>生成的规则仅针对本次采集的弹窗，精准无误杀。</li>
                <li>支持批量采集多个应用，一次生成多条规则。</li>
              </ul>
            </div>

            <div style="padding:2rem;background:rgba(37,99,235,0.08);border-radius:12px;border-left:5px solid var(--primary);">
              <p style="font-size:1.1rem;color:var(--gray-800);margin:0;">
                <i class="ri-information-line" style="font-size:1.4rem;color:var(--primary);vertical-align:middle;margin-right:8px;"></i>
                <strong>注意：</strong>本工具仅用于学习与个人使用，请尊重应用开发者权益，勿用于商业用途。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style="height:5rem;" ref="contact"></div>
      <div style="width:100%;">
        <h2 class="section-title">联系我们</h2>
        <div class="demo-card" style="padding:40px;">
          <div style="max-width:800px;margin:0 auto;text-align:center;">
            <p style="font-size:1.3rem;color:var(--gray-700);margin-bottom:3rem;">
              有任何问题、建议或希望支持的新应用，欢迎随时联系我们！
            </p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:30px;margin-bottom:3rem;">
              <!-- Telegram -->
              <div style="background:rgba(37,99,235,0.05);border-radius:16px;padding:30px;border:2px solid rgba(37,99,235,0.15);">
                <i class="ri-telegram-line" style="font-size:4rem;color:#0088cc;margin-bottom:1rem;"></i>
                <h4 style="font-size:1.4rem;margin:1rem 0;color:var(--gray-900);">Telegram 频道</h4>
                <p style="color:var(--gray-600);margin-bottom:1.5rem;">获取最新版本、规则更新和使用教程</p>
                <a href="https://t.me/deviceguard_pro" target="_blank" class="btn-primary" style="text-decoration:none;display:inline-block;">
                  加入频道
                </a>
              </div>

              <!-- GitHub Issues -->
              <div style="background:rgba(37,99,235,0.05);border-radius:16px;padding:30px;border:2px solid rgba(37,99,235,0.15);">
                <i class="ri-github-line" style="font-size:4rem;color:#333;margin-bottom:1rem;"></i>
                <h4 style="font-size:1.4rem;margin:1rem 0;color:var(--gray-900);">GitHub Issues</h4>
                <p style="color:var(--gray-600);margin-bottom:1.5rem;">提交 Bug、功能建议或查看开发进度</p>
                <a href="https://github.com/yourname/deviceguard-pro/issues" target="_blank" class="btn-primary" style="text-decoration:none;display:inline-block;">
                  前往 Issues
                </a>
              </div>

              <!-- 邮箱 -->
              <div style="background:rgba(37,99,235,0.05);border-radius:16px;padding:30px;border:2px solid rgba(37,99,235,0.15);">
                <i class="ri-mail-line" style="font-size:4rem;color:#ea4335;margin-bottom:1rem;"></i>
                <h4 style="font-size:1.4rem;margin:1rem 0;color:var(--gray-900);">电子邮箱</h4>
                <p style="color:var(--gray-600);margin-bottom:1.5rem;">商业合作或私人问题可直接邮件联系</p>
                <a href="mailto:support@deviceguard.pro" class="btn-primary" style="text-decoration:none;display:inline-block;">
                  发送邮件
                </a>
              </div>
            </div>

            <p style="font-size:1rem;color:var(--gray-600);">
              © 2025 DeviceGuard Pro. 我们致力于让您的安卓体验更纯净。
            </p>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <div class="container">
        <p>© 2025 DeviceGuard Pro. All rights reserved.</p>
      </div>
    </footer>
    <!-- 自定义 Alert 弹框 -->
    <transition name="fade">
      <div v-if="showAlert" class="custom-alert-overlay" @click="closeAlert">
        <div class="custom-alert" @click.stop>
          <div class="alert-icon">
            <i class="ri-error-warning-line"></i>
          </div>
          <div class="alert-title">提示</div>
          <div class="alert-message">{{ alertMessage }}</div>
          <button class="btn-primary" style="margin-bottom:1.5rem;font-size: 1rem;padding: 12px 30px;" @click="closeAlert">我知道了</button>
        </div>
      </div>
    </transition>
    
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { getAppList, getConnectionStatus, postTask } from '@/utils/api.js';

const ifConnected = ref(true);
const step = ref(1);
const ruleCount = ref(999);
const appCount = ref(0);
const mockApps = ref([]);
const downloading = ref(false)
const doc = ref(null)
const contact = ref(null)
const ifSuccess = ref(false)

const toDoc = () => {
  if (doc.value) {
    doc.value.scrollIntoView({
      behavior: 'smooth',  
      block: 'start',
      inline: 'nearest'    
    })
  }
}

const contactUs = () => {
  if (contact.value) {
    contact.value.scrollIntoView({
      behavior: 'smooth',  
      block: 'start',
      inline: 'nearest'    
    })
  }
}
const downloadFile = async () => {
  downloading.value = true
  try{
    const link = document.createElement('a')
    link.href = 'https://fastly.jsdelivr.net/gh/dgliang/GKD_subscription@main/dist/gkd.json5'
    link.download = 'deviceguard_rules.json5'  
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }catch(err){
    try {
            const response = await fetch('https://raw.githubusercontent.com/dgliang/GKD_subscription/main/dist/gkd.json5')
            
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
            openAlert('下载失败，请检查网络连接，推荐使用科学上网加速下载')
        } finally {
            downloading.value = false
        }
  }finally{
    downloading.value = false
  }
}


const startCollect = () => {
  getConnection();
  if(ifConnected.value === false){
    openAlert('请先连接手机')
  }
  else{
    getApps();
  }
};

const generate = () => {
  step.value = 6;
  setTimeout(() => {
    step.value = 7;
  }, 5000);
};
const getConnection = async () => {
  try {
    const response = await getConnectionStatus()
    if (response === true) {
      ifConnected.value = true
    }
    else{
      ifConnected.value = false
    }
  } catch (err){
    console.error('检查连接状态失败:', err)
  }
}    
const getApps = async () => {
  try {
    step.value = 0;
    // 调用后端接口获取原始数据
    const response = await getAppList()  // response 就是 { total: 34, apps: [...] }

    // 提取总数
    appCount.value = response.total

    // 把后端返回的 apps 数组映射成我们需要的格式
    mockApps.value = response.apps.map(app => ({
      package: app.package_name,   
      name: app.app_name,         
      selected: false             
    }))
    console.log('应用列表加载完成，共', appCount.value, '个')
  } catch (err) {
    console.error('获取应用列表失败:', err)
    openAlert('加载应用列表失败，请检查设备连接或稍后重试')
    step.value = 1  // 回到初始状态
    appCount.value = 0
    mockApps.value = []
  }finally{
    step.value = 2;
  }
}

// 计算属性：已选数量
const selectedCount = computed(() => {
  return mockApps.value.filter(app => app.selected).length;
});

// 全选/反选
const selectAll = ref(false);
watch(selectAll, (val) => {
  mockApps.value.forEach(app => app.selected = val);
});

// 下一步点击事件
const nextStep = () => {
  if (selectedCount.value === 0) {
    openAlert('请选择至少一个需要采集的应用')
    return
  }
  step.value = 3
};
// 自定义 Alert 弹框
const showAlert = ref(false)
const alertMessage = ref('')

const openAlert = (msg) => {
  alertMessage.value = msg
  showAlert.value = true
}

const closeAlert = () => {
  showAlert.value = false
}
// 自由输入的分钟数
const customMinutes = ref(60)

// 计算总分钟数
const totalMinutes = computed(() => {
  return selectedCount.value * customMinutes.value
})

// 格式化显示文字（比如 720 分钟 → 12 小时）
const totalTimeText = computed(() => {
  const hours = totalMinutes.value / 60
  if (hours >= 1) {
    return hours % 1 === 0 ? `${hours} 小时` : `${hours.toFixed(1)} 小时`
  } else {
    return `${totalMinutes.value} 分钟`
  }
})

// 开始采集
const startCollecting = async() => {
  if (customMinutes.value < 0) {
    openAlert('应用最少采集 10 分钟')
    return
  }
  if (customMinutes.value >300) {
    openAlert('应用最多采集 300 分钟')
    return
  }
  const timestamp = new Date().toISOString(); 
  const data = mockApps.value
  .filter(item => item.selected)                    // 筛选 selected 为 true 的项
  .map(item => ({                                   // 转换成目标格式
    pkg: item.package,                              // package → pkg
    app: item.name,                                 // name → app
    timestamp: timestamp                            // 固定时间戳（或动态生成）
  }));
  step.value = 4
  try{
    const response = await postTask(data)
    ifSuccess.value = response.success
  }catch(err){
    console.error('应用信息采集失败:', err)
    openAlert('应用信息采集失败，请检查设备连接或稍后重试')
    step.value = 2  // 回到选择应用页
  }finally{
    if(ifSuccess.value){
      step.value = 5;
    }
    else{
      openAlert('应用信息采集失败，请检查设备连接或稍后重试')
      step.value = 2  // 回到选择应用页
    }
    
  }
  
}
// 判断是否超出推荐范围（10~300 分钟之外变红）
const isMinutesInvalid = computed(() => {
  const val = customMinutes.value
  // 如果为空或 NaN，先不视为无效（避免初始状态就红）
  if (val === null || val === undefined || val === '') return false
  return val < 10 || val > 300
})
// 采集开始时间（进入 step 4 时记录）
const collectStartTime = ref(0)

// 总采集时长（毫秒） = 应用数 × 每应用分钟 × 60秒 × 1000
const totalCollectMs = computed(() => {
  return selectedCount.value * customMinutes.value * 60 * 1000
})

// 当进入采集页时，开始计时
watch(() => step.value, (newVal) => {
  if (newVal === 4) {
    collectStartTime.value = Date.now()
  }
})

// 新增：每秒更新一次的响应式触发器（专门用来强制刷新倒计时）
const currentTime = ref(Date.now())

// 每秒更新 currentTime，触发所有依赖它的 computed 刷新
onMounted(() => {
  const timer = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)

  // 当离开采集页或组件卸载时清除定时器（防止内存泄漏）
  onBeforeUnmount(() => clearInterval(timer))
})

// 修改 remainingTimeText 和 progressPercent，让它们依赖 currentTime
const remainingTimeText = computed(() => {
  if (!collectStartTime.value) return '--'

  const elapsed = currentTime.value - collectStartTime.value  // 改用 currentTime
  let remainingMs = totalCollectMs.value - elapsed

  if (remainingMs <= 30000){
    return '即将完成...'
  }

  const hours = Math.floor(remainingMs / (1000 * 60 * 60))
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000)  // 可选：加秒更精确

  if (hours > 0) {
    return `剩余时间：${hours} 小时 ${minutes} 分钟`
  } else if (minutes > 0) {
    return `剩余时间：${minutes} 分钟 ${seconds} 秒`
  } else {
    return `剩余时间：${seconds} 秒`
  }
})
</script>

<style scoped>
/* 全局样式 */
:root {
  --primary: #2563eb;
  --primary-light: #3b82f6;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-600: #4b5563;
  --gray-800: #1f2937;
  --gray-900: #111827;
}
* { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: var(--gray-800);
  line-height: 1.6;
}
.container {
  max-width: 1300px;
  margin: 0 3rem 0 3rem;
  padding: 0 20px;
}

/* Header */
header {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: 100;
}
nav {
  display: flex;
  justify-content: space-between;  /* 水平：左右分布 */
  align-items: center;             /* 关键！垂直居中 */
  padding: 1rem 0;                 /* 上下内边距 */
  height: 100%;                    /* 可选：让 nav 占满 header 高度 */
}
.logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary); 
  display: flex;
  justify-content: space-between;  /* 水平：左右分布 */
  align-items: center;             /* 关键！垂直居中 */
  gap:5px;
}
.logo span { color: var(--gray-900); }
.nav-links{
  gap:30px;
  display: flex;
  justify-content: space-between;  /* 水平：左右分布 */
  margin-left: 2rem;
  text-decoration: none;
  color: var(--gray-600);
  font-weight: 500;
}
/* 单个导航链接 */
.header-link {
  position: relative;               /* 用于定位伪元素下划线 */
  color: var(--gray-600);
  font-weight: 500;
  cursor: pointer;                  /* 鼠标悬浮时显示手型（点击样式） */
  padding: 8px 0;                   /* 给下划线留出空间 */
  transition: color 0.3s ease;      /* 文字颜色平滑过渡 */
}

/* 鼠标悬浮时的文字颜色变化（可选，更明显） */
.header-link:hover {
  color: #1d4ed8;            /* 变为主题蓝 */
}

/* 下划线（使用 ::after 伪元素实现） */
.header-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;                      /* 下划线粗细 */
  background: #1d4ed8;       /* 蓝色下划线 */
  border-radius: 2px;
  transition: all 0.4s ease;        /* 宽度和左右位移的动画 */
  transform: translateX(-50%);      /* 初始居中 */
}

/* 悬浮时下划线展开动画 */
.header-link:hover::after {
  width: 100%;                      /* 展开到文字全宽 */
  left: 50%;
  transform: translateX(-50%);
}
/* Hero + Product Intro */
.hero {
  padding: 80px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;          /* 改成顶部对齐，位置就固定了 */
  align-self: start;           /* 确保自身也从顶部开始 */
}

/* 让左侧文字视觉上看起来还是“居中”位置，但不会随右侧跳动 */
.hero-text {
  padding-top: 60px;           /* 新增：手动补一个上边距，视觉对齐原效果 */
}
.hero-text h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: var(--gray-900);
}
.hero-text p {
  font-size: 1.2rem;
  color: var(--gray-600);
  margin-bottom: 2rem;
}
.btn-primary {
  background: #3b82f6;
  color: white;
  padding: 14px 32px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(37,99,235,0.3);
}
.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(37,99,235,0.4);
}

/* Features */
.features {
  padding: 10px 0;
  background: white;
}
.section-title {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 3rem;
  color: var(--gray-900);
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}
.feature-card {
  height:300px;
  background: #3b82f6;
  color:white;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s;
}
.feature-card:hover { transform: translateY(-8px); background:#1d4ed8;}
.feature-card i {
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 1rem;
}

/* 使用界面展示区 */
.demo-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  overflow: hidden;
  margin: 0 auto;
}
.demo-header {
  background: var(--gray-900);
  color: white;
  padding: 1.5rem;
  text-align: center;
  font-size: 1.4rem;
  font-weight: 600;
}
.demo-body {
  padding: 40px;
}

/* 实际操作界面 */
.step {
  margin-top:-4rem;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.step-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--gray-900);
}
.step-desc {
  font-size: 1.1rem;
  color: var(--gray-600);
  margin-bottom: 2rem;
  max-width: 500px;
}
/* 强制显示 spinner（已解决所有 scoped 问题） */
.step .spinner {
  width: 64px;
  height: 64px;
  border: 6px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 32px auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.success-icon {
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 1rem;
}

footer {
  background: var(--gray-900);
  color: white;
  text-align: center;
  padding: 3rem 0;
  margin-top: 100px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .hero-text h1 {
    font-size: 2.2rem;
  }
  .feature-grid {
    grid-template-columns: 1fr;
  }
  .nav-links a {
    margin-left: 1rem;
  }
}
/* =============== 自定义 Alert 弹框（完全匹配当前风格） =============== */
.custom-alert-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.custom-alert {
  background: white;
  width: 90%;
  max-width: 420px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  text-align: center;
  animation: bounceIn 0.4s ease-out;
}

.alert-icon {
  margin-top:1.5rem;
  padding: 24px 0 8px;
  font-size: 4.5rem;
  color: #f59e0b;   /* 橙色警告图标，和成功绿形成对比 */
}

.alert-icon i {
  display: block;
}

.alert-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: -10px 0 12px;
}

.alert-message {
  font-size: 1.05rem;
  color: var(--gray-600);
  padding: 0 32px;
  line-height: 1.5;
  margin-bottom: 28px;
}

.alert-btn {
  width: 40%;
  background: #1d4ed8;
  color: white;
  border: 10px;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.alert-btn:hover {
  background: #1d4ed8;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 弹跳出现动画（和 demo-card 风格一致） */
@keyframes bounceIn {
  0%   { transform: scale(0.8); opacity: 0; }
  60%  { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}
/* 让选中时的采集时长卡片高亮（和你的整体风格一致） */
.duration-item input:checked + .duration-card {
  background: rgba(37,99,235,0.08) !important;
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 4px rgba(37,99,235,0.15);
}
/* 快速选择按钮样式 */
.quick-btn {
  padding: 10px 18px;
  background: var(--gray-100);
  border: 2px solid var(--gray-200);
  border-radius: 10px;
  font-weight: 600;
  color: var(--gray-700);
  transition: all 0.3s;
  cursor: pointer;
  font-size:1rem;
}
.quick-btn:hover {
  background: rgba(37,99,235,0.1);
  border-color: var(--primary);
}
.quick-btn.active {
  background: rgba(37,99,235,0.12);
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.2);
}

/* 输入框聚焦美化 */
.duration-input:focus {
  outline: none;
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 4px rgba(37,99,235,0.15);
}
/* 输入框超出 10~300 分钟范围时变红 */
.duration-input.error {
  border-color: #ef4444 !important;   /* 红色边框 */
  color: #ef4444 !important;          /* 红色文字 */
  background-color: #fee2e2 !important; /* 浅红背景 */
  box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.2) !important;
}

.duration-input.error:focus {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.3) !important;
}
/* 预计耗时文字超出推荐范围时变红 */
.text-error,
.total-time-value.text-error {
  color: #ef4444 !important;   /* 鲜艳红色 */
}

/* 可选：让整个提示区域也微微变红背景，更醒目 */
.total-time:has(.text-error) {
  background: #fee2e2 !important;
  border: 1px solid #fca5a5;
}
/* 进度条动画 */
.progress-bar {
  height: 100%;
  transition: width 0.5s ease;
}
</style>