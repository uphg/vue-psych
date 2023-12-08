import { provide, ref } from "vue"
import { cloneData } from "../shared/cloneData"
import Emitter from "../shared/emitter"
import type { TimelineNode } from "../types"
import { currentNodeProviderKey, emitterProviderKey, hasPsychProviderKey, psychProviderKey } from "../shared/provider"
import { TimelineVariables } from "../shared/variables"
import { isNil } from "../shared/isNil"

export function useProviderPsych(options: any) {
  const timeline = ref<TimelineNode[]>([])
  const trialNodes = ref<any[]>([])
  const test = ref<any>({})
  const progress = ref({
    index: 0,
    childIndex: -1,
  })
  const emitter = new Emitter()
  const psych = { run, next, to, variables, trigger, getTrialNodes: () => trialNodes.value }
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
      } else if (index < maxIndex) {
        test.value.parentNode.parameters.onFinish?.()
        progress.value.index += 1
        progress.value.childIndex = nextNode?.parameters?.timeline ? 0 : -1
        start()
      } else {
        test.value.parentNode.parameters.onFinish?.()
        options.onFinish?.()
      }
    } else {
      const maxIndex = trialNodes.value.length - 1
      if (index < maxIndex) {
        progress.value.index += 1
        progress.value.childIndex = nextNode?.parameters?.timeline ? 0 : -1
        start()
      } else {
        options.onFinish?.()
      }
    }
  }

  function start() {
    emitter.emit('start')
    console.log('progress.value')
    console.log({...progress.value})
    test.value = getCurrentTest(progress.value)
    test.value.parameters.onStart?.()
    const { trialDuration } = test.value.parameters

    if (typeof trialDuration === 'number') {
      timerId = window.setTimeout(() => {
        timerId = null
        next()
      }, trialDuration)
    }
  }

  function finish() {
    test.value.parameters.onFinish?.()
    cleanup()
    emitter.emit('finish')
  }

  function getCurrentTest({ index, childIndex }: any) {
    console.log('trialNodes.value')
    console.log([...trialNodes.value])
    return childIndex < 0 ? trialNodes.value[index] : trialNodes.value[index].trials[childIndex]
  }

  function trigger(eventName: string, options?: any) {

  }

  function variables(key: string) {
    return new TimelineVariables(key)
  }

  function cleanup() {
    timerId && window.clearTimeout(timerId)
  }

  function to(index: number, childIndex: number) {
    if (isNil(index)) return
    progress.value.index = index
    if (!isNil(childIndex)) {
      progress.value.childIndex = childIndex
    }

    start()
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
