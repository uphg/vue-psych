import { computed, defineComponent, inject, nextTick, onUnmounted, type PropType, type Ref } from "vue"
import { currentNodeProviderKey, emitterProviderKey, psychProviderKey } from "../shared/provider"
import { NodeType } from "../types"

const PsychPane = defineComponent({
  props: {
    name: String as PropType<string>
  },
  setup(props, context) {
    const slot = computed(renderSlot)
    const invisible = computed(() => {
      const { source } = currentNode!.value ?? {}
      return !source || source?.name !== props.name
    })
    const psych = inject(psychProviderKey) as any
    const currentNode = inject<Ref<Record<string, any>>>(currentNodeProviderKey)
    const emitter = inject(emitterProviderKey) as any

    let plugin: any

    emitter.on('start', onStart)
    emitter.on('finish', onFinish)

    onUnmounted(() => {
      emitter.off('start', onStart)
      emitter.off('finish', onFinish)
    })

    function onStart() {
      nextTick(() => {
        const { source } = currentNode!.value ?? {}
        if (invisible.value || !source?.type) return
        plugin = source.type?.()
        plugin.load?.(currentNode!.value, psych)
      })
    }

    function onFinish() {
      if (invisible.value || !plugin) return
      plugin.unload?.()
      plugin = null
    }

    function renderSlot() {
      if (invisible.value) return
      const { nodeType, source } = currentNode!.value ?? {}
      if (nodeType === NodeType.Item) {
        return context.slots.default?.(source.data)
      } else {
        const data = handleVariables(source?.data)
        return context.slots.default?.(data)
      }
    }

    return () => slot.value
  }
})

function handleVariables(item: Record<string, any>) {
  if (!item) return item
  const result: Record<string, any> = {}
  const keys = Object.keys(item)
  for (const key of keys) {
    result[key] = typeof item[key] === 'function' ? item[key]() : item[key]
  }
  return result
}

export default PsychPane
