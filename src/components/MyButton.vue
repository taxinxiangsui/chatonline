<script setup lang='ts'>
import { computed } from 'vue'
const props = withDefaults(defineProps<{
    line_width: number | string,
    line_height: number | string,
    line_gap: number | string,
    line_background: string,
    change_background: string,
    modelValue: boolean
}>(), {
    line_width: 90,
    line_height: 10,
    line_gap: 10,
    line_background: '#333',
    change_background: '#fff'
})
const emits = defineEmits(['update:modelValue'])
const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emits('update:modelValue', value)
    }
})
const styleList = computed(() => ({
    '--button-line-gap': getStyleValue(props.line_gap),
    '--button-line-width': getStyleValue(props.line_width),
    '--button-line-background': props.line_background,
    '--button-line-height': getStyleValue(props.line_height),
    '--change_background': props.change_background
}))
function getStyleValue(prop: string | number): string {
    if (typeof prop === 'number') {
        return prop.toString() + 'px'
    } else {
        return prop
    }
}
</script>

<template>
    <label class="button_contanier" :style="styleList">
        <input type="checkbox" v-model="value" />
    </label>
</template>

<style lang='less' scoped>
.button_contanier {
    --transition-timing: .2s ease-in-out;
    --button-height: calc(var(--button-line-height) * 3 + var(--button-line-gap) * 2);
    position: absolute;
    gap: var(--button-line-gap);
    display: flex;
    width: max-content;
    flex-direction: column;
    cursor: pointer;
    z-index: 2;
    -webkit-tap-highlight-color: transparent;
}

.button_contanier::before,
.button_contanier::after,
.button_contanier input {
    content: '';
    width: var(--button-line-width);
    height: var(--button-line-height);
    background-color: var(--button-line-background);
    border-radius: 9999px;
    transition: all var(--transition-timing);
    transform-origin: left center;
}

.button_contanier:has(input:checked)::before,
.button_contanier:has(input:checked)::after {
    width: calc(var(--button-height) * 1.41421356237);
    --button-line-background: var(--change_background);
}

.button_contanier:has(input:checked)::before {
    transform: translateY(calc(var(--button-line-height) / -2)) rotate(45deg);
    -webkit-transform: translateY(calc(var(--button-line-height) / -2)) rotate(45deg);
}

.button_contanier:has(input:checked)::after {
    transform: translateY(calc(var(--button-line-height) / 2)) rotate(-45deg);
    -webkit-transform: translateY(calc(var(--button-line-height) / 2)) rotate(-45deg);
}

.button_contanier>input {
    /*appearance  --控制 UI 控件的基于操作系统主题的原生外观 https://developer.mozilla.org/zh-CN/docs/Web/CSS/appearance/ */
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
    /*pointer-events --元素永远不会成为鼠标事件的target。https://developer.mozilla.org/zh-CN/docs/Web/CSS/pointer-events*/
    pointer-events: none;
    outline: none;
}

.button_contanier input:checked {
    opacity: 0;
    width: 0;
}
</style> 