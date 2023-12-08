import { computed, defineComponent, inject, nextTick, onUnmounted, type PropType, type Ref, type SlotsType } from "vue"
import { currentNodeProviderKey, emitterProviderKey, psychProviderKey } from "../shared/provider"
// import type { Psych } from "@/hooks/useProviderPsych"
import type { TrialNode } from "@/types"
import type Emitter from "../shared/emitter"

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
      const { parameters } = test!.value ?? {}
      return !parameters || parameters?.name !== props.name
    })
    const psych = inject<Psych>(psychProviderKey)
    // const currentNode = inject<Ref<TrialNode>>(currentNodeProviderKey)
    const test = inject<Ref<Record<string, any>>>(currentNodeProviderKey)
    const emitter = inject<Emitter>(emitterProviderKey)!

    let plugin: any

    emitter.on('start', onStart)
    emitter.on('finish', onFinish)

    onUnmounted(() => {
      emitter.off('start', onStart)
      emitter.off('finish', onFinish)
    })

    function onStart() {
      nextTick(() => {
        const { parameters } = test!.value ?? {}
        if (invisible.value || !parameters?.type) return
        plugin = parameters.type?.()
        plugin.load?.(test!.value, psych)
      })
    }

    function onFinish() {
      if (invisible.value || !plugin) return
      plugin.unload?.()
      plugin = null
    }

    function renderSlot() {
      if (invisible.value) return
      return context.slots.default?.(test!.value?.trialData)
    }

    return () => slot.value
  }
})

export default PsychPane
