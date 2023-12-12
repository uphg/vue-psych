import { computed, defineComponent, inject, onUnmounted, ref, type PropType, type Ref } from "vue"
import { currentNodeProviderKey, emitterProviderKey, finishProviderKey,  psychProviderKey, startProviderKey } from "../shared/provider"
import type { Psych } from "../hooks/useProviderPsych"
import type { Emitter } from "small-emitter"
import type { TrialNode } from "../types"

export type PsychPane = {
  start: Function | null
  finish: Function | null
}

const PsychPane = defineComponent({
  props: {
    name: String as PropType<string>
  },
  // slots: Object as SlotsType<{
  //   default(props: { foo: string; bar: number }): void
  // }>,
  setup(props, context) {
    const runStart = ref<Function | null>(null)
    const runFinish = ref<Function | null>(null)

    const slot = computed(renderSlot)
    const invisible = computed(() => {
      const { parameters } = test!.value ?? {}
      return !parameters || parameters?.name !== props.name
    })
    const psych = inject<Psych>(psychProviderKey)
    const test = inject<Ref<TrialNode>>(currentNodeProviderKey)
    const emitter = inject<Emitter>(emitterProviderKey)!
    let plugin: any

    const start = inject<Ref<Function | null>>(startProviderKey)
    const finish = inject<Ref<Function | null>>(finishProviderKey)

    if (start?.value) {
      runStart.value = start.value
      start.value = null
    }

    if (finish?.value) {
      runFinish.value = finish.value
      finish.value = null
    }

    emitter.on('start', onStart)
    emitter.on('finish', onFinish)

    onUnmounted(() => {
      emitter.off('start', onStart)
      emitter.off('finish', onFinish)
    })

    function onStart() {
      if (invisible.value) return
      runStart.value?.()

      const { parameters } = test!.value ?? {}
      if (!parameters?.type) return
      plugin = parameters.type?.()
      plugin.load?.(test!.value, psych)
    }

    function onFinish() {
      if (invisible.value) return
      runFinish.value?.()

      if (!plugin) return
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
