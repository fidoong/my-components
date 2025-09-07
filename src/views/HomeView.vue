<template>
  <div class="tooltip-demo">
    <h2>提示框基础功能测试</h2>

    <!-- 单行文本测试 -->
    <div class="test-case">
      <h3>单行文本（默认）</h3>
      <div class="single-line" v-tooltip="{theme:'light'}">
        这是一段单行文本，宽度受限，应该显示省略号和提示框
      </div>
    </div>

    <!-- 多行文本测试 -->
    <div class="test-case">
      <h3>多行文本</h3>
      <div class="multi-line" v-tooltip="{ maxLines: 2 }">
        这是一段多行文本，设置了最大显示行数为2行。当内容超过2行时，
        会自动截断并显示省略号，鼠标悬停时显示完整内容的提示框。
      </div>
    </div>

    <!-- enterable测试 -->
    <div class="test-case">
      <h3>可进入提示框（enterable: true）</h3>
      <div class="single-line" v-tooltip>
        鼠标可以进入提示框并选中内容
      </div>
    </div>

    <!-- 强制显示测试 -->
    <div class="test-case">
      <h3>强制显示（自定义内容）</h3>
      <div class="no-overflow" v-tooltip="{ content: '这是强制显示的自定义内容' }">
        这段文本不会溢出，但会显示提示框
      </div>
    </div>
  </div>
  <div class="tooltip-demo">
    <h2>提示框基础功能测试</h2>

    <!-- 单行文本测试 -->
    <div class="test-case">
      <h3>单行文本（默认）</h3>
      <div class="single-line" v-tooltip="{theme:'light'}">
        这是一段单行文本，宽度受限，应该显示省略号和提示框
      </div>
    </div>

    <!-- 多行文本测试 -->
    <div class="test-case">
      <h3>多行文本</h3>
      <div class="multi-line" v-tooltip="{ maxLines: 2 }">
        这是一段多行文本，设置了最大显示行数为2行。当内容超过2行时，
        会自动截断并显示省略号，鼠标悬停时显示完整内容的提示框。
      </div>
    </div>

    <!-- enterable测试 -->
    <div class="test-case">
      <h3>可进入提示框（enterable: true）</h3>
      <div class="single-line" v-tooltip>
        鼠标可以进入提示框并选中内容
      </div>
    </div>

    <!-- 强制显示测试 -->
    <div class="test-case">
      <h3>强制显示（自定义内容）</h3>
      <div class="no-overflow" v-tooltip="{ content: '这是强制显示的自定义内容' }">
        这段文本不会溢出，但会显示提示框
      </div>
    </div>
  </div>
  <div class="tooltip-demo">
    <h2>提示框基础功能测试</h2>

    <!-- 单行文本测试 -->
    <div class="test-case">
      <h3>单行文本（默认）</h3>
      <div class="single-line" v-tooltip="{theme:'light'}">
        这是一段单行文本，宽度受限，应该显示省略号和提示框
      </div>
    </div>

    <!-- 多行文本测试 -->
    <div class="test-case">
      <h3>多行文本</h3>
      <div class="multi-line" v-tooltip="{ maxLines: 2 }">
        这是一段多行文本，设置了最大显示行数为2行。当内容超过2行时，
        会自动截断并显示省略号，鼠标悬停时显示完整内容的提示框。
      </div>
    </div>

    <!-- enterable测试 -->
    <div class="test-case">
      <h3>可进入提示框（enterable: true）</h3>
      <div class="single-line" v-tooltip>
        鼠标可以进入提示框并选中内容
      </div>
    </div>

    <!-- 强制显示测试 -->
    <div class="test-case">
      <h3>强制显示（自定义内容）</h3>
      <div class="no-overflow" v-tooltip="{ content: '这是强制显示的自定义内容' }">
        这段文本不会溢出，但会显示提示框
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.tooltip-demo {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-case {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.single-line {
  width: 300px; /* 明确设置宽度限制 */
  padding: 10px;
  border: 1px solid #ccc;
}

.multi-line {
  width: 300px;
  border: 1px solid #ccc;
  line-height: 1.5;
  height: 45px; /* 大约2行高度 */
}

.no-overflow {
  border: 1px solid #ccc;
  width: 200px;
}
</style>

