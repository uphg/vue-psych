import { provide, ref, type Ref } from "vue"
import { currentNodeProviderKey, hasPsychProviderKey, psychProviderKey, emitterProviderKey, variablesType } from "../shared/provider"
import { isNil } from "../shared/isNil"
import Emitter from '../shared/emitter'
import { cloneData } from "../shared/cloneData"
import { type Psych } from "../types"
import { TimelineVariables } from "../shared/variables"

export function useProviderPsych(options: Record<string, any>): Psych {
  const trials = ref<any[]>([])
  const currentNode = ref<any>({})
  const activeIndex = ref(0)
  const idNodes = ref<Map<string, any>>(new Map())
  const emitter = new Emitter()

  const psych = {
    trigger, run, to, prev, next, variables, setData, getData,
    getTrials() {
      return trials.value
    }
  }

  let timerId: number | null

  function run(timeline: any[]) {
    updateTimelineNode(timeline)
    runCurrentTrial()
  }

  function finish() {
    const now = performance.now()
    currentNode.value.source?.onFinish?.(currentNode.value.source?.data)
    currentNode.value.timeElapsed = now - currentNode.value.startTime
    cleanup()
    emitter.emit('finish')
  }

  function runCurrentTrial() {
    const now = performance.now()
    currentNode.value = trials.value[activeIndex.value]
    const { trialDuration } = currentNode.value.source

    currentNode.value.source?.onStart?.(currentNode.value.source?.data)
    currentNode.value.startTime = now
    currentNode.value.triggers = []

    if (typeof trialDuration === 'number') {
      timerId = window.setTimeout(() => {
        timerId = null
        next()
      }, trialDuration)
    }
    emitter.emit('start')
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
    const lastIndex = trials.value.length - 1
    if (activeIndex.value >= lastIndex) {
      options.onFinish?.()
      return
    }
    activeIndex.value += 1
    runCurrentTrial()
  }

  function cleanup() {
    timerId && window.clearTimeout(timerId)
  }

  function updateTimelineNode(timeline: any[]) {
    trials.value = createTrialNodes(timeline, idNodes)
  }

  function variables(key: string) {
    return new TimelineVariables(key)
  }

  function setData(obj: Record<string, any>) {
    const { outputData } = trials.value[activeIndex.value]
    trials.value[activeIndex.value].outputData = Object.assign(outputData ?? {}, obj)
  }

  function getData() {
    return trials.value[activeIndex.value].outputData
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

function createTrialNodes(timeline: any[], idNodes: Ref<Map<string, any>>) {
  const result: any[] = []
  let index = 0

  for (const node of timeline) {
    if (node.timeline) {
      node.timelineVariables.forEach((_: unknown, varsIndex: number) => {
        node.timeline.forEach((childNode: Record<string, any>, childIndex: number) => {
          const newNode: Record<string, any> = {
            index,
            source: childNode,
            sourceGroup: node,
            position: { childIndex, varsIndex }
          }
          newNode.outputData = cloneData(childNode.data, newNode)
          result.push(newNode)
          index += 1
        })
      })
    } else {
      node.id && idNodes.value.set(node.id, index)
      result.push({ index, source: node, outputData: cloneData(node.data) })
      index += 1
    }
  }

  return result
}
