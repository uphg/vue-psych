import { provide, ref, type Ref } from "vue"
import { currentNodeProviderKey, hasPsychProviderKey, psychProviderKey } from "../shared/provider"
import { isNil } from "../shared/isNil"
import { SourceType, type Psych } from "../types"

export function useProviderPsych(options: Record<string, any>): Psych {
  const currentNode = ref<any>({})
  const idNodes = ref<Map<string, any>>(new Map())
  const activeIndex = ref(0)
  const timelineNodes = ref<any[]>([])
  const psych = {
    trigger, run, to, prev, next, variables,
    getTimelineNodes() {
      return timelineNodes.value
    }
  }

  function runCurrentTrial() {
    const now = performance.now()
    currentNode.value = timelineNodes.value[activeIndex.value]
    currentNode.value.startTime = now
    currentNode.value.responseNodes = []
    const { trialDuration } = currentNode.value.source
    if (typeof trialDuration === 'number') {
      setTimeout(next, trialDuration)
    }
  }

  function finish() {
    const now = performance.now()
    currentNode.value.timeElapsed = now - currentNode.value.startTime
  }

  function variables(key: string) {
    return () => currentNode.value?.group.timelineVariables[currentNode.value.position.varsIndex]?.[key]
  }

  function trigger(type: string) {
    const now = performance.now()
    const { responseNodes } = currentNode.value
    const prev = responseNodes.length > 0 ? responseNodes[responseNodes.length - 1] : null
    const lastTime = prev?.rt ?? currentNode.value.startTime

    responseNodes.push({ type, now, rt: now - lastTime})
  }

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
    finish()
    const lastIndex = timelineNodes.value.length - 1
    if (activeIndex.value >= lastIndex) {
      options.onFinish?.()
      return
    }
    activeIndex.value += 1
    runCurrentTrial()
  }

  function updateTimelineNode(timeline: any[]) {
    timelineNodes.value = createTimeLineNode(timeline, idNodes)
  }

  provide(currentNodeProviderKey, currentNode)
  provide(psychProviderKey, psych)
  provide(hasPsychProviderKey, true)

  return psych
}

function createTimeLineNode(timeline: any[], idNodes: Ref<Map<string, any>>) {
  const result: any[] = []
  let index = 0

  for (const timelineNode of timeline) {
    if (timelineNode.timeline) {
      timelineNode.timelineVariables.forEach((_: unknown, varsIndex: number) => {
        timelineNode.timeline.forEach((childNode: Record<string, any>, childIndex: number) => {
          const newNode = {
            index,
            source: childNode,
            sourceType: SourceType.Group,
            group: timelineNode,
            position: { childIndex, varsIndex }
          }
          result.push(newNode)
          index += 1
        })
      })
    } else {
      timelineNode.id && idNodes.value.set(timelineNode.id, index)
      result.push({ source: timelineNode, sourceType: SourceType.Item, index })
      index += 1
    }
  }

  return result
}
