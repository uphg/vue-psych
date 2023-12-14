import { provide, ref } from "vue"
import { cloneData } from "../shared/cloneData"
import type { TimelineNode } from "../types"
import { currentTestProviderKey, hasPsychProviderKey, psychProviderKey, templatesProviderKey } from "../shared/provider"
import { variables } from "../shared/variables"
import { isNil } from "../shared/isNil"

export type Psych = ReturnType<typeof useProviderPsych>
export type ProviderPsychOptions = {
  onStart?(data: Record<string, any>): void,
  onFinish?(data: Record<string, any>): void
}

export type TemplateOptions = {
  onStart(): void,
  onFinish(): void
}

/**
 * A trials instance injection function.
 * @param {object} [options] - option parameters.
 * @returns {object} Psych object, including common methods.
 * 
 * @example
 * const psych = useProviderPsych({ onStart() { ... }, onFinish() { ... } })
 * psych.run([...])
 */
export function useProviderPsych(options?: ProviderPsychOptions) {
  const timeline = ref<TimelineNode[]>([])
  const trialNodes = ref<any[]>([])
  const test = ref<any>({})
  const progress = ref({
    index: 0,
    childIndex: -1,
  })

  const templates = ref<Map<string, TemplateOptions>>(new Map())

  const psych = { run, next, to, variables, trigger, getData, setData, setVariables, getTest, getTrialNodes }

  let timerId: number | null = null

  provide(currentTestProviderKey, test)
  provide(hasPsychProviderKey, true)
  provide(psychProviderKey, psych)
  provide(templatesProviderKey, templates)

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
    startEffect()
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
    finishEffect()
  }

  function progressIncrease() {
    const { parentNode } = test.value
    const { index, childIndex } = progress.value
    const nextNode = trialNodes.value?.[index + 1]

    if (parentNode?.trials) {
      const maxChildIndex = parentNode.trials.length - 1
      const maxIndex = trialNodes.value.length - 1
      if (childIndex < maxChildIndex) {
        progress.value.childIndex = childIndex < 0 ? 0 : (childIndex + 1)
        start()
      } else {
        const later = runLater()
        if (later) return
        if (index < maxIndex) {
          progress.value.index += 1
          progress.value.childIndex = nextNode?.parameters?.timeline ? 0 : -1
          start()
        } else {
          options?.onFinish?.(test.value)
        }
      }
    } else {
      const maxIndex = trialNodes.value.length - 1
      if (index < maxIndex) {
        progress.value.index += 1
        progress.value.childIndex = nextNode?.parameters?.timeline ? 0 : -1
        start()
      } else {
        options?.onFinish?.(test.value)
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
    newNode.trials = createChildNodes(parameters, newNode, index),
    trialNodes.value[index] = newNode
  }

  function startEffect() {
    const { name } = test.value.parameters
    templates.value.get(name)?.onStart()
  }

  function finishEffect() {
    const { name } = test.value.parameters
    templates.value.get(name)?.onFinish()
  }

  function trigger(eventName: string, options?: any) {
    const now = performance.now()
    const { events } = test.value.records
    if (!events) return
    const prev = events.length > 0 ? events[events.length - 1] : null
    const lastTime = prev?.rt ?? test.value.startTime
    events.push({ eventName, now, rt: now - lastTime, ...(options ? options : {})})
  }

  function runLater() {
    const later = test.value.parentNode?.parameters.later?.()
    if (!later) return false
    test.value = {
      index: -2,
      parameters: later,
      trialData: cloneData(later.data)
    }
    start(-2)

    return true
  }

  function cleanup() {
    timerId && window.clearTimeout(timerId)
  }

  // function onStart(fn: Function) {

  // }

  // function onFinish(fn: Function) {

  // }

  function to(index: number, childIndex?: number) {
    if (isNil(index)) return
    if (index > 0) {
      finish()
    }
    progress.value.index = index
    progress.value.childIndex = isNil(childIndex) ? -1 : childIndex
    start()
  }

  function getTest(){
    return test.value
  }

  function getTrialNodes() {
    return trialNodes.value
  }

  function getData() {
    return test.value.trialData
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
        id: index,
        index,
        parameters
      }
      newNode.trials = createChildNodes(parameters, newNode, index),
      result.push(newNode)
    } else {
      result.push({
        id: index,
        index,
        parameters,
        trialData: cloneData(parameters.data)
      })
    }
    index += 1
  }

  return result
}

function createChildNodes(node: any, parentNode: any, parentIndex: number) {
  const result: any = []
  node.timelineVariables.forEach((_: unknown, varsIndex: number) => {
    node.timeline!.forEach((child: Record<string, any>, childIndex: number) => {
      const location = [varsIndex, childIndex]
      result.push({
        id: `${parentIndex}-${varsIndex}-${childIndex}`,
        location,
        parentNode,
        parameters: child,
        trialData: cloneData(child.data, node, location)
      })
    })
  })

  return result
}
