import { computed, defineComponent, inject, nextTick, onUnmounted, type PropType, type Ref, type SlotsType } from "vue"
import { currentNodeProviderKey, emitterProviderKey, psychProviderKey } from "../shared/provider"
import { handleVariables } from "../shared/handleVariables"
// import type { TimelineData } from "../types"

const PsychPane = defineComponent({
  props: {
    name: String as PropType<string>
  },
  // slots: Object as SlotsType<{
  //   default(props: { foo: string; bar: number }): void
  // }>,
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
      const { outputData, sourceGroup } = currentNode!.value ?? {}
      return context.slots.default?.(sourceGroup ? handleVariables(outputData) : outputData)
    }

    return () => slot.value
  }
})

export default PsychPane
