import { cloneDeep } from "@/shared/cloneDeep";
import { currentNodeProviderKey } from "@/shared/provider";
import { defineComponent, provide, ref, unref, type PropType, type Ref } from "vue";

const Psych = defineComponent({
  name: 'Psych',
  props: {
    timeline: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    templates: {
      type: Object as PropType<Record<string, any>>
    }
  },
  setup(props, context) {
    const currentNode = ref<any>(null)
    const idNodes = ref<Map<string, any>>(new Map())
    const activeIndex = ref(0)
    const timelineNodes = ref<any[]>([])
    console.log('timelineNodes')
    console.log(timelineNodes)

    function run() {
      currentNode.value = timelineNodes.value[activeIndex.value]
      console.log('currentNode.value')
      console.log(currentNode.value)
    }

    function to(id: string) {
      const index = idNodes.value.get(id)
      if (isNil(index)) return
      activeIndex.value = index
    }

    function prev() {
      if (activeIndex.value <= 0) return
      activeIndex.value -= 1
      run()
    }

    function next() {
      console.log('next')
      const lastIndex = timelineNodes.value.length - 1
      if (activeIndex.value >= lastIndex) return
      activeIndex.value += 1
      run()
    }

    function variables(key: string) {
      return () => currentNode.value?.timelineVariables[currentNode.value.position.vars]?.[key]
    }

    function updateTimelineNode() {
      timelineNodes.value = createTimeLineNode(props.timeline, idNodes)
    }

    provide(currentNodeProviderKey, currentNode)
    
    updateTimelineNode()

    context.expose({
      run,
      to,
      prev,
      next,
      variables,
      updateTimelineNode
    })

    return () => (
      <div class="container">
        {context.slots.default?.()}
      </div>
    )
  }
})

function createTimeLineNode(timeline: any[], idNodes: Ref<Map<string, any>>) {
  const nodes = []
  let index = 0
  timeline.forEach((item) => {
    if (item.timeline) {
      item.timelineVariables.forEach((vars, varsIndex) => {
        item.timeline.forEach((node, nodeIndex) => {
          nodes.push({
            source: node,
            sourceType: 'group',
            group: item,
            index,
            position: {
              node: nodeIndex,
              vars: varsIndex
            }
          })
          index += 1
        })
      })
    } else {
      if (item.id) {
        idNodes.value.set(item.id, index)
      }
      nodes.push({
        source: item,
        sourceType: 'item',
        index
      })
      index += 1
    }
  })

  return nodes
}

function isNil(value: unknown): value is (null | undefined) {
  return value === undefined || value === null 
}

export default Psych