import { computed, defineComponent, inject, type PropType, type Ref, type SlotsType } from "vue"
import { currentTestProviderKey, psychProviderKey, templatesProviderKey } from "../shared/provider"
import type { Psych } from "../hooks/useProviderPsych"
import type { TrialNode } from "../types"

export type PsychPane = {
  start: Function | null
  finish: Function | null
}

const PsychPane = defineComponent({
  props: {
    name: String as PropType<string>,
    onStart: Function as PropType<(test?: TrialNode) => void>,
    onFinish: Function as PropType<(test?: TrialNode) => void>
  },
  slots: Object as SlotsType<{
    default(props: Record<string, any>): void
  }>,
  setup(props, context) {
    const invisible = computed(() => {
      const { parameters } = test!.value ?? {}
      return !parameters || parameters?.name !== props.name
    })
    const slot = computed(() => {
      if (invisible.value) return
      return context.slots.default && context.slots.default(test!.value?.trialData!)
    })

    const psych = inject<Psych>(psychProviderKey)
    const test = inject<Ref<TrialNode>>(currentTestProviderKey)
    const templates = inject<Ref<Map<any, any>>>(templatesProviderKey)

    let plugin: any

    templates?.value.set(props.name, { onStart, onFinish })

    function onStart() {
      props.onStart?.(test?.value)

      const { parameters } = test!.value ?? {}
      if (!parameters?.type) return
      plugin = parameters.type?.()
      plugin.load?.(test!.value, psych)
    }

    function onFinish() {
      props.onFinish?.(test?.value)

      if (!plugin) return
      plugin.unload?.()
      plugin = null
    }

    return () => slot.value
  }
})

export default PsychPane
