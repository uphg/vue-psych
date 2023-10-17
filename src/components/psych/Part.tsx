import { currentNodeProviderKey } from "@/shared/provider";
import { computed, defineComponent, inject, type PropType, type Ref } from "vue";

const Part = defineComponent({
  props: {
    type: String as PropType<string>
  },
  setup(props, context) {
    const currentNode = inject<Ref<Record<string, any>>>(currentNodeProviderKey)
    const slot = computed(() => {
      const node = currentNode!.value
      if (!node || node?.source.type !== props.type) return null
      if (node.sourceType === 'item') {
        return context.slots.default?.(node.source.data)
      } else {
        const data = handleVariables(node.source?.data)
        return context.slots.default?.(data)
      }
    })
    return () => slot.value
  }
})

function handleVariables(item: Record<string, any>) {
  if (!item) return item
  const result: Record<string, any> = {}
  const keys = Object.keys(item)
  keys.forEach((key) => {
    result[key] = typeof item[key] === 'function' ? item[key]() : item[key]
  })

  return result
}

export default Part