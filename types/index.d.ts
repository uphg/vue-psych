import _PsychPane from '../src/components/PsychPane'
import { Psych, PsychPluginHandler, TrialNode } from '../src/types'

export declare function useProviderPsych(options: Record<string, any>): Psych
export declare function usePsych(): Psych

export declare function keyboardResponse(): {
  load: (trial: TrialNode, psych: Psych, _handler?: PsychPluginHandler) => void
  unload: () => void
}

export declare const PsychPane: typeof _PsychPane
