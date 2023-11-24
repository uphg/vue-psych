import { currentNodeProviderKey } from "@/shared/provider";
import { computed, defineComponent, inject, type PropType, type Ref } from "vue";

const PsychPane = defineComponent({
  props: {
    type: String as PropType<string>
  },
  setup(props, context) {
    const currentNode = inject<Ref<Record<string, any>>>(currentNodeProviderKey)
    const slot = computed(renderSlot)

    function renderSlot() {
      const timelineNode = currentNode!.value
      if (!timelineNode || timelineNode?.source?.type !== props.type) return void 0
      if (timelineNode.sourceType === 'item') {
        return context.slots.default?.(timelineNode.source.data)
      } else {
        const data = handleVariables(timelineNode.source?.data)
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
