import { provide, ref, type Ref } from "vue"
import { currentNodeProviderKey, hasPsychProviderKey, psychProviderKey, emitterProviderKey } from "../shared/provider"
import { isNil } from "../shared/isNil"
import { NodeType, type Psych } from "../types"
import Emitter from '../shared/emitter'

export function useProviderPsych(options: Record<string, any>): Psych {
  const currentNode = ref<any>({})
  const idNodes = ref<Map<string, any>>(new Map())
  const activeIndex = ref(0)
  const timelineNodes = ref<any[]>([])
  const emitter = new Emitter()

  const psych = {
    trigger, run, to, prev, next, variables, setData,
    getTimelineNodes() {
      return timelineNodes.value
    }
  }

  function run(timeline: any[]) {
    updateTimelineNode(timeline)
    runCurrentTrial()
  }

  function finish() {
    emitter.emit('finish')
    currentNode.value.source?.onFinish?.(currentNode.value.source?.data)
    const now = performance.now()
    currentNode.value.timeElapsed = now - currentNode.value.startTime
  }

  function runCurrentTrial() {
    emitter.emit('start')
    currentNode.value.source?.onStart?.(currentNode.value.source?.data)
    const now = performance.now()
    currentNode.value = timelineNodes.value[activeIndex.value]
    currentNode.value.startTime = now
    currentNode.value.triggers = []
    const { trialDuration } = currentNode.value.source
    if (typeof trialDuration === 'number') {
      setTimeout(next, trialDuration)
    }
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

  function variables(key: string) {
    return () => currentNode.value?.group.timelineVariables[currentNode.value.position.varsIndex]?.[key]
  }

  function setData(obj: Record<string, any>) {
    const { data } = currentNode.value
    timelineNodes.value[activeIndex.value].output = Object.assign(data ?? {}, obj)
  }

  function trigger(eventName: string, options?: Record<string, any>) {
    const now = performance.now()
    const { triggers } = currentNode.value
    const prev = triggers.length > 0 ? triggers[triggers.length - 1] : null
    const lastTime = prev?.rt ?? currentNode.value.startTime
    triggers.push({ eventName, now, rt: now - lastTime, ...(options ? options : {})})
  }

  provide(emitterProviderKey, emitter)
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
            nodeType: NodeType.Group,
            group: timelineNode,
            position: { childIndex, varsIndex }
          }
          result.push(newNode)
          index += 1
        })
      })
    } else {
      timelineNode.id && idNodes.value.set(timelineNode.id, index)
      result.push({ source: timelineNode, nodeType: NodeType.Item, index })
      index += 1
    }
  }

  return result
}
