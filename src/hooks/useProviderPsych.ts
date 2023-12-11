import { provide, ref } from "vue"
import { cloneData } from "../shared/cloneData"
import { Emitter } from "small-emitter"
import type { TimelineNode } from "../types"
import { currentNodeProviderKey, emitterProviderKey, hasPsychProviderKey, psychProviderKey } from "../shared/provider"
import { TimelineVariables } from "../shared/variables"
import { isNil } from "../shared/isNil"

export type Psych = ReturnType<typeof useProviderPsych>
export type ProviderPsychOptions = { onStart?(data: Record<string, any>): void, onFinish?(): void, onFinish?(data: Record<string, any>): void }

export function useProviderPsych(options: ProviderPsychOptions) {
  const timeline = ref<TimelineNode[]>([])
  const trialNodes = ref<any[]>([])
  const test = ref<any>({})
  const progress = ref({
    index: 0,
    childIndex: -1,
  })
  const emitter = new Emitter()
  const psych = { run, next, to, variables, trigger, setData, setVariables, getTrialNodes: () => trialNodes.value }
  let timerId: number | null = null

  provide(currentNodeProviderKey, test)
  provide(hasPsychProviderKey, true)
  provide(psychProviderKey, psych)
  provide(emitterProviderKey, emitter)

  function run(nodes: TimelineNode[]) {
    timeline.value = nodes
    trialNodes.value = createTrialNodes(nodes)
    if (trialNodes.value[0].trials) {
      progress.value.childIndex = 0
    }
    start()
  }

  function next() {
    finish()
    progressIncrease()
  }

  function start(status?: number) {
    const now = performance.now()
    if (!status) {
      test.value = getCurrentTest(progress.value)
    }
    const { trialDuration } = test.value.parameters
    emitter.emit('start')
    test.value.parameters.onStart?.(test.value)
    test.value.records = {
      startTime: now,
      events: []
    }

    if (typeof trialDuration === 'number') {
      timerId = window.setTimeout(() => {
        timerId = null
        next()
      }, trialDuration)
    }
  }

  function finish() {
    const now = performance.now()
    const { records } = test.value
    test.value.parameters.onFinish?.(test.value)
    records.timeElapsed = now - records.startTime
    cleanup()
    emitter.emit('finish')
  }

  function progressIncrease() {
    const { parentNode, trialData } = test.value
    const { index, childIndex } = progress.value
    const nextNode = trialNodes.value?.[index + 1]
    if (parentNode?.trials) {
      const maxChildIndex = parentNode.trials.length - 1
      const maxIndex = trialNodes.value.length - 1
      if (childIndex < maxChildIndex) {
        progress.value.childIndex = childIndex < 0 ? 0 : (childIndex + 1)
        start()
      } else {
        const failed = runFailed()
        if (failed) return
        if (index < maxIndex) {
          parentNode.parameters.onFinish?.(test.value)
          progress.value.index += 1
          progress.value.childIndex = nextNode?.parameters?.timeline ? 0 : -1
          start()
        } else {
          parentNode.parameters.onFinish?.(test.value)
          options.onFinish?.(test.value)
        }
      }
    } else {
      const maxIndex = trialNodes.value.length - 1
      if (index < maxIndex) {
        progress.value.index += 1
        progress.value.childIndex = nextNode?.parameters?.timeline ? 0 : -1
        start()
      } else {
        options.onFinish?.(test.value)
      }
    }
  }

  function getCurrentTest({ index, childIndex }: any) {
    return childIndex < 0 ? trialNodes.value[index] : trialNodes.value[index].trials[childIndex]
  }

  function setVariables(index: number, variables: unknown[]) {
    const { parameters } = trialNodes.value[index]
    parameters.timelineVariables = variables
    const newNode: any = { index, parameters }
    newNode.trials = createChildNodes(parameters, newNode),
    trialNodes.value[index] = newNode
  }

  function trigger(eventName: string, options?: any) {
    const now = performance.now()
    const { events } = test.value.records
    if (!events) return
    const prev = events.length > 0 ? events[events.length - 1] : null
    const lastTime = prev?.rt ?? test.value.startTime
    events.push({ eventName, now, rt: now - lastTime, ...(options ? options : {})})
  }

  function variables(key: string) {
    return new TimelineVariables(key)
  }

  function runFailed() {
    const failed = test.value.parentNode?.parameters.failed?.()
    if (!failed) return false
    test.value = {
      index: -2,
      parameters: failed,
      trialData: cloneData(failed.data)
    }
    start(-2)

    return true
  }

  function cleanup() {
    timerId && window.clearTimeout(timerId)
  }

  function to(index: number, childIndex: number) {
    if (isNil(index)) return
    progress.value.index = index
    progress.value.childIndex = isNil(childIndex) ? -1 : childIndex
    start()
  }

  function setData<T extends Record<string, any>>(obj: T) {
    const { trialData } = test.value
    test.value.trialData = Object.assign(trialData ?? {}, obj)
  }

  return psych
}

function createTrialNodes(timeline: TimelineNode[]) {
  const result: any[] = []
  let index = 0

  for (const parameters of timeline) {
    if (parameters.timeline) {
      const newNode: any = {
        index,
        parameters
      }
      newNode.trials = createChildNodes(parameters, newNode),
      result.push(newNode)
    } else {
      result.push({
        index,
        parameters,
        trialData: cloneData(parameters.data)
      })
    }
    index += 1
  }

  return result
}

function createChildNodes(node: any, parentNode: any) {
  const result: any = []
  node.timelineVariables.forEach((_: unknown, varsIndex: number) => {
    node.timeline!.forEach((child: Record<string, any>, childIndex: number) => {
      const location = [varsIndex, childIndex]
      result.push({
        id: `${varsIndex}-${childIndex}`,
        location,
        parentNode,
        parameters: child,
        trialData: cloneData(child.data, node, location)
      })
    })
  })

  return result
}
