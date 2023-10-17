export interface PsychComponent {
  getData: () => any
  next: () => void
  run: () => void
  setData: (value: any) => void
  variables: (key: string) => () => void
}