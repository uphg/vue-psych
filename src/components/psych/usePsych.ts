import { currentNodeProviderKey } from "@/shared/provider"
import { provide, ref, type Ref } from "vue"

export function usePsych() {
  const currentNode = ref<any>(null)
  const idNodes = ref<Map<string, any>>(new Map())
  const activeIndex = ref(0)
  const timelineNodes = ref<any[]>([])

  function run(timeline: any[]) {
    updateTimelineNode(timeline)
    runCurrentTrial()
  }

  function to(id: string) {
    const index = idNodes.value.get(id)
    if (isNil(index)) return
    activeIndex.value = index
  }

  function prev() {
    if (activeIndex.value <= 0) return
    activeIndex.value -= 1
    runCurrentTrial()
  }

  function next() {
    const lastIndex = timelineNodes.value.length - 1
    if (activeIndex.value >= lastIndex) return
    activeIndex.value += 1
    runCurrentTrial()
  }

  function variables(key: string) {
    return () => {
      return currentNode.value?.group.timelineVariables[currentNode.value.position.vars]?.[key]
    }
  }

  function runCurrentTrial() {
    currentNode.value = timelineNodes.value[activeIndex.value]
  }

  function updateTimelineNode(timeline: any[]) {
    timelineNodes.value = createTimeLineNode(timeline, idNodes)
    console.log('timelineNodes.value')
    console.log(timelineNodes.value)
  }

  provide(currentNodeProviderKey, currentNode)

  return { run, to, prev, next, variables }
}

function createTimeLineNode(timeline: any[], idNodes: Ref<Map<string, any>>) {
  const nodes: any[] = []
  let index = 0
  timeline.forEach((item) => {
    if (item.timeline) {
      item.timelineVariables.forEach((_: unknown, varsIndex: number) => {
        item.timeline.forEach((node: Record<string, any>, nodeIndex: number) => {
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
